import axios from "axios";
import { folder } from "jszip";
import { useMutation } from "react-query";

const uploadFileToStorage = async ({
    user,
    project,
    project_id,
    date,
    filename,
    file,
}) => {
    let response = false;

    await axios
        .post(
            `${process.env.REACT_APP_STORAGE_PATH}upload-files`,
            {
                user: user,
                project: `${project.title}-${project.id}`,
                project_id: project_id,
                date: date,
                filename: filename,
                file: file,
                auth_key: process.env.REACT_APP_STORAGE_AUTH_KEY,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((resp) => {
            response = resp.data;
        });

    return response;
};

export const useFileUpload = (
    user,
    project,
    project_id,
    date,
    filename,
    file
) => {
    return useMutation(
        async (user, project, project_id, date, filename, file) => {
            return await uploadFileToStorage(
                user,
                project,
                project_id,
                date,
                filename,
                file
            );
        },
        {
            onSuccess: (data) => {
                return data;
            },
        }
    );
};

//Download
const downloadZipFolder = async ({ project_id, folder }) => {
    let response = false;

    await axios
        .post(
            `${process.env.REACT_APP_STORAGE_PATH}download-zip`,
            {
                folder: folder,
                project_id: project_id,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((resp) => {
            response = resp.data;
        });

    return response;
};

export const useDownloadZipFolder = (project_id, folder) => {
    return useMutation(
        async (project_id, folder) => {
            return await downloadZipFolder(project_id, folder);
        },
        {
            onSuccess: (data) => {
                return data;
            },
        }
    );
};

const selectDownloadFolder = async ({ project_id }) => {
    let response = false;

    await axios
        .post(
            `${process.env.REACT_APP_STORAGE_PATH}request-time`,
            {
                project_id: project_id,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((resp) => {
            response = resp.data;
        });

    return response;
};

export const useSelectDownloadFolder = (project_id) => {
    return useMutation(
        async (project_id) => {
            return await selectDownloadFolder(project_id);
        },
        {
            onSuccess: (data) => {
                return data;
            },
        }
    );
};

// Create Zip and Download Specif Files
const downloadZipFiles = async ({ filename, files }) => {
    let response = false;

    await axios
        .post(
            `${process.env.REACT_APP_STORAGE_PATH}download-zip-files`,
            {
                files: files,
                filename: filename,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((resp) => {
            response = resp.data;
        });

    return response;
};

export const useDownloadZipFiles = (filename, files) => {
    return useMutation(
        async (filename, files) => {
            return await downloadZipFiles(filename, files);
        },
        {
            onSuccess: (data) => {
                return data;
            },
        }
    );
};

// USE RECEIPT
const receiptUpload = async ({ user, date, filename, file }) => {
    let response = false;

    await axios
        .post(
            `${process.env.REACT_APP_STORAGE_PATH}receipt-upload`,
            {
                user: user,
                date: date,
                filename: filename,
                file: file,
                auth_key: process.env.REACT_APP_STORAGE_AUTH_KEY,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((resp) => {
            response = resp.data;
        });

    return response;
};

export const useReceiptUpload = (user, date, filename, file) => {
    return useMutation(
        async (user, date, filename, file) => {
            return await receiptUpload(user, date, filename, file);
        },
        {
            onSuccess: (data) => {
                return data;
            },
        }
    );
};

// USE RESOURCE
const resourceUpload = async ({ project, filename, file }) => {
    let response = false;

    await axios
        .post(
            `${process.env.REACT_APP_STORAGE_PATH}resource-upload`,
            {
                project: project,
                filename: filename,
                file: file,
                auth_key: process.env.REACT_APP_STORAGE_AUTH_KEY,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((resp) => {
            response = resp.data;
        });

    return response;
};

export const useResourceUpload = (project, filename, file) => {
    return useMutation(
        async (project, filename, file) => {
            return await resourceUpload(project, filename, file);
        },
        {
            onSuccess: (data) => {
                return data;
            },
        }
    );
};

// USE PRIVACY CONSENT
const privacyConsentUpload = async ({ project, filename, file }) => {
    let response = false;

    await axios
        .post(
            `${process.env.REACT_APP_STORAGE_PATH}privacy-consent-file-upload`,
            {
                project: project,
                filename: filename,
                file: file,
                auth_key: process.env.REACT_APP_STORAGE_AUTH_KEY,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then((resp) => {
            response = resp.data;
        });

    return response;
};

export const usePrivacyConsentUpload = (project, filename, file) => {
    return useMutation(
        async (project, filename, file) => {
            return await privacyConsentUpload(project, filename, file);
        },
        {
            onSuccess: (data) => {
                return data;
            },
        }
    );
};
