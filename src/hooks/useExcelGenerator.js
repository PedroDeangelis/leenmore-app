import axios from "axios";
import { m } from "framer-motion";
import { useMutation } from "react-query";

const generateWorkerReport = async ({
    project_id,
    data,
    filename,
    multiple = false,
}) => {
    let response = false;

    let $path = "generate-worker-report";

    if (multiple) {
        $path = "generate-multi-worker-report";
    }

    await axios
        .post(
            // `${process.env.REACT_APP_STORAGE_PATH}${$path}`,

            `https://leenmore-storage.lndo.site/${$path}`,
            {
                project_id,
                data,
                filename,
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
        })
        .catch((err) => {
            console.error(err);
        });

    return response;
};

export const useExcelGenerator = () => {
    return useMutation(
        async (payload) => {
            return await generateWorkerReport(payload);
        },
        {
            onSuccess: (data) => {
                return data;
            },
        },
    );
};
