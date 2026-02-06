import React from "react";

function Header({ title, children }) {
	return (
		<div className="flex justify-between items-center pt-9 mb-8">
			<h1 className="text-gray-90">{title}</h1>
			<div>{children}</div>
		</div>
	);
}

export default Header;
