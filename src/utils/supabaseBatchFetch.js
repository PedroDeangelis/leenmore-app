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
    tiebreakColumn = "id",
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
                    // Tiebreak so rows sharing an orderColumn value keep a
                    // stable position across batches (e.g. duplicate `no`).
                    .order(tiebreakColumn, { ascending })
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

/**
 * Fetch ONE page of rows using keyset pagination.
 *
 * Unlike fetchAllInBatches (which drains every row and is for exports), this is
 * for on-screen lists. Keyset (.gt/.lt on a stable column) is used instead of
 * .range() so deep pages don't make Postgres scan and discard every preceding
 * row -- at 30k+ rows that dominates the query cost.
 *
 * @param {Object} params
 * @param {string} params.table
 * @param {Object} [params.match]      Equality filters.
 * @param {string} [params.columns]
 * @param {string} [params.orderColumn] Stable, indexed cursor column.
 * @param {boolean} [params.ascending]
 * @param {number} [params.limit]
 * @param {*} [params.cursor]          Last seen orderColumn value, or null.
 * @param {Array<{columns: string[], value: string}>} [params.search]
 *   OR-ed case-insensitive substring filters, applied server-side.
 * @returns {Promise<{rows: Array, nextCursor: *}>}
 */
export const fetchPage = async ({
    table,
    match = {},
    columns = "*",
    orderColumn = "id",
    ascending = true,
    limit = 40,
    cursor = null,
    search = null,
    tiebreakColumn = "id",
}) => {
    let query = supabase.from(table).select(columns);

    Object.entries(match).forEach(([column, value]) => {
        query = query.eq(column, value);
    });

    // Two independent .or() calls would be AND-ed by PostgREST in a way that is
    // easy to get wrong, so each group is built as a single explicit clause.
    if (search && search.value) {
        // Strip PostgREST's or() delimiters and wildcard before interpolating.
        const term = String(search.value).replace(/[,()*]/g, "");
        if (term) {
            query = query.or(
                search.columns
                    .map((column) => `${column}.ilike.*${term}*`)
                    .join(","),
            );
        }
    }

    // Composite cursor. orderColumn alone is not safe: `shareholder.no` has
    // duplicates within a project, and a plain .gt() would skip the rest of a
    // tied group. Compare on (orderColumn, tiebreakColumn) instead.
    if (cursor !== null && cursor !== undefined) {
        const { value, tiebreak } = cursor;
        const op = ascending ? "gt" : "lt";

        query = query.or(
            `${orderColumn}.${op}.${value},` +
                `and(${orderColumn}.eq.${value},${tiebreakColumn}.${op}.${tiebreak})`,
        );
    }

    const { data, error } = await query
        .order(orderColumn, { ascending })
        .order(tiebreakColumn, { ascending })
        .limit(limit);

    if (error) throw error;

    const rows = data || [];
    const last = rows[rows.length - 1];

    return {
        rows,
        nextCursor:
            rows.length === limit && last
                ? { value: last[orderColumn], tiebreak: last[tiebreakColumn] }
                : null,
    };
};
