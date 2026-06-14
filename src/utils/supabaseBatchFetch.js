import supabase from "./supabaseClient";

// Supabase applies a default hard cap (typically 1,000 rows) to any select that
// does not paginate. This helper fetches every matching row by ranging over the
// full count in fixed-size batches, so callers never silently lose data past the
// first page.
const DEFAULT_BATCH_SIZE = 1000;
const DEFAULT_CONCURRENCY = 5;

/**
 * Fetch all rows from a table matching a set of equality filters, paging past
 * Supabase's default row cap.
 *
 * @param {Object} params
 * @param {string} params.table       Table name.
 * @param {Object} [params.match]     Equality filters, e.g. { project_id, is_deleted: false }.
 * @param {string} [params.columns]   Columns to select (defaults to "*").
 * @param {string} [params.orderColumn] Stable column to order by so range
 *   windows don't overlap or skip rows (defaults to "id").
 * @param {boolean} [params.ascending] Order direction (defaults to true).
 * @param {number} [params.batchSize] Rows per batch (defaults to 1000).
 * @param {number} [params.concurrency] Max batches fetched in parallel (defaults to 5).
 * @returns {Promise<Array>} Every matching row.
 */
export const fetchAllInBatches = async ({
    table,
    match = {},
    columns = "*",
    orderColumn = "id",
    ascending = true,
    batchSize = DEFAULT_BATCH_SIZE,
    concurrency = DEFAULT_CONCURRENCY,
}) => {
    const applyMatch = (query) => {
        Object.entries(match).forEach(([column, value]) => {
            query = query.eq(column, value);
        });
        return query;
    };

    // First, get the exact count so we can build all ranges upfront.
    const { count, error: countError } = await applyMatch(
        supabase.from(table).select(orderColumn, { count: "exact", head: true }),
    );

    if (countError) throw countError;

    if (!count) {
        return [];
    }

    const batches = [];
    for (let from = 0; from < count; from += batchSize) {
        batches.push({ from, to: from + batchSize - 1 });
    }

    // Fetch batches in parallel, capping concurrency to avoid DB overload.
    const results = [];

    for (let i = 0; i < batches.length; i += concurrency) {
        const chunk = batches.slice(i, i + concurrency);
        const chunkResults = await Promise.all(
            chunk.map(({ from, to }) =>
                applyMatch(supabase.from(table).select(columns))
                    .order(orderColumn, { ascending })
                    .range(from, to)
                    .then(({ data, error }) => {
                        if (error) throw error;
                        return data || [];
                    }),
            ),
        );
        results.push(...chunkResults.flat());
    }

    return results;
};
