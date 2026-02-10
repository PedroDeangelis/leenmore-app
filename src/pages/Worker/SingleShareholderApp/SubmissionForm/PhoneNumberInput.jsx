import {
	FormHelperText,
	FormLabel,
	IconButton,
	OutlinedInput,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import React, { useEffect, useMemo, useRef, useState } from "react";
import transl from "../../../components/translate";

const MAX_NUMBERS = 3;
const PART_RULES = {
	part1: { min: 2, max: 4 },
	part2: { min: 3, max: 4 },
	part3: { min: 4, max: 4 },
};

const isComplete = (number) =>
	number.part1.length >= PART_RULES.part1.min &&
	number.part1.length <= PART_RULES.part1.max &&
	number.part2.length >= PART_RULES.part2.min &&
	number.part2.length <= PART_RULES.part2.max &&
	number.part3.length === PART_RULES.part3.max;

const formatNumber = (number) =>
	`${number.part1}-${number.part2}-${number.part3}`;

function PhoneNumberInput({ required = false, onChange, showError }) {
	const [numbers, setNumbers] = useState([
		{ part1: "", part2: "", part3: "" },
	]);
	const [touched, setTouched] = useState(false);
	const inputRefs = useRef([]);

	const filledNumbers = useMemo(
		() =>
			numbers.filter(
				(number) =>
					number.part1.length ||
					number.part2.length ||
					number.part3.length
			),
		[numbers]
	);

	const allComplete = useMemo(
		() => filledNumbers.every((number) => isComplete(number)),
		[filledNumbers]
	);

	const isValid = useMemo(() => {
		if (!filledNumbers.length) {
			return !required;
		}

		return allComplete;
	}, [filledNumbers, allComplete, required]);

	useEffect(() => {
		const value = filledNumbers
			.filter((number) => isComplete(number))
			.map(formatNumber)
			.join(" / ");

		onChange?.({
			value,
			isValid,
		});
	}, [filledNumbers, isValid, onChange]);

	const handleChange = (index, field, value) => {
		const digits = value.replace(/\D/g, "");
		const limited = digits.slice(0, PART_RULES[field].max);
		setTouched(true);

		setNumbers((prev) => {
			const copy = [...prev];
			copy[index] = { ...copy[index], [field]: limited };
			return copy;
		});

		const shouldMove =
			limited.length >= PART_RULES[field].max &&
			!(field === "part3" && index === numbers.length - 1);

		if (shouldMove) {
			moveFocus(index, field);
		}
	};

	const moveFocus = (index, field) => {
		const nextField =
			field === "part1" ? "part2" : field === "part2" ? "part3" : "part1";
		const nextIndex = field === "part3" ? index + 1 : index;
		const nextRef =
			inputRefs.current?.[nextIndex]?.[nextField] ||
			inputRefs.current?.[0]?.part1;

		if (nextRef && typeof nextRef.focus === "function") {
			nextRef.focus();
		}
	};

	const handleAdd = () => {
		if (numbers.length >= MAX_NUMBERS) return;
		setNumbers([...numbers, { part1: "", part2: "", part3: "" }]);
	};

	const handleRemove = (index) => {
		if (numbers.length === 1) return;
		setNumbers(numbers.filter((_, idx) => idx !== index));
	};

	const shouldShowError = showError || (touched && !isValid);

	return (
		<div className="w-full" style={{ marginBottom: "20px" }}>
			<FormLabel sx={{ mb: 1 }} error={shouldShowError} required={required}>
				{transl("Contact for worker")}
			</FormLabel>
			<div className="space-y-3">
				{numbers.map((number, index) => (
					<div
						key={index}
						className="flex items-center space-x-2 flex-wrap"
					>
						<OutlinedInput
							inputRef={(el) => {
								if (!inputRefs.current[index]) {
									inputRefs.current[index] = {};
								}
								inputRefs.current[index]["part1"] = el;
							}}
							value={number.part1}
							onChange={(e) =>
								handleChange(index, "part1", e.target.value)
							}
							placeholder="000"
							inputProps={{ inputMode: "numeric" }}
							sx={{ width: 90 }}
							error={shouldShowError}
							required={required}
						/>
						<span className="font-bold">-</span>
						<OutlinedInput
							inputRef={(el) => {
								if (!inputRefs.current[index]) {
									inputRefs.current[index] = {};
								}
								inputRefs.current[index]["part2"] = el;
							}}
							value={number.part2}
							onChange={(e) =>
								handleChange(index, "part2", e.target.value)
							}
							placeholder="0000"
							inputProps={{ inputMode: "numeric" }}
							sx={{ width: 90 }}
							error={shouldShowError}
							required={required}
						/>
						<span className="font-bold">-</span>
						<OutlinedInput
							inputRef={(el) => {
								if (!inputRefs.current[index]) {
									inputRefs.current[index] = {};
								}
								inputRefs.current[index]["part3"] = el;
							}}
							value={number.part3}
							onChange={(e) =>
								handleChange(index, "part3", e.target.value)
							}
							placeholder="0000"
							inputProps={{ inputMode: "numeric" }}
							sx={{ width: 90 }}
							error={shouldShowError}
							required={required}
						/>
						{numbers.length < MAX_NUMBERS && index === 0 && (
							<IconButton color="primary" onClick={handleAdd}>
								<AddCircleIcon />
							</IconButton>
						)}
						{numbers.length > 1 && (
							<IconButton
								color="error"
								onClick={() => handleRemove(index)}
							>
								<RemoveCircleIcon />
							</IconButton>
						)}
					</div>
				))}
			</div>
			<FormHelperText error={shouldShowError}>
				{shouldShowError
					? "번호를 올바르게 입력해주세요."
					: ""}
			</FormHelperText>
		</div>
	);
}

export default PhoneNumberInput;
