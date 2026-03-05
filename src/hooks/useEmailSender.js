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
    include_worker_report_xlsl = false,
    include_worker_report_pdf = false,
}) => {
    let response = false;
    const recipients = await getWorkersEmails(workers);

    // console.log("first", include_worker_report_xlsl, include_worker_report_pdf);

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
                include_worker_report: include_worker_report_xlsl,
                include_worker_report_pdf: include_worker_report_pdf,
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

            // console.log("resp.data", resp.data);
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
        .select("id, email, email_receiver, first_name")
        .eq("status", "active")
        .in("first_name", names);

    if (error) {
        console.error("getWorkersEmails error", error);
        return [];
    }

    return (profiles || [])
        .filter((profile) => profile?.id && profile?.email)
        .map((profile) => ({
            worker_id: profile.id,
            email: profile.email_receiver || profile.email,
            // email: "deangelissp@gmail.com",
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
    include_worker_report_xlsl = false,
    include_worker_report_pdf = false,
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
            include_worker_report_xlsl,
            include_worker_report_pdf,
        ) => {
            return await EmailSender(
                project_id,
                current_user_id,
                workers,
                subject,
                message,
                links,
                attachments,
                include_worker_report_xlsl,
                include_worker_report_pdf,
            );
        },
        {
            onSuccess: (data) => {
                return data;
            },
        },
    );
};
