import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "../utils/supabaseClient";

const createReceipt = async (receipt) => {
    const { data, error } = await supabase.from("receipt").insert([
        {
            date: receipt.date,
            usage_history: receipt.usageHistory,
            where_used: receipt.whereWereUsed,
            amount: receipt.amount,
            user_id: receipt.user,
            attachments: receipt.attachments,
            user_name: receipt.user_name,
            note: receipt.note,
        },
    ]);

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return true;
};

export const useReceiptCreate = (receipt) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (receipt) => {
            return await createReceipt(receipt);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ReceiptList");
                return data;
            },
        }
    );
};

const getReceipts = async ({ queryKey }) => {
    const user_id = queryKey[1];

    const { data, error } = await supabase
        .from("receipt")
        .select("*")
        .eq("status", true)
        .eq("user_id", user_id)
        .order("date", { ascending: false })
        .order("id", { ascending: true });

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return data;
};

export const useReceipts = (user_id) => {
    return useQuery(["ReceiptList", user_id], getReceipts);
};

// Get single Receipt
const getReceipt = async ({ queryKey }) => {
    const receipt_id = queryKey[1];

    const { data, error } = await supabase
        .from("receipt")
        .select("*")
        .eq("id", receipt_id)
        .eq("status", true);
    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return data[0];
};

export const useReceipt = (receipt_id) => {
    return useQuery(["Receipt", receipt_id], getReceipt);
};

// Deactivate Receipt
const deactivateReceipt = async ({ receipt_id }) => {
    const { data, error } = await supabase
        .from("receipt")
        .update({ status: false })
        .eq("id", receipt_id);
    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return true;
};

export const useReceiptDeactivate = (receipt_id) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (receipt_id) => {
            return await deactivateReceipt(receipt_id);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ReceiptList");
                queryClient.invalidateQueries("ReceiptListAdmin");
                return data;
            },
        }
    );
};

// UPDATE

const updateReceipt = async ({ receipt_id, meta }) => {
    const { data, error } = await supabase
        .from("receipt")
        .update(meta)
        .eq("id", receipt_id);

    return data;
};

export const useReceiptUpdate = (receipt_id, meta) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (receipt_id, meta) => {
            return await updateReceipt(receipt_id, meta);
        },
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries("ReceiptList");
                await queryClient.invalidateQueries("ReceiptListAdmin");
                await queryClient.invalidateQueries("Receipt");
                return data;
            },
            onSettled: () => {
                queryClient.refetchQueries("ReceiptList");
                queryClient.refetchQueries("ReceiptListAdmin");
                queryClient.refetchQueries("Receipt");
            },
        }
    );
};

// ADMIN GET INFO
const getReceiptsAdmin = async () => {
    const { data, error } = await supabase
        .from("receipt")
        .select("*")
        .eq("status", true)
        .order("date", { ascending: false });

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return data;
};

export const useReceiptsAdmin = () => {
    return useQuery(["ReceiptListAdmin"], getReceiptsAdmin);
};

// Bulk Delete
const bulkDeleteReceipts = async ({ userIds }) => {
    const { data, error } = await supabase
        .from("receipt")
        .update({ status: false })
        .in("user_id", userIds);

    if (error) {
        console.log("error", error);
        return { data: data, error: error };
    }

    return true;
};

export const useReceiptBulkDelete = (userIds) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (userIds) => {
            return await bulkDeleteReceipts(userIds);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("ReceiptList");
                queryClient.invalidateQueries("ReceiptListAdmin");
                return data;
            },
        }
    );
};
