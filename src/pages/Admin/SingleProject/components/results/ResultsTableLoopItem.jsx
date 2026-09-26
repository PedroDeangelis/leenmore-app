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
import {
	findDuplicateName,
	serializeProjectResult,
} from "../../../../components/projectResults";
import transl from "../../../../components/translate";

function ResultsTableLoopItem({
	isEdit,
	result,
	setResults,
	index,
	allResults,
}) {
	const [contactRequired, setContactRequired] = useState(
		result?.contactRequired
	);
	const [attachmentRequired, setAttachmentRequired] = useState(
		result?.attachmentRequired
	);
	const [name, setName] = useState(result?.name);
	const [colorSelect, setColorSelect] = useState(result?.color);
	const [nameError, setNameError] = useState("");
	const resultColors = resultColorOptions;

	const handleChange = () => {
		setResults((prev) => {
			// Serialize through the shared helper so this single-row write and
			// serializeProjectResults() can never drift in key order or boolean
			// coercion -- the equality check below depends on that.
			const next = serializeProjectResult(
				{
					name: name,
					color: colorSelect,
					contactRequired: contactRequired,
					attachmentRequired: attachmentRequired,
					// Backfill legacy rows so the key is never dropped.
					order: result?.order,
				},
				index
			);

			// Bail out when nothing actually changed. Returning the SAME array
			// reference makes React skip the re-render; allocating a new one on
			// every pass is what drove the "Maximum update depth exceeded" loop,
			// because each new array handed every sibling row fresh `result` and
			// `allResults` identities.
			if (prev[index] === next) return prev;

			const newResults = [...prev];
			// `index` is the PHYSICAL index in project.results, never the display
			// position, so this write can never clobber a sibling result.
			newResults[index] = next;
			return newResults;
		});
	};

	const handleResultItemChange = (e) => {
		setColorSelect(e.target.value);
	};

	// Depend on a PRIMITIVE digest of the sibling names, not on the `allResults`
	// array identity. The parent rebuilds that array (via parseProjectResults)
	// on every write, so an identity dep re-ran this effect in every row on
	// every pass -- the setNameError below is the line React named in
	// "Maximum update depth exceeded".
	const siblingNames = (allResults ?? [])
		.map((item) => `${item?.physicalIndex}:${item?.name ?? ""}`)
		.join("\u0000");

	useEffect(() => {
		const clash = findDuplicateName(allResults ?? [], name, index);

		let message = "";
		if (!String(name ?? "").trim()) {
			message = transl("Result name cannot be empty.");
		} else if (clash) {
			message = transl("A result with this name already exists.");
		}

		// Only write when the message actually changes: setting identical state
		// still schedules a render pass.
		setNameError((prev) => (prev === message ? prev : message));
		// `allResults` is read above but deliberately not a dep -- siblingNames is
		// its stable primitive projection.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, siblingNames, index]);

	// handleChange is intentionally omitted from the deps: it is recreated on
	// every render, and this effect must fire only when an edited field changes.
	// Gated on isEdit -- a read-only row must never write back to the parent.
	useEffect(() => {
		if (!isEdit) return;
		handleChange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit, name, colorSelect, contactRequired, attachmentRequired]);

	// Resync when this row is pointed at a different result. Rows are now keyed
	// by physical index, so a re-sort can hand this component a new `result`
	// without remounting it -- a [] dep list would keep the stale color.
	// Guarded so an unchanged colour cannot retrigger the write effect above.
	useEffect(() => {
		setColorSelect((prev) => (prev === result?.color ? prev : result?.color));
	}, [result?.color]);

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
						error={!!nameError}
						helperText={nameError}
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
