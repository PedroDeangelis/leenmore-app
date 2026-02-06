import {
	Checkbox,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TableCell,
	TableRow,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OChip from "../../../../components/OChip";
import { resultColorOptions } from "../../../../components/resultColorOptions";
import transl from "../../../../components/translate";

function ResultsTableLoopItem({ isEdit, result, setResults, index }) {
	const [contactRequired, setContactRequired] = useState(
		result?.contactRequired
	);
	const [attachmentRequired, setAttachmentRequired] = useState(
		result?.attachmentRequired
	);
	const [name, setName] = useState(result?.name);
	const [colorSelect, setColorSelect] = useState();
	const resultColors = resultColorOptions;

	const handleChange = () => {
		setResults((prev) => {
			const newResults = [...prev];
			newResults[index] = JSON.stringify({
				name: name,
				color: colorSelect,
				contactRequired: contactRequired,
				attachmentRequired: attachmentRequired,
			});
			return newResults;
		});
	};

	const handleResultItemChange = (e) => {
		setColorSelect(e.target.value);
	};

	useEffect(() => {
		handleChange();
	}, [name, colorSelect, contactRequired, attachmentRequired]);

	useEffect(() => {
		setColorSelect(result?.color);
	}, []);

	return (
		<TableRow>
			<TableCell
				sx={{
					paddingLeft: 0,
					paddingRight: 0,
					width: "30px",
					textAlign: "center",
				}}
			>
				{isEdit ? (
					<>
						<Checkbox
							checked={contactRequired}
							onChange={(e) => {
								setContactRequired(e.target.checked);
								handleChange();
							}}
						/>
					</>
				) : (
					<>
						{result.contactRequired && (
							<div className="w-3 h-3 rounded-full bg-green-400 inline-block"></div>
						)}
					</>
				)}
			</TableCell>
			<TableCell
				sx={{
					paddingLeft: 0,
					paddingRight: 0,
					width: "30px",
					textAlign: "center",
				}}
			>
				{isEdit ? (
					<>
						<Checkbox
							checked={attachmentRequired}
							onChange={(e) => {
								setAttachmentRequired(e.target.checked);
								handleChange();
							}}
						/>
					</>
				) : (
					<>
						{result.attachmentRequired && (
							<div className="w-3 h-3 rounded-full bg-green-400 inline-block"></div>
						)}
					</>
				)}
			</TableCell>
			<TableCell>
				{isEdit ? (
					<TextField
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
				) : (
					<>{result.name}</>
				)}
			</TableCell>
			<TableCell>
				{isEdit ? (
					<FormControl sx={{ width: "100%" }}>
						<InputLabel id="demo-simple-select-label">
							{transl("Result Color")}
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={colorSelect}
							required={true}
							label={transl("Result Color")}
							onChange={handleResultItemChange}
						>
							{resultColors
								.filter((val) => val.name !== "b&w")
								.map((val, index) => (
									<MenuItem key={index} value={val.name}>
										<div className="flex items-center">
											<div
												className="w-3 h-3"
												style={{
													mr: "10px",
													marginRight: "10px",
													backgroundColor:
														val.background,
												}}
											></div>
											{val.name.charAt(0).toUpperCase() +
												val.name.slice(1)}
										</div>
									</MenuItem>
								))}
						</Select>
					</FormControl>
				) : (
					<OChip color={result?.color}>{result.name}</OChip>
				)}
			</TableCell>
		</TableRow>
	);
}

export default ResultsTableLoopItem;
