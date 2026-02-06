import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";
import transl from "../../../components/translate";
import { useReceiptUpload } from "../../../../hooks/useFileUpload";
import ImageUploadHolder from "../../SingleShareholderApp/SubmissionForm/ImageUploadHolder";
import { toast } from "react-toastify";

const FileUploadStyled = styled.div`
    border: 2px solid #000;
`;

function ReceiptAttachForm({
    date,
    usageHistory,
    user,
    attachments,
    setAttachments,
    maxFileQuantity = 8,
}) {
    const inputFileUpload = useReceiptUpload();
    const attachmentCount = attachments?.length || 0;
    const isMaxed = attachmentCount >= maxFileQuantity;

    const handleAttachmentUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file || isMaxed) {
            e.target.value = null;
            return;
        }

        const isImageType = file.type?.startsWith("image/");
        const isImageExt = /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(
            file.name || ""
        );

        if (!isImageType && !isImageExt) {
            toast.error(transl("Only image files are allowed"));
            e.target.value = null;
            return;
        }

        inputFileUpload.mutate(
            {
                file: file,
                date: date,
                filename: `${usageHistory}_${date}`,
                user: user,
            },
            {
                onSuccess: (data) => {
                    setAttachments((prev = []) => {
                        if (prev.length >= maxFileQuantity) return prev;
                        return [...prev, data].slice(0, maxFileQuantity);
                    });
                    e.target.value = null;
                },
            }
        );
    };

    const removeFile = (url) => {
        setAttachments(attachments.filter((item) => item !== url));
    };

    return (
        <div>
            <ImageUploadHolder
                isLoading={inputFileUpload.isLoading}
                files={attachments}
                removeFile={removeFile}
            />

            <FileUploadStyled 
            className="relative flex items-center justify-center px-2 py-3 mb-4 rounded-md">
                {false ? (
                    <CircularProgress />
                ) : (
                    <p>
                        {isMaxed
                            ? transl("Maximum files reached")
                            : transl("Click here to upload files")}
                    </p>
                )}

                <input
                    type="file"
                    accept="image/*"
                    disabled={isMaxed || inputFileUpload.isLoading}
                    onChange={(event) => handleAttachmentUpload(event)}
                    className="absolute left-0 top-0 w-full h-full opacity-0 z-10"
                />
            </FileUploadStyled>
        </div>
    );
}

export default ReceiptAttachForm;
