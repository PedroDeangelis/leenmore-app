import React from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import FileDisplay from "./FileDisplay";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FigureStyled = styled.figure`
	padding-bottom: 100%;

	.thumbnail {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transform: none;
	}
`;

function ImageUploadHolder({ isLoading, files, removeFile }) {
	return (
		<div className="grid grid-cols-3 gap-4 mb-4">
			{files?.map((item, key) => (
				<FigureStyled
					key={item}
					className="rounded-md overflow-hidden relative"
				>
					<FileDisplay item={item} />

					<Button
						onClick={() => {
							removeFile(item);
						}}
						sx={{ position: "absolute", top: "0", right: "0" }}
						variant="contained"
						color="error"
					>
						<CloseIcon />
					</Button>
				</FigureStyled>
			))}
			{isLoading && (
				<FigureStyled className="rounded-md overflow-hidden relative">
					<Skeleton height={300} className="thumbnail" />
				</FigureStyled>
			)}
		</div>
	);
}

export default ImageUploadHolder;
