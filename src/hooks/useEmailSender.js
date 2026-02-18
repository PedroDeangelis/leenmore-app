import axios from "axios";
import { useMutation } from "react-query";
import supabase from "../utils/supabaseClient";

const EmailSender = async ({
    project_id,
    current_user_id,
    workers,
    subject,
    message,
    links,
    attachments,
}) => {
    let response = false;
    const recipients = await getWorkersEmails(workers);

    await axios
        .post(
            `${process.env.REACT_APP_STORAGE_PATH}insert-emails`,
            // `https://leenmore-storage.lndo.site/insert-emails`,
            {
                project_id,
                admin_id: current_user_id,
                recipients,
                subject,
                body: message,
                links,
                attachments,
                token: process.env.REACT_APP_STORAGE_AUTH_KEY,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            },
        )
        .then((resp) => {
            response = resp.data;

            console.log("resp.data", resp.data);
        });

    return response;
};

const getWorkersEmails = async (workers) => {
    if (!Array.isArray(workers) || workers.length === 0) {
        return [];
    }

    const names = [...new Set(workers.filter(Boolean))];

    if (names.length === 0) {
        return [];
    }

    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, email, first_name")
        .in("first_name", names);

    if (error) {
        console.error("getWorkersEmails error", error);
        return [];
    }

    return (profiles || [])
        .filter((profile) => profile?.id && profile?.email)
        .map((profile) => ({
            worker_id: profile.id,
            email: profile.email,
        }));
};

export const useEmailSender = (
    project_id,
    current_user_id,
    workers,
    subject,
    message,
    links,
    attachments,
) => {
    return useMutation(
        async (
            project_id,
            current_user_id,
            workers,
            subject,
            message,
            links,
            attachments,
        ) => {
            return await EmailSender(
                project_id,
                current_user_id,
                workers,
                subject,
                message,
                links,
                attachments,
            );
        },
        {
            onSuccess: (data) => {
                return data;
            },
        },
    );
};
