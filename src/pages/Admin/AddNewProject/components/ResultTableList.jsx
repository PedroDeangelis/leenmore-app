import React from "react";
import styled from "styled-components";
import OChip from "../../../components/OChip";
import transl from "../../../components/translate";

const ResultTableListStyled = styled.div``;

function ResultTableList({ formResultsList, removeResult }) {
	return (
		<div className="col-span-2">
			<div className="grid grid-cols-8  text-xs text-center border border-slate-200 text-slate-500 divide-x">
				<p className="p-2 ">{transl("Contact Required")}</p>
				<p className="p-2 ">{transl("Attachment Contact")}</p>
				<p className="py-2  col-span-2">{transl("Result")}</p>
				<p className="py-2  col-span-2">{transl("Color")}</p>
				<p className="py-2 col-span-2">{transl("Action")}</p>
			</div>
			<ResultTableListStyled className=" rounded-sm ">
				{formResultsList.map((value) => (
					<div
						key={value.name}
						value={value.name}
						className="grid grid-cols-8 mt-2 border border-slate-200 divide-x "
					>
						<div
							className={`py-2 flex items-center justify-center ${
								value.contactRequired && "font-semibold"
							}`}
						>
							{value.contactRequired ? "Yes" : "No"}
						</div>
						<div
							className={`py-2 flex items-center justify-center ${
								value.attachmentRequired && "font-semibold"
							}`}
						>
							{value.attachmentRequired ? "Yes" : "No"}
						</div>
						<div className="py-2 col-span-2 flex items-center justify-center">
							<p>{value.name}</p>
						</div>
						<div className="p-2 col-span-2 flex items-center justify-center">
							<OChip color={value.color}>{value.name}</OChip>
						</div>
						<div className="p-2 col-span-2 flex items-center justify-center">
							<p
								onClick={() => {
									removeResult(value.name);
								}}
								className="text-red-600 text-xs underline cursor-pointer"
							>
								remove
							</p>
						</div>
					</div>
				))}
			</ResultTableListStyled>
		</div>
	);
}

export default ResultTableList;
