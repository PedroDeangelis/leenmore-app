import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "../utils/supabaseClient";
import { fetchAllInBatches, fetchPage } from "../utils/supabaseBatchFetch";

const SHAREHOLDER_FETCH_BATCH_SIZE = 1000;
const SHAREHOLDER_INSERT_BATCH_SIZE = 1000;
const EMPTY_MISSING_SHAREHOLDERS = [];

const buildShareholderInsertKey = (shareholder = {}) =>
    [
        shareholder.project_id ?? "",
        shareholder.registration ?? "",
        shareholder.no ?? "",
        shareholder.shares ?? "",
    ]
        .map((value) => String(value))
        .join("::");

const DEFAULT_SHAREHOLDER_PROJECT_COLUMNS = [
    "id",
    "project_id",
    "registration",
    "no",
    "shares",
    "name",
    "date_of_birth_code",
    "sex",
    "shares_total",
    "address",
    "result",
].join(", ");

// Everything ShareholderTable actually renders. Use this instead of "*" -- the
// table would silently blank columns on the smaller default set above.
export const SHAREHOLDER_TABLE_COLUMNS = [
    "id",
    "project_id",
    "no",
    "name",
    "registration",
    "sex",
    "shares",
    "shares_total",
    "contact_info",
    "contact_info_2",
    "database",
    "contact_worker",
    "eletronic_voting",
    "address",
    "user",
    "result",
    "person_type",
    "date_of_birth",
    "date_of_birth_code",
    "prev_result",
    "prev_comment",
    "prev_note",
    "last_note",
    "api_recipient_contact",
    "api_recipient_completion_date",
].join(", ");

// Minimal set for the results/percentage aggregation. Dropping any of the
// eletronic_voting / api_recipient_* fields silently changes the reported
// e-vote and e-proxy totals, so they must stay.
export const SHAREHOLDER_RESULT_COLUMNS = [
    "id",
    "project_id",
    "no",
    "shares",
    "result",
    "eletronic_voting",
    "api_recipient_contact",
    "api_recipient_completion_date",
].join(", ");

export const fetchShareholdersFromProject = ({ project_id, columns }) =>
    fetchAllInBatches({
        table: "shareholder",
        match: { project_id },
        columns: columns || DEFAULT_SHAREHOLDER_PROJECT_COLUMNS,
        // Order by `no`, not `id`: `no` rides idx_shareholder_project_id, while
        // `id desc` abandons it and scans the pkey backwards (measured 1014ms vs
        // 77ms for a page on a 134k-shareholder project).
        orderColumn: "no",
        ascending: true,
        batchSize: SHAREHOLDER_FETCH_BATCH_SIZE,
    });

const getShareholdersFromProject = async ({ queryKey }) => {
    const project_id = queryKey[1];
    const options = queryKey[2] || {};

    if (!project_id) {
        return [];
    }

    return fetchShareholdersFromProject({
        project_id,
        columns: options.columns,
    });
};

export const useShareholdersFromProject = (id, options = {}) => {
    // Key on the primitive, not the options object: an object literal is a new
    // reference on every render.
    return useQuery(
        ["shareholdersFromProject", id, options?.columns ?? null],
        ({ queryKey }) =>
            queryKey[1]
                ? fetchShareholdersFromProject({
                      project_id: queryKey[1],
                      columns: queryKey[2] || undefined,
                  })
                : [],
        {
            enabled: !!id,
            keepPreviousData: true,
        },
    );
};

/**
 * One page of a project's shareholders, searched and paginated server-side.
 * Use this for on-screen lists instead of downloading every row.
 */
export const useProjectShareholderPage = ({
    projectId,
    search = "",
    cursor = null,
    limit = 40,
    columns = SHAREHOLDER_TABLE_COLUMNS,
}) =>
    useQuery(
        ["projectShareholderPage", projectId, search, cursor, limit],
        () =>
            fetchPage({
                table: "shareholder",
                match: { project_id: projectId },
                columns,
                orderColumn: "no",
                ascending: true,
                limit,
                cursor,
                search: search
                    ? {
                          columns: ["name", "registration", "contact_worker"],
                          value: search,
                      }
                    : null,
            }),
        { enabled: !!projectId, keepPreviousData: true },
    );

/**
 * Per-result share totals for a project, aggregated server-side.
 *
 * Replaces downloading every shareholder row just to sum shares per result:
 * project 207 has 62,284 shareholders, and the client-side version fetched all
 * of them (x25 columns, ~63 sequential batches) before the page could render.
 * The RPC returns ~18 rows in ~140ms.
 *
 * Buckets are the raw `result` string, plus two synthetic ones for the rows
 * that override it. See getPercentageRateForShareholder.js for how these map
 * onto the displayed result list.
 */
export {
    PROJECT_TALLY_BUCKET_EV,
    PROJECT_TALLY_BUCKET_EPROXY,
    PROJECT_TALLY_BUCKET_NULL,
} from "../pages/Admin/components/shareholderTallyBuckets";

export const fetchProjectShareholderTally = async (project_id) => {
    if (!project_id) return null;

    const { data, error } = await supabase.rpc(
        "project_shareholder_result_tally",
        { p_project_id: Number(project_id) },
    );

    if (error) throw error;

    const buckets = new Map();
    let shareholderCount = 0;

    (data || []).forEach((row) => {
        // `cnt` is bigint and `total_shares` is numeric; PostgREST serializes
        // both as STRINGS to avoid precision loss. Without these casts the
        // downstream `+=` in getPercentageRateForShareholder concatenates
        // instead of adding, and totals render as garbage.
        const count = Number(row.cnt) || 0;
        const totalShares = Number(row.total_shares) || 0;

        shareholderCount += count;
        buckets.set(String(row.bucket), {
            count,
            totalShares: Math.trunc(totalShares),
        });
    });

    // The row count comes free: every shareholder lands in exactly one bucket,
    // so summing counts avoids a separate count("exact") request.
    return { buckets, shareholderCount };
};

export const useProjectShareholderTally = (projectId) =>
    useQuery(
        ["projectShareholderTally", projectId],
        ({ queryKey }) => fetchProjectShareholderTally(queryKey[1]),
        { enabled: !!projectId, keepPreviousData: true },
    );

//insert Shareholders
const insertShareholdersList = async (data) => {
    let shareholders = Array.isArray(data?.shareholdersList)
        ? [...data.shareholdersList]
        : [];
    const currentShareholders = Array.isArray(data?.currentShareholders)
        ? data.currentShareholders
        : [];

    shareholders = shareholders
        .filter(
            (shareholder) =>
                String(shareholder?.registration ?? "").trim() !== "",
        )
        .map((value, key) => ({
            project_id: data.project_id,
            row: key + 1,
            ...value,
        }));

    // Use a set-based key lookup so large imports do not degrade to O(n * m).
    const currentShareholderKeys = new Set(
        currentShareholders.map((shareholder) =>
            buildShareholderInsertKey(shareholder),
        ),
    );
    const incomingShareholderKeys = new Set();

    const formatedShareholders = shareholders.filter((shareholder) => {
        const shareholderKey = buildShareholderInsertKey(shareholder);

        if (
            currentShareholderKeys.has(shareholderKey) ||
            incomingShareholderKeys.has(shareholderKey)
        ) {
            return false;
        }

        incomingShareholderKeys.add(shareholderKey);
        return true;
    });

    if (formatedShareholders?.length) {
        for (
            let index = 0;
            index < formatedShareholders.length;
            index += SHAREHOLDER_INSERT_BATCH_SIZE
        ) {
            const shareholderBatch = formatedShareholders.slice(
                index,
                index + SHAREHOLDER_INSERT_BATCH_SIZE,
            );
            const { error: shareError } = await supabase
                .from("shareholder")
                .insert(shareholderBatch);

            if (shareError) {
                throw shareError;
            }
        }
    }

    return true;
};

export const useShareholderInsert = (data) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (data) => {
            return await insertShareholdersList(data);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("shareholdersFromProject");
                queryClient.invalidateQueries("ProjectSingleWithShareholders");
                queryClient.invalidateQueries("projectShareholderPage");
                queryClient.invalidateQueries("projectShareholderTally");
                queryClient.invalidateQueries("AllSubmissionsByFilter");
                return data;
            },
        },
    );
};

//Update Shareholders List

const SHAREHOLDER_UPDATE_BATCH_SIZE = 500;

const updateShareholders = async ({ formatedShareholders: shareholders }) => {
    const list = Array.isArray(shareholders) ? shareholders : [];

    // O(n) dedupe. The previous filter+findIndex was O(n^2), which froze the
    // main thread for minutes on a 30k-row spreadsheet.
    const byId = new Map();
    for (const shareholder of list) {
        byId.set(shareholder.id, shareholder);
    }
    const uniqueShareholders = [...byId.values()];

    // Chunked: a single upsert of tens of thousands of rows exceeds the
    // request limits. Errors now propagate instead of being swallowed.
    for (
        let index = 0;
        index < uniqueShareholders.length;
        index += SHAREHOLDER_UPDATE_BATCH_SIZE
    ) {
        const { error } = await supabase
            .from("shareholder")
            .upsert(
                uniqueShareholders.slice(
                    index,
                    index + SHAREHOLDER_UPDATE_BATCH_SIZE,
                ),
            );

        if (error) {
            throw error;
        }
    }

    return true;
};

export const useShareholderUpdate = (data) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (data) => {
            return await updateShareholders(data);
        },
        {
            // Targeted invalidation: a bare invalidateQueries() dropped every
            // cached query in the app and re-triggered full shareholder drains.
            onSuccess: (result, variables) => {
                const projectId = variables?.project_id;

                queryClient.invalidateQueries("ProjectSingleWithShareholders");
                queryClient.invalidateQueries("projectShareholderPage");
                queryClient.invalidateQueries("projectShareholderTally");
                queryClient.invalidateQueries([
                    "shareholdersFromProject",
                    projectId,
                ]);

                return result;
            },
        },
    );
};
//Update Shareholder And Submission List

const updateShareholderAndSubmission = async ({
    shareholderID,
    submissionID,
    result,
}) => {
    const { data, error } = await supabase.from("shareholder").upsert({
        id: shareholderID,
        result: result,
    });

    const { data: sub, error: subError } = await supabase
        .from("submission")
        .upsert({
            id: submissionID,
            result: result,
        });

    return error;
};

export const useShareholderAndSubmissionUpdate = (data) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (data) => {
            return await updateShareholderAndSubmission(data);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("AllSubmissionsByFilter");
                return data;
            },
        },
    );
};

//
const getShareholderFromWorker = async ({ queryKey }) => {
    const id = queryKey[1];
    const user_name = queryKey[2];

    let { data, error } = await supabase
        .from("shareholder")
        .select(`*, project(results), submission(*, is_deleted)`)
        .filter("submission.is_deleted", "eq", false)
        .eq("id", id)
        .contains("user", [user_name]);

    if (error || !data?.length) {
        return false;
    }

    return data[0];
};

export const useShareholderFromWorker = (id, user) => {
    return useQuery(
        ["ShareholderFromWorker", id, user],
        getShareholderFromWorker,
    );
};

const getShareholder = async ({ queryKey }) => {
    const id = queryKey[1];

    if (!id) return false;

    let { data, error } = await supabase
        .from("shareholder")
        .select(`*`)
        .eq("id", id);

    if (error || !data?.length) {
        return false;
    }

    return data[0];
};

export const useShareholder = (id) => {
    return useQuery(["Shareholder", id], getShareholder);
};

const deleteShareholder = async (id) => {
    const { data, error } = await supabase
        .from("shareholder")
        .delete()
        .eq("id", id);

    return error;
};

export const useShareholderDelete = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (data) => {
            return await deleteShareholder(data.id);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ProjectSingle");
                queryClient.invalidateQueries("AllSubmissionsByFilter");
                queryClient.invalidateQueries("ProjectSingleWithShareholders");
                queryClient.invalidateQueries("projectShareholderPage");
                queryClient.invalidateQueries("projectShareholderTally");
                return data;
            },
        },
    );
};

// Update shareholder last result
const updateShareholderLastResult = async ({ shareholderID, result }) => {
    const { data, error } = await supabase
        .from("shareholder")
        .update({ result: result })
        .eq("id", shareholderID);

    return error;
};

export const useShareholderLastResultUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (data) => {
            return await updateShareholderLastResult(data);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ProjectSingleWithShareholders");
                queryClient.invalidateQueries("projectShareholderPage");
                queryClient.invalidateQueries("projectShareholderTally");
                return data;
            },
        },
    );
};

const getProjectIdsByShareholderUser = async (user) => {
    const { data, error } = await supabase
        .from("shareholder")
        .select("project_id, project!inner(id, status)")
        .contains("user", [user])
        .in("project.status", ["publish", "draft"]);

    if (error) throw error;

    return [...new Set((data || []).map((row) => row.project_id))];
};

const mapShareholdersWithProject = (shareholders = []) => {
    return shareholders.map((shareholder) => ({
        ...shareholder,
        project_id: shareholder.project?.id ?? shareholder.project_id,
        project_title: shareholder.project?.title,
        project_results: shareholder.project?.results,
    }));
};

// useAllShareholdersByUser
const getAllShareholdersByUser = async ({ queryKey }) => {
    const user = queryKey[1];
    if (!user) return [];

    try {
        const projectIds = await getProjectIdsByShareholderUser(user);
        if (!projectIds.length) return [];

        const { data: shareholders, error } = await supabase
            .from("shareholder")
            .select(
                `
      *,
      project:project_id (
        id,
        title,
        results
      )
    `,
            )
            .in("project_id", projectIds)
            .order("id", { ascending: false });

        if (error) {
            throw error;
        }

        return mapShareholdersWithProject(shareholders || []);
    } catch (error) {
        console.error("Shareholder query error:", error);
        return [];
    }
};

export const useAllShareholdersByUser = (user) => {
    return useQuery(["AllShareholdersByUser", user], getAllShareholdersByUser);
};

const getShareholderSearchByUser = async ({ queryKey }) => {
    const user = queryKey[1];
    const search = String(queryKey[2] ?? "").trim();
    if (!user || !search) return [];

    const searchTerm = search
        .replace(/[%_\\]/g, "\\$&")
        .replace(/[(),]/g, " ")
        .trim();

    // Step 1: Get project IDs where this user appears in ANY shareholder's user array
    const { data: userProjects, error: projectError } = await supabase
        .from("shareholder")
        .select("project_id")
        .contains("user", [user]); // GIN index hit — fast

    if (projectError) throw projectError;

    const projectIds = [
        ...new Set((userProjects || []).map((r) => r.project_id)),
    ];
    if (!projectIds.length) return [];

    // Step 2: Search ALL shareholders in those projects
    const { data: shareholders, error } = await supabase
        .from("shareholder")
        .select(
            `
            *,
            project:project_id (
                id,
                title,
                results,
                status
            )
        `,
        )
        .in("project_id", projectIds) // btree index hit
        .in("project.status", ["publish", "draft"])
        .or(
            `registration.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,contact_worker.ilike.%${searchTerm}%`,
        )
        .order("id", { ascending: false })
        .limit(10);

    if (error) throw error;

    return mapShareholdersWithProject(
        (shareholders || []).filter((s) => s.project !== null),
    );
};

export const useShareholderSearchByUser = (user, search) => {
    const normalizedSearch = String(search ?? "").trim();

    return useQuery(
        ["ShareholderSearchByUser", user, normalizedSearch],
        getShareholderSearchByUser,
        {
            enabled: !!user && !!normalizedSearch,
        },
    );
};

// Admin shareholder search: every row, across all projects, whose
// date_of_birth_code or registration exactly matches the searched number.
export const SHAREHOLDER_SEARCH_ADMIN_LIMIT = 1000;

// The importer stores registration / date_of_birth_code as digits only, so
// "900101-1234567" must be searched as "9001011234567".
export const normalizeShareholderSearch = (search) =>
    String(search ?? "").replace(/\D/g, "");

const getShareholderSearchAdmin = async ({ queryKey }) => {
    const digits = queryKey[1];
    if (!digits) return [];

    const { data: shareholders, error } = await supabase
        .from("shareholder")
        .select(
            `
            *,
            project:project_id!inner (
                id,
                title,
                results,
                status
            )
        `,
        )
        // digits only, so safe to interpolate into .or()
        .or(`date_of_birth_code.eq.${digits},registration.eq.${digits}`)
        .in("project.status", ["publish", "draft"])
        .order("name", { ascending: true })
        .order("project_id", { ascending: false })
        .limit(SHAREHOLDER_SEARCH_ADMIN_LIMIT);

    if (error) throw error;

    return mapShareholdersWithProject(shareholders || []);
};

export const useShareholderSearchAdmin = (search) => {
    const digits = normalizeShareholderSearch(search);

    return useQuery(
        ["ShareholderSearchAdmin", digits],
        getShareholderSearchAdmin,
        {
            enabled: !!digits,
        },
    );
};

// getMissingShareholdersFromEsignon
// send the project id to https://leenmore-storage.lndo.site/get-not-found-shareholders and get the list of shareholders that are not found in esignon
const normalizeMissingShareholdersPayload = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.missingShareholders)) {
        return payload.missingShareholders;
    }

    if (Array.isArray(payload?.shareholders)) {
        return payload.shareholders;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    return EMPTY_MISSING_SHAREHOLDERS;
};

const getMissingShareholdersFromEsignon = async (project_id) => {
    const normalizedProjectId =
        typeof project_id === "object"
            ? (project_id?.project?.id ?? project_id?.id)
            : project_id;

    if (!normalizedProjectId) {
        return [];
    }

    const response = await axios.post(
        `${process.env.REACT_APP_STORAGE_PATH}get-not-found-shareholders`,
        // `https://leenmore-storage.lndo.site/get-not-found-shareholders`,
        {
            project_id: normalizedProjectId,
            token: process.env.REACT_APP_STORAGE_AUTH_KEY,
        },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data",
            },
        },
    );

    return normalizeMissingShareholdersPayload(response.data);
};

export const useMissingShareholdersFromEsignon = (project) => {
    const project_id = project?.project?.id ?? project?.id;

    const mutation = useMutation(async (providedProjectId) => {
        const targetProjectId = providedProjectId ?? project_id;
        return await getMissingShareholdersFromEsignon(targetProjectId);
    });

    return {
        ...mutation,
        missingShareholders: mutation.data ?? EMPTY_MISSING_SHAREHOLDERS,
    };
};

const getShareholderEproxy = async ({ queryKey }) => {
    const project_id = queryKey[1];

    if (!project_id) {
        return [];
    }

    // Paged: this select previously had no .range(), so Supabase silently
    // capped it at 1000 rows. No project is near that cap today, but a larger
    // one would have lost e-proxy rows with no error.
    const PAGE = 1000;
    const collected = [];

    for (let from = 0; ; from += PAGE) {
        const { data, error } = await supabase
            .from("shareholder")
            .select(SHAREHOLDER_TABLE_COLUMNS)
            .eq("project_id", project_id)
            .not("api_recipient_contact", "is", null)
            .neq("api_recipient_contact", "")
            .not("api_recipient_completion_date", "is", null)
            .neq("api_recipient_completion_date", "")
            .order("id", { ascending: true })
            .range(from, from + PAGE - 1);

        if (error) {
            console.error(
                "Error fetching shareholders with eproxy no result:",
                error,
            );
            return collected;
        }

        collected.push(...(data || []));

        if (!data || data.length < PAGE) break;
    }

    return collected.filter(
        (s) =>
            s.api_recipient_contact?.trim() &&
            s.api_recipient_completion_date?.trim(),
    );
};

export const useShareholderEproxy = (project_id) => {
    return useQuery(["ShareholderEproxy", project_id], getShareholderEproxy, {
        enabled: !!project_id,
        keepPreviousData: true,
    });
};
