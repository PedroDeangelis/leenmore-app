import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "../utils/supabaseClient";

// Create a new resource
const createResource = async ({ resource }) => {
    const { data, error } = await supabase.from("resource").insert([
        {
            title: resource.title,
            path: resource.path,
            attached_to: resource.attachedTo,
            parent_id: resource.parentId,
        },
    ]);

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return true;
};

export const useResourceCreate = (resource) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (resource) => {
            return await createResource(resource);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ResourceList");
                return data;
            },
        }
    );
};

//  GEt List of resources
const getResources = async ({ queryKey }) => {
    const project_id = queryKey[1];
    const attached_to = queryKey[2];

    const { data, error } = await supabase
        .from("resource")
        .select("*")
        .eq("attached_to", attached_to)
        .eq("parent_id", project_id)
        .order("order", { ascending: true })
        .order("id", { ascending: true });
    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return data;
};

export const useResources = (project_id, attached_to) => {
    return useQuery(["ResourceList", project_id, attached_to], getResources);
};

//  DELETE resource

const deleteResource = async ({ resource_id }) => {
    const { data, error } = await supabase
        .from("resource")
        .delete()
        .match({ id: resource_id });

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return data;
};

export const useResourceDelete = (resource_id) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (resource_id) => {
            return await deleteResource(resource_id);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ResourceList");
                return data;
            },
        }
    );
};

// UPDATE resource
const updateResource = async ({ resource, meta }) => {
    const { data, error } = await supabase
        .from("resource")
        .update(meta)
        .match({ id: resource.id });

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return data;
};

export const useResourceUpdate = (resource) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (resource) => {
            return await updateResource(resource);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ResourceList");
                return data;
            },
        }
    );
};

//  Update Multiple resources
const updateResources = async ({ resources }) => {
    // Assuming 'resources' is an array of resource objects
    // and each resource has an 'id' field
    console.log("resources", resources);
    try {
        const responses = await Promise.all(
            resources.map(
                (resource) =>
                    supabase
                        .from("resource")
                        .update(resource)
                        .eq("id", resource.id) // Using the 'id' field to specify the row
            )
        );

        // Check for any errors in the responses
        const errors = responses.filter((response) => response.error);
        if (errors.length > 0) {
            throw errors[0].error; // Throw the first error encountered
        }

        return responses.map((response) => response.data);
    } catch (error) {
        console.error("Error updating resources:", error);
        throw error;
    }
};

export const useMultiResourcesUpdate = (resources) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (resources) => {
            return await updateResources(resources);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ResourceList");
                return data;
            },
        }
    );
};
