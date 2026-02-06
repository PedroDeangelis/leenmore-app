import React from "react";
import logo from "../../assets/images/logo.png";

function Logo({ className }) {
	return (
		<img
			className={className}
			src={logo}
			alt="Logo"
			width="230"
			heigh="51"
		/>
	);
}

export default Logo;
