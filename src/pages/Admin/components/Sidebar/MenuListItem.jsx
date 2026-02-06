import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { COLOR } from "../../../../common/variables";

const MenuListItemStyled = styled.div`
	position: relative;
	color: white;
	cursor: pointer;

	&.selected {
		color: ${COLOR.mainBrand};
	}

	.menu-list-item-selection {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 4px;
		background-color: white;
	}
`;

function MenuListItem({ title, link, icon }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = () => {
		navigate(link);
	};

	const spring = {
		type: "spring",
		stiffness: 500,
		damping: 30,
	};

	useEffect(() => {
		if (link == "/dashboard") {
			if (location.pathname == link) {
				setIsSelected(true);
			} else {
				setIsSelected(false);
			}
		} else if (location.pathname.indexOf(link) != -1) {
			setIsSelected(true);
		} else {
			setIsSelected(false);
		}
	}, [location.pathname]);

	return (
		<MenuListItemStyled
			onClick={handleClick}
			className={`flex items-center px-2 py-4 ${
				isSelected && "selected"
			}`}
		>
			{isSelected ? (
				<motion.div
					layout
					className="menu-list-item-selection"
					layoutId="menu-list-item-selection"
					//initial={false}
					//animate={{ : color }}
					transition={spring}
				></motion.div>
			) : null}
			<span className="relative flex">{icon}</span>
			<p className="ml-2  leading-4 relative font-medium">{title}</p>
		</MenuListItemStyled>
	);
}

export default MenuListItem;
