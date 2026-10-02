import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

// Per-project Word documents for "Email to worker". The storage server fills
// their [worker_*] shortcodes for each worker and sends them as PDFs.

const storageUrl = (path) => `${process.env.REACT_APP_STORAGE_PATH}${path}`;
const token = process.env.REACT_APP_STORAGE_AUTH_KEY;

// Keep the server's message (e.g. "Only Word .docx files are supported").
const toError = (error) =>
    new Error(
        error?.response?.data?.error || error?.message || "Request failed",
    );

const postJson = async (path, payload) => {
    try {
        const { data } = await axios.post(storageUrl(path), {
            ...payload,
            token,
        });
        return data;
    } catch (error) {
        throw toError(error);
    }
};

const getCustomDocuments = async ({ queryKey }) => {
    const project_id = queryKey[1];
    const data = await postJson("custom-documents-list", { project_id });
    return data?.documents || [];
};

export const useCustomDocuments = (project_id) => {
    return useQuery(["CustomDocumentList", project_id], getCustomDocuments, {
        enabled: !!project_id,
    });
};

const uploadCustomDocument = async ({ project_id, file, title }) => {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("project_id", project_id);
    formData.append("title", title || "");
    formData.append("file", file);

    try {
        const { data } = await axios.post(
            storageUrl("custom-documents-upload"),
            formData,
        );
        return data?.document;
    } catch (error) {
        throw toError(error);
    }
};

export const useCustomDocumentUpload = () => {
    const queryClient = useQueryClient();
    return useMutation(uploadCustomDocument, {
        onSuccess: () => {
            queryClient.invalidateQueries("CustomDocumentList");
        },
    });
};

export const useCustomDocumentDelete = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ project_id, document_id }) =>
            postJson("custom-documents-delete", { project_id, document_id }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("CustomDocumentList");
            },
        },
    );
};

// Resolves to { pdf_path, filename, pdf_writer, warning, missing }.
export const useCustomDocumentPreview = () => {
    return useMutation(({ project_id, document_id, worker_name }) =>
        postJson("custom-documents-preview", {
            project_id,
            document_id,
            worker_name,
        }),
    );
};
