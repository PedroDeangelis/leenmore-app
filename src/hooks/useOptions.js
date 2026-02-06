import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "../utils/supabaseClient";

// GET

const getOption = async ({ queryKey }) => {
    const name = queryKey[1];
    const type = queryKey[2];

    const { data, error } = await supabase
        .from("options")
        .select(type)
        .eq("name", name)
        .single();

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return data[type];
};

export const useOption = (name, type) => {
    return useQuery(["OptionItem", name, type], getOption, {
        staleTime: 0,
        cacheTime: 0,
        refetchOnMount: "always",
    });
};

// UPDATE
const updateOption = async ({ name, value, type }) => {
    let updateData = {};

    if (type == "multivalue") {
        updateData.multivalue = value;
    } else {
        updateData.value = value;
    }

    const { data, error } = await supabase
        .from("options")
        .update(updateData)
        .eq("name", name);

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return true;
};

export const useOptionUpdate = (name, value, type) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (name, value, type) => {
            return await updateOption(name, value, type);
        },
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries("OptionItem");
                return data;
            },
            onSettled: () => {
                queryClient.refetchQueries("OptionItem");
            },
        }
    );
};
