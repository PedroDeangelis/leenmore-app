import React from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material";

export const theme = createTheme({
	palette: {
		type: "light",
		primary: {
			main: "#5a0713",
		},
		secondary: {
			main: "#2D333A",
		},
	},
});

function Theme({ children }) {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Theme;
