import React from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { COLOR } from "../../common/variables";
import { useUserisLoggendIn } from "../../hooks/useUser";
import SignInForm from "./components/SignInForm";

const LoginStyled = styled.div`
	width: 100%;
	min-height: 100vh;
	background-color: ${COLOR.mainBrand};
`;

function Login() {
	const { data: currentUser } = useUserisLoggendIn();

	if (currentUser?.id) {
		return <Navigate to="/app" />;
	}

	return (
		<LoginStyled className="flex items-center justify-center">
			<div className="w-full max-w-sm">
				<SignInForm />
			</div>
		</LoginStyled>
	);
}

export default Login;
