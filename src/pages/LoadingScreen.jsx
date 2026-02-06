import React from "react";
import transl from "./components/translate";
import { COLOR } from "../common/variables";

function LoadingScreen() {
	//create a fancy loading screen
	return (
		<div
			className="flex items-center justify-center h-screen "
			style={{ background: `${COLOR.mainBrand}` }}
		>
			<p className="text-white text-xl font-bold tracking-wider">
				{transl("Loading")}...
			</p>
		</div>
	);
}

export default LoadingScreen;
