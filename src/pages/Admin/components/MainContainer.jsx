import React from "react";
import styled from "styled-components";

const MainContainerStyled = styled.div`
	padding-left: 298px;
	padding-right: 20px;
	min-height: 100vh;
	background-color: #f8f8fb;
`;

function MainContainer({ children }) {
	return <MainContainerStyled>{children}</MainContainerStyled>;
}

export default MainContainer;
