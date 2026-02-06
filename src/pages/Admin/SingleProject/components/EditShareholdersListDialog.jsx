import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditShareholdersUploader from "./EditShareholdersUploader";
import { downloadShareholderData } from "../../components/shareholderSheet";

function EditShareholdersListDialog({ open, handleClose, csvBody }) {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{transl("Edit Sharehoders List")}
			</DialogTitle>
			<DialogContent>
				<DialogContentText
					id="alert-dialog-description"
					sx={{ marginBottom: "20px" }}
				>
					{transl(
						"Download The Data File to edit information about shareholders, once the updates are done, you can upload the excel on the tool below."
					)}
				</DialogContentText>
				<EditShareholdersUploader handleClose={handleClose} />
			</DialogContent>
			<div className="flex justify-between p-4">
				<Button
					variant="outlined"
					onClick={() => downloadShareholderData(csvBody)}
				>
					<FileDownloadIcon />
					Download Data File
				</Button>
				<Button onClick={handleClose} autoFocus>
					Close
				</Button>
			</div>
		</Dialog>
	);
}

export default EditShareholdersListDialog;
