import { darken, lighten } from "polished";
import React from "react";
import styled from "styled-components";
import { getTheResultColorOption } from "./resultColorOptions";

const OChipStyled = styled.div`
	min-width: 80px;
`;

function OChip({ children, color, size, onlyColor = false }) {
	const colorObj = getTheResultColorOption(color);

	let classStyles = "px-3 py-2 text-xs border";

	if (size === "sm") {
		classStyles = "px-2 py-1 text-xs border";
	}

	if (onlyColor) {
		//remove py-% from classStyles but keep the other classes
		classStyles = classStyles.replace(/py-\d+/, "");

		classStyles += " py-4 w-full";
	}

	return (
		<OChipStyled
			className={`rounded-full text-center inline-block uppercase tracking-wider ${classStyles}`}
			style={{
				backgroundColor: colorObj.background,
				color: colorObj.color,
				borderColor: colorObj.background,
			}}
		>
			{!onlyColor && children}
		</OChipStyled>
	);
}

export default OChip;
