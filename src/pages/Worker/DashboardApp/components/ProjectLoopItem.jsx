import { Avatar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import { COLOR } from "../../../../common/variables";
import transl from "../../../components/translate";

function ProjectLoopItem({ title, shareholders, id }) {
	return (
		<Link to={`/app/project/${id}`}>
			<div className="relative p-1 mb-3 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg flex justify-between items-center">
				<div className="flex items-center px-3 py-2 ">
					<Avatar sx={{ bgcolor: COLOR.darkAccent }}>
						{title.charAt(0)}
					</Avatar>
					<div className="ml-2">
						<p className="text-lg font-bold">{title}</p>
						<p className="opacity-60 text-xs">
							{shareholders} {transl("shareholders")}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default ProjectLoopItem;
