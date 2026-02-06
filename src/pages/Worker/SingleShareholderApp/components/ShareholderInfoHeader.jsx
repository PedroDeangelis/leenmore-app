import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import transl from "../../../components/translate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ShareholderInfoHeader({
	name,
	sex,
	id,
	date_of_birth_code,
	project_id,
}) {
	return (
		<div className=" flex justify-between items-end">
			<div className="flex items-center">
				<Link to={`/app/project/${project_id}`} className="mr-4">
					<ArrowBackIcon />
				</Link>
				<div>
					<p className="text-xs mb-3">{transl("Shareholder")}</p>
					<h1 className="text-3xl">
						<span>
							{name}
							<span className=" ml-4">
								({date_of_birth_code})
							</span>
							{sex && (
								<span
									className=" py-2 px-3 rounded-full text-xl ml-4"
									style={{ background: "rgba(0, 0, 0, 0.2)" }}
								>
									{sex}
								</span>
							)}
						</span>
					</h1>
				</div>
			</div>
		</div>
	);
}

export default ShareholderInfoHeader;
