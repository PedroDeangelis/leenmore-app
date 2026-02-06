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
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@mui/material";
import React, { useState } from "react";
import transl from "../../../components/translate";

function EditShareholderResultDialog({
	shareholder,
	open,
	handleCloseEditing,
	results,
	handleResultUpdate,
	submissionID,
}) {
	const [result, setResult] = useState("");

	const handleResultChange = (e) => {
		setResult(e.target.value);
	};

	const checkIfHasResult = () => {
		if (result === "") {
			alert(transl("Please select a result"));
		} else {
			handleResultUpdate(shareholder, result, submissionID);
		}
	};

	return (
		<Dialog open={open} onClose={handleCloseEditing}>
			<DialogTitle>{transl("Edit Sharehoders Result")}</DialogTitle>
			<DialogContent>
				<div className="flex items-center">
					<p className="p-3 pl-0">
						<span className="block text-xs text-stone-500">
							{transl("no")}
						</span>
						{shareholder?.no}
					</p>
					<p className="p-3">
						<span className="block text-xs text-stone-500">
							{transl("registration")}
						</span>
						{shareholder?.registration}
					</p>
					<p className="p-3">
						<span className="block text-xs text-stone-500">
							{transl("name")}
						</span>
						{shareholder?.name}
					</p>
					{shareholder?.result && (
						<p className="p-3 pr-0">
							<span className="block text-xs text-stone-500">
								{transl("result")}
							</span>
							{JSON.parse(results[shareholder?.result])?.name}
						</p>
					)}
				</div>

				<FormControl fullWidth className="w-full " sx={{ mt: "10px" }}>
					<InputLabel id="result-select-label">
						{transl("Result")} *
					</InputLabel>
					<Select
						labelId="result-select-label"
						label="Result *"
						value={result}
						required={true}
						onChange={handleResultChange}
					>
						{results.map((element, key) => {
							let result = JSON.parse(element);

							return (
								<MenuItem key={key} value={key}>
									{result.name}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			</DialogContent>
			<div className="flex justify-between p-4">
				<Button onClick={handleCloseEditing}>{transl("Close")}</Button>
				<Button onClick={checkIfHasResult} variant="contained">
					{transl("Update")}
				</Button>
			</div>
		</Dialog>
	);
}

export default EditShareholderResultDialog;
