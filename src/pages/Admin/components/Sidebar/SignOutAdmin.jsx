import React from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import signOut from "../../../../auth/signOut";
import LogoutIcon from "@mui/icons-material/Logout";
import transl from "../../../components/translate";

const SignOutAdminStyled = styled.button`
	position: absolute;
	bottom: 26px;
`;

function SignOutAdmin() {
	const queryClient = useQueryClient();

	const handleClick = async () => {
		signOut().then(() => {
			queryClient.invalidateQueries("isUserLoggedIn");
			queryClient.invalidateQueries("getUserMeta");
		});
	};

	return (
		<SignOutAdminStyled
			onClick={handleClick}
			className="text-xs text-center text-red-50 w-full flex items-center justify-center"
		>
			<LogoutIcon fontSize="small" className="mr-2" />
			<span>{transl("Log Out")}</span>
		</SignOutAdminStyled>
	);
}

export default SignOutAdmin;
