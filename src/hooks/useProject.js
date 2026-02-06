import { useMutation, useQuery, useQueryClient } from "react-query";
import transl from "../pages/components/translate";
import supabase from "../utils/supabaseClient";

//Get list of All projects

const getAllProjects = async () => {
    let { data: project, error } = await supabase
        .from("project")
        .select(`*, shareholder (*)`)
        .filter("status", "in", '("publish","draft")')
        .order("id", { ascending: false });

    return project;
};

export const useProjectsList = () => {
    return useQuery(["ProjectsList"], getAllProjects);
};

const getSingleProjectWithShareholders = async ({ queryKey }) => {
    const project_id = queryKey[1];

    let { data, error } = await supabase
        .from("project")
        .select(`*, shareholder(*)`)
        .eq("id", project_id);

    return data[0];
};

export const useSingleProjectWithShareholders = (id) => {
    return useQuery(
        ["SingleProjectWithShareholders", id],
        getSingleProjectWithShareholders
    );
};

//Get single Project
const getProject = async ({ queryKey }) => {
    const project_id = queryKey[1];

    //check if id is undefined
    if (!project_id) return false;

    let { data, error } = await supabase
        .from("project")
        .select("*")
        .eq("id", project_id);

    let projectData = false;
    if (!error) {
        projectData = [...data];
        projectData = projectData[0];
    }

    return projectData;
};

export const useProject = (id) => {
    return useQuery(["ProjectSingle", id], getProject);
};

//Create Project
const createProject = async (project) => {
    const { data, error } = await supabase
        .from("project")
        .insert([
            {
                title: project.title,
                results: project.results,
                status: project.status,
                shares_issued: project.shares_issued,
                shares_target: project.shares_target,
                start_date: project.start_date,
                end_date: project.end_date,
            },
        ])
        .select();

    if (error) {
        return { data: data, error: error };
    }

    let shareholders = [...project.shareholders];

    shareholders = shareholders
        .filter((shareholder) => shareholder.registration !== "")
        .map((value, key) => ({
            project_id: data[0].id,
            row: key + 1,
            ...value,
        }));

    const { data: shareholderData, error: shareError } = await supabase
        .from("shareholder")
        .insert(shareholders);

    return data[0];
};

export const useProjectCreate = (project) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (project) => {
            return await createProject(project);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ProjectsList");
                return data;
            },
        }
    );
};

//Update Project

const updateProject = async ({ project_id, meta }) => {
    const { data, error } = await supabase
        .from("project")
        .update(meta)
        .eq("id", project_id);

    return data;
};

export const useProjecUpdate = (project_id, meta) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (project_id, meta) => {
            return await updateProject(project_id, meta);
        },
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries("ProjectsList");
                await queryClient.invalidateQueries("ProjectSingle");
                await queryClient.invalidateQueries(
                    "ProjectSingleWithShareholders"
                );
                return data;
            },
            onSettled: () => {
                queryClient.refetchQueries("ProjectsList");
                queryClient.refetchQueries("ProjectSingle");
                queryClient.refetchQueries("ProjectSingleWithShareholders");
            },
        }
    );
};

//Get APP list for specif user
const getProjectsOfSpecificUser = async ({ queryKey }) => {
    const user = queryKey[1];

    let { data: project, error } = await supabase
        .from("project")
        .select(`*, shareholder(*)`)
        .eq("status", "publish")
        .contains("shareholder.user", [user]);

    if (error || !project?.length) {
        return false;
    }

    return project.filter((i) => {
        if (i.shareholder?.length) {
            return i;
        }
    });
};

export const useProjectsSpecificUser = (user) => {
    return useQuery(
        ["ProjectsListSpecificUser", user],
        getProjectsOfSpecificUser
    );
};

//Geet Single Project and Its Shareholders Based on the user
const getProjectWithShareholders = async ({ queryKey }) => {
    const project_id = queryKey[1];

    let { data, error } = await supabase
        .from("project")
        .select(
            `
        *,
        shareholder(*),
        submission(*, is_deleted)`
        )
        .filter("submission.is_deleted", "eq", false)
        .eq("id", project_id);

    let projectData = false;
    if (!error) {
        projectData = [...data];
        projectData = projectData[0];

        if (!projectData.shareholder?.length) {
            return { title: transl("Project Unavailable") };
        }
    }

    console.log("projectData", projectData);

    return projectData;
};

export const useProjectWithShareholders = (id) => {
    return useQuery(
        ["ProjectSingleWithShareholders", id],
        getProjectWithShareholders
    );
};

//Geet Single Project and Its Shareholders Based on the user
const getProjectWithShareholdersByUser = async ({ queryKey }) => {
    const project_id = queryKey[1];
    const user_name = queryKey[2];

    let { data, error } = await supabase
        .from("project")
        .select(`*, shareholder(*)`)
        .contains("shareholder.user", [user_name])
        .eq("id", project_id);

    let projectData = false;
    if (!error) {
        projectData = [...data];
        projectData = projectData[0];

        if (!projectData.shareholder?.length) {
            return { title: transl("Project Unavailable") };
        }
    }

    return projectData;
};

export const useProjectWithShareholdersByUser = (id, user) => {
    return useQuery(
        ["ProjectSingleWithShareholdersByUser", id, user],
        getProjectWithShareholdersByUser
    );
};

const getAllProjectsSimpleList = async () => {
    let { data: project, error } = await supabase
        .from("project")
        .select(`*`)
        .order("id", { ascending: false });

    return project;
};

export const useAllProjectsSimpleList = () => {
    return useQuery(["AllProjectsSimpleList"], getAllProjectsSimpleList);
};
