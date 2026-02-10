import {
    Alert,
    Checkbox,
    CircularProgress,
    FormControlLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { usePrivacyConsentUpload } from "../../../../hooks/useFileUpload";
import transl from "../../../components/translate";
import ImageUploadHolder from "./ImageUploadHolder";

const FileUploadStyled = styled.div`
    border: 2px solid #000;
`;

function SubmissionPrivacyConscentFileUpload({
    privacyConsentCheckbox,
    setPrivacyConsentCheckbox,
    project,
    filename,
    privacyConsentFilePath,
    setPrivacyConsentFilePath,
}) {
    const inputFileUpload = usePrivacyConsentUpload();
    const [errorMessage, setErrorMessage] = useState("");

    const privacyConsentFiles = Array.isArray(privacyConsentFilePath)
        ? privacyConsentFilePath
        : privacyConsentFilePath
          ? [privacyConsentFilePath]
          : [];
    const isMaxed = privacyConsentFiles.length >= 5;
    const isProjectReady = Boolean(project?.title && project?.id);

    useEffect(() => {
        if (!privacyConsentCheckbox) {
            setPrivacyConsentFilePath(null);
            setErrorMessage("");
        }
    }, [privacyConsentCheckbox]);

    const handleChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!isProjectReady) {
            setErrorMessage(transl("Loading"));
            event.target.value = null;
            return;
        }

        if (isMaxed) {
            setErrorMessage(transl("Maximum files reached"));
            event.target.value = null;
            return;
        }

        setErrorMessage("");

        inputFileUpload.mutate(
            {
                project: `${project.title}-${project.id}`,
                filename: `${filename}_개인정보동의서`,
                file: file,
            },
            {
                onSuccess: (data) => {
                    event.target.value = null;
                    if (!data) {
                        setErrorMessage("Upload failed. Please try again.");
                        return;
                    }
                    setPrivacyConsentFilePath((prev) => {
                        const current = Array.isArray(prev)
                            ? prev
                            : prev
                              ? [prev]
                              : [];
                        return [...current, data];
                    });
                },
            },
        );
    };

    const removeFile = (url) => {
        setPrivacyConsentFilePath((prev) => {
            const current = Array.isArray(prev) ? prev : prev ? [prev] : [];
            const next = current.filter((item) => item !== url);
            return next.length ? next : null;
        });
    };

    return (
        <div className="border-slate-300 border px-4 mb-4 rounded-md">
            <FormControlLabel
                className="flex items-center"
                control={
                    <Checkbox
                        checked={Boolean(privacyConsentCheckbox)}
                        onChange={(e) =>
                            setPrivacyConsentCheckbox(e.target.checked)
                        }
                    />
                }
                label={"개인 정보수집 및 이용 동의서 첨부"}
            />
            <div
                className="pb-4"
                style={{ display: privacyConsentCheckbox ? "block" : "none" }}
            >
                <ImageUploadHolder
                    isLoading={inputFileUpload.isLoading}
                    files={privacyConsentFiles}
                    removeFile={removeFile}
                />
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
                <FileUploadStyled className="relative flex items-center justify-center px-2 py-3 mb-2 rounded-md">
                    {inputFileUpload.isLoading ? (
                        <CircularProgress />
                    ) : (
                        <p>
                            {isMaxed
                                ? transl("Maximum files reached")
                                : "개인 정보수집 및 이용 동의서 업로드"}
                        </p>
                    )}
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        disabled={
                            isMaxed ||
                            !isProjectReady ||
                            inputFileUpload.isLoading
                        }
                        onChange={(event) => handleChange(event)}
                        className="absolute left-0 top-0 w-full h-full opacity-0 z-10"
                    />
                </FileUploadStyled>
            </div>
        </div>
    );
}

export default SubmissionPrivacyConscentFileUpload;
