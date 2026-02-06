import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "../utils/supabaseClient";

const insertNewSubmission = async ({ data }) => {
    if (data.user_id) {
        const { data: submission, error } = await supabase
            .from("submission")
            .insert([data])
            .select();

        return submission;
    }

    return false;
};

export const useSubmissionCreate = (data) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            return await insertNewSubmission(data);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries();
                return data;
            },
            onSettled: () => {
                queryClient.invalidateQueries();
            },
            onError: () => {
                queryClient.invalidateQueries();
            },
        }
    );
};

//Get Submission by spefic filter
const getAllSubmissionsByFilter = async ({ queryKey }) => {
    const type = queryKey[1];
    const value = queryKey[2];

    if (type == "project") {
        let { data: submission, error } = await supabase
            .from("submission")
            .select(`*, shareholder(*), project(title, results)`)
            .eq("project_id", value)
            .eq("is_deleted", false)
            .order("created_at", { ascending: false });

        return submission;
    }

    if (type == "user") {
        let { data: submission, error } = await supabase
            .from("submission")
            .select("*")
            .eq("is_deleted", false)
            .eq("user_id", value);

        return submission;
    }

    return false;
};

export const useSubmissionsFilter = (type, value) => {
    return useQuery(
        ["AllSubmissionsByFilter", type, value],
        getAllSubmissionsByFilter,
        {
            cacheTime: 0, // Cache time in milliseconds, 0 means no caching
            staleTime: 0, // Mark data as stale immediately after fetching
            refetchOnMount: true, // Ensures refetch on component mount
            refetchOnReconnect: true, // Ensures refetch on component mount
            refetchOnWindowFocus: true, // Prevents refetching when window gains focus
        }
    );
};

const getSubmission = async ({ queryKey }) => {
    const id = queryKey[1];

    if (!id) return false;

    let { data: submission } = await supabase
        .from("submission")
        .select("*")
        .eq("id", id)
        .eq("is_deleted", false)
        .limit(1);

    submission = submission[0];

    return submission;
};

export const useSubmission = (id) => {
    return useQuery(["singleSumbission", id], getSubmission);
};

const updateSubmission = async ({ data }) => {
    const { data: submission, error } = await supabase
        .from("submission")
        .update([
            {
                date: data.date,
                result: data.result,
                note: data.note,
                contact_worker: data.contact_worker,
                user_id: data.user_id,
                user_name: data.user_name,
            },
        ])
        .eq("id", data.id);

    return submission;
};

export const useSubmissionUpdate = (data) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            return await updateSubmission(data);
        },
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries("singleSumbission");
                await queryClient.invalidateQueries(
                    "AllSubmissionsByProjectAndShareholder"
                );
                await queryClient.invalidateQueries(["AllSubmissionsByFilter"]);
                await queryClient.invalidateQueries(
                    "ProjectSingleWithShareholders"
                );
                return data;
            },
            onSettled: () => {
                queryClient.invalidateQueries("singleSumbission");
                queryClient.invalidateQueries(["AllSubmissionsByFilter"]);
                queryClient.invalidateQueries("ProjectSingleWithShareholders");
            },
        }
    );
};

//get all submission based on project_id and shareholder_id
const getAllSubmissionsByProjectAndShareholder = async ({ queryKey }) => {
    const project_id = queryKey[1];
    const shareholder_id = queryKey[2];

    if (!project_id || !shareholder_id) return false;

    let { data: submission, error } = await supabase
        .from("submission")
        .select("*, project(title, results)")
        .eq("project_id", project_id)
        .eq("shareholder_id", shareholder_id)
        .eq("is_deleted", false);
    return submission;
};

export const useSubmissionsByProjectAndShareholder = (
    project_id,
    shareholder_id
) => {
    return useQuery(
        ["AllSubmissionsByProjectAndShareholder", project_id, shareholder_id],
        getAllSubmissionsByProjectAndShareholder,
        {
            cacheTime: 0, // Cache time in milliseconds, 0 means no caching
            staleTime: 0, // Mark data as stale immediately after fetching
            refetchOnMount: true, // Ensures refetch on component mount
            refetchOnWindowFocus: false, // Prevents refetching when window gains focus
        }
    );
};

const deleteSubmission = async ({ submissionID, result, projectID }) => {
    const { data: submission, error } = await supabase
        .from("submission")
        .update({ is_deleted: true })
        .eq("id", submissionID);

    return submission;
};

export const useSubmissionDelete = (data) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            return await deleteSubmission(data);
        },
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries("singleSumbission");
                await queryClient.invalidateQueries(
                    "AllSubmissionsByProjectAndShareholder"
                );
                await queryClient.invalidateQueries(["AllSubmissionsByFilter"]);
                await queryClient.invalidateQueries(
                    "ProjectSingleWithShareholders"
                );
                return data;
            },
            onSettled: () => {
                queryClient.invalidateQueries("singleSumbission");
                queryClient.invalidateQueries(["AllSubmissionsByFilter"]);
                queryClient.invalidateQueries("ProjectSingleWithShareholders");
            },
        }
    );
};
