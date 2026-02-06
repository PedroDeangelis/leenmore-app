import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import React from "react";
import transl from "../../../components/translate";

const getType = (file) => {
	const ext = file?.split(".").pop()?.toLowerCase();
	if (["mp4", "mov", "webm"].includes(ext)) return "video";
	if (["mp3", "wav", "m4a"].includes(ext)) return "audio";
	return "image";
};

function AttachmentPreviewDialog({ open, onClose, files }) {
	const storagePath = process.env.REACT_APP_STORAGE_PATH;
	const normalizedFiles = Array.isArray(files) ? files : files ? [files] : [];
	const hasFiles = normalizedFiles?.length;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{transl("Files")}</DialogTitle>
			<DialogContent dividers>
				{!hasFiles && (
					<Typography variant="body2">
						{transl("No files available")}
					</Typography>
				)}
				{normalizedFiles?.map((file) => {
					const type = getType(file);
					const url = `${storagePath}${file}`;
					return (
						<div key={file} className="mb-4">
							{type === "image" && (
								<img
									src={url}
									alt={file}
									className="w-full max-h-120 object-contain "
								/>
							)}
							{type === "video" && (
								<video
									src={url}
									controls
									className="w-full max-h-96 rounded"
								/>
							)}
							{type === "audio" && (
								<audio controls src={url} className="w-full" />
							)}
						</div>
					);
				})}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>{transl("Close")}</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AttachmentPreviewDialog;
