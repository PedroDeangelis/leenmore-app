import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "../utils/supabaseClient";

const getShareholdersFromProject = async ({ queryKey }) => {
    const project_id = queryKey[1];

    let { data, error } = await supabase
        .from("shareholder")
        .select("*")
        .eq("project_id", project_id)
        .order("id", { ascending: false });

    return data;
};

export const useShareholdersFromProject = (id) => {
    return useQuery(
        ["shareholdersFromProject", id],
        getShareholdersFromProject,
    );
};

//insert Shareholders
const insertShareholdersList = async (data) => {
    let shareholders = [...data.shareholdersList];
    let currentShareholders = [...data.currentShareholders];

    shareholders = shareholders
        .filter((shareholder) => shareholder.registration !== "")
        .map((value, key) => ({
            project_id: data.project_id,
            row: key + 1,
            ...value,
        }));

    //check if the shareholder are in the current shareholders by project_id, registration, no, shares
    var formatedShareholders = shareholders.map((shareholder) => {
        const currentShareholder = currentShareholders.find(
            (current) =>
                current.project_id == shareholder.project_id &&
                current.registration == shareholder.registration &&
                current.no == shareholder.no &&
                current.shares == shareholder.shares,
        );

        if (!currentShareholder) {
            return {
                ...shareholder,
            };
        }

        return false;
    });

    //remove false values
    formatedShareholders = formatedShareholders.filter(
        (shareholder) => shareholder,
    );

    if (formatedShareholders?.length) {
        const { data: shareholderData, error: shareError } = await supabase
            .from("shareholder")
            .insert(formatedShareholders);
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

    console.log("uniqueShareholders", uniqueShareholders);

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

    // 1) Get ONLY publish project IDs where at least one shareholder has this user
    const { data: projects, error: pErr } = await supabase
        .from("project")
        .select(`id, shareholder!inner(id)`) // inner join ensures project must have matching shareholder
        .eq("status", "publish")
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
