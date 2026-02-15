import axios from "axios";
import { useMutation } from "react-query";

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

    await axios
        .post(
            // `${process.env.REACT_APP_STORAGE_PATH}insert-emails`,
            `https://leenmore-storage.lndo.site/insert-emails`,
            {
                project_id,
                admin_id: current_user_id,
                recipients: [
                    {
                        worker_id: 123,
                        email: "deangelissp@gmail.com",
                    },
                ],
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
