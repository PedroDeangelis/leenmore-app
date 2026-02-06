import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React, { useState } from "react";
import transl from "../../../components/translate";

function SelectFolderDialog({ open, handleClose, folders, handleDownload }) {
    const [folder, setFolder] = useState("");

    const handleChange = (event) => {
        setFolder(event.target.value);
    };

    const handleSubmit = () => {
        handleDownload(folder);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {transl("Select a folder to download")}
            </DialogTitle>
            <DialogContent>
                {folders ? (
                    <FormControl fullWidth sx={{ marginTop: "10px" }}>
                        <InputLabel id="demo-simple-select-label">
                            {transl("Folder")}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={folder}
                            label={transl("Folder")}
                            onChange={handleChange}
                        >
                            {folders?.map((folder) => (
                                <MenuItem key={folder} value={folder}>
                                    {folder}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <p>{transl("The project has no folders.")}</p>
                )}
                <DialogContentText
                    id="alert-dialog-description"
                    sx={{ marginBottom: "20px" }}
                ></DialogContentText>
            </DialogContent>
            <div className="flex justify-between p-4">
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
                {folder && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        autoFocus
                    >
                        Download
                    </Button>
                )}
            </div>
        </Dialog>
    );
}

export default SelectFolderDialog;
