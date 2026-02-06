import React from "react";
import styled from "styled-components";
import { COLOR } from "../../../common/variables";

const AppContainerStyled = styled.div`
	background-color: ${COLOR.superLight};
`;

function AppContainer({ children }) {
	return (
		<AppContainerStyled className="min-h-screen pb-28">
			{children}
		</AppContainerStyled>
	);
}

export default AppContainer;
