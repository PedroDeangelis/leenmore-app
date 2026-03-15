import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "../utils/supabaseClient";

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

export const fetchShareholdersFromProject = async ({
    project_id,
    columns = DEFAULT_SHAREHOLDER_PROJECT_COLUMNS,
}) => {
    const shareholders = [];

    for (let from = 0; ; from += SHAREHOLDER_FETCH_BATCH_SIZE) {
        const to = from + SHAREHOLDER_FETCH_BATCH_SIZE - 1;
        const { data, error } = await supabase
            .from("shareholder")
            .select(columns)
            .eq("project_id", project_id)
            .order("id", { ascending: false })
            .range(from, to);

        if (error) {
            throw error;
        }

        if (!data?.length) {
            break;
        }

        shareholders.push(...data);

        if (data.length < SHAREHOLDER_FETCH_BATCH_SIZE) {
            break;
        }
    }

    return shareholders;
};

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
    return useQuery(
        ["shareholdersFromProject", id, options],
        getShareholdersFromProject,
        {
            enabled: !!id,
            keepPreviousData: true,
        },
    );
};

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
                queryClient.invalidateQueries("AllSubmissionsByFilter");
                return data;
            },
        },
    );
};

//Update Shareholders List

const updateShareholders = async ({ formatedShareholders: shareholders }) => {
    const uniqueShareholders = shareholders.filter(
        (s, index, self) => index === self.findIndex((t) => t.id === s.id),
    );

    const { data, error } = await supabase
        .from("shareholder")
        .upsert(uniqueShareholders);

    return false;
};

export const useShareholderUpdate = (data) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (data) => {
            return await updateShareholders(data);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ProjectSingleWithShareholders");
                queryClient.invalidateQueries();
                return data;
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
                return data;
            },
        },
    );
};

// useAllShareholdersByUser
const getAllShareholdersByUser = async ({ queryKey }) => {
    const user = queryKey[1];
    if (!user) return false;

    // 1) Get publish or draft project IDs where at least one shareholder has this user
    const { data: projects, error: pErr } = await supabase
        .from("project")
        .select(`id, shareholder!inner(id)`) // inner join ensures project must have matching shareholder
        .in("status", ["publish", "draft"])
        .contains("shareholder.user", [user]);

    if (pErr) {
        console.error("Project id query error:", pErr);
        return false;
    }

    const projectIds = [...new Set((projects || []).map((p) => p.id))];
    if (!projectIds.length) return [];

    // 2) Get ALL shareholders for those projects (no user filter here)
    const { data: shareholders, error: sErr } = await supabase
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

    if (sErr) {
        console.error("Shareholder query error:", sErr);
        return false;
    }

    // flatten project fields like you were doing
    return (shareholders || []).map((s) => ({
        ...s,
        project_id: s.project?.id ?? s.project_id,
        project_title: s.project?.title,
        project_results: s.project?.results,
    }));
};

export const useAllShareholdersByUser = (user) => {
    return useQuery(["AllShareholdersByUser", user], getAllShareholdersByUser);
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

// get shareholder eproxy no result

const getShareholderEproxyNoResult = async ({ queryKey }) => {
    const project_id = queryKey[1];

    if (!project_id) {
        return [];
    }

    const { data, error } = await supabase
        .from("shareholder")
        .select("*")
        .eq("project_id", project_id)
        .or('result.is.null,result.eq.""')
        .not("api_recipient_contact", "is", null)
        .not("api_recipient_completion_date", "is", null);

    if (error) {
        console.error(
            "Error fetching shareholders with eproxy no result:",
            error,
        );
        return [];
    }

    return (data || []).filter((shareholder) => {
        const hasRecipientContact =
            String(shareholder?.api_recipient_contact ?? "").trim() !== "";
        const hasCompletionDate =
            String(shareholder?.api_recipient_completion_date ?? "").trim() !==
            "";

        return hasRecipientContact && hasCompletionDate;
    });
};

export const useShareholderEproxyNoResult = (project_id) => {
    return useQuery(
        ["ShareholderEproxyNoResult", project_id],
        getShareholderEproxyNoResult,
        {
            enabled: !!project_id,
            keepPreviousData: true,
        },
    );
};
