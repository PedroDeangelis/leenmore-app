import { Alert, CircularProgress } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import styled from "styled-components";
import { useFileUpload } from "../../../../hooks/useFileUpload";
import transl from "../../../components/translate";
import ImageUploadHolder from "./ImageUploadHolder";

const FileUploadStyled = styled.div`
	border: 2px solid #000;
`;

function SubmissionFileUpload({
	listOfUploadedFiles,
	setListOfUploadedFiles,
	user,
	project,
	project_id,
	filename,
	fResult,
	setAlertAttachment,
}) {
	const inputFileUpload = useFileUpload();
	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		if (listOfUploadedFiles.length >= 1) {
			setErrorMessage("한 장의 영수증만 첨부할 수 있습니다.");
			event.target.value = null;
			return;
		}

		setErrorMessage("");

		inputFileUpload.mutate(
			{
				user: user,
				project: project,
				project_id: project_id,
				date: moment().format("MM-DD"),
				filename: filename,
				file: file,
			},
			{
				onSuccess: (data) => {
					event.target.value = null;
					setAlertAttachment(false);
					setListOfUploadedFiles((prev) => {
						return [data];
					});
				},
			}
		);
	};

	const removeFile = (url) => {
		setListOfUploadedFiles(
			listOfUploadedFiles.filter((item) => item !== url)
		);
	};

	return (
		<div>
			<ImageUploadHolder
				isLoading={inputFileUpload.isLoading}
				files={listOfUploadedFiles}
				removeFile={removeFile}
			/>
			{errorMessage && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{errorMessage}
				</Alert>
			)}

			<FileUploadStyled className="relative flex items-center justify-center px-2 py-3 mb-4 rounded-md">
				{inputFileUpload.isLoading ? (
					<CircularProgress />
				) : (
					<p>{transl("Click here to upload files")}</p>
				)}

				<input
					type="file"
					disabled={listOfUploadedFiles.length >= 1}
					onChange={(event) => handleChange(event)}
					className="absolute left-0 top-0 w-full h-full opacity-0 z-10"
				/>
			</FileUploadStyled>
		</div>
	);
}

export default SubmissionFileUpload;
