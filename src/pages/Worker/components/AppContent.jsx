import React from "react";
import styled from "styled-components";
import { COLOR } from "../../../common/variables";

const AppContentStyled = styled.div`
	border-radius: 28px;
	min-height: 100px;
	background-color: ${COLOR.superLight};
`;

function AppContent({ children }) {
	return (
		<AppContentStyled className="relative z-10 ">
			<div className="md:max-w-2xl mx-auto container pt-5 ">
				{children}
			</div>
		</AppContentStyled>
	);
}

export default AppContent;
