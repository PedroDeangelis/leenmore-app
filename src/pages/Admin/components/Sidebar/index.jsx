import React from "react";
import styled from "styled-components";
import { COLOR } from "../../../../common/variables";
import Logo from "../../../components/Logo";
import MenuList from "./MenuList";
import SignOutAdmin from "./SignOutAdmin";

const SidebarStyled = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 258px;
	background-color: ${COLOR.mainBrand};
`;

function Sidebar() {
	return (
		<SidebarStyled>
			<div className="flex justify-center py-10">
				<Logo className="w-48 h-auto" />
			</div>
			<MenuList />
			<SignOutAdmin />
		</SidebarStyled>
	);
}

export default Sidebar;
