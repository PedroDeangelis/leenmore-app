import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Fab } from "@mui/material";

function ButtonGoToTop({ size }) {
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<Fab
			size={size}
			sx={{ position: "fixed", bottom: "20px", right: "20px" }}
			onClick={scrollToTop}
			color="primary"
		>
			<ArrowUpwardIcon />
		</Fab>
	);
}

export default ButtonGoToTop;
