import { Chip } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import transl from "../../../components/translate";

function UserTableItem({ id, first_name, email, role, status }) {
	return (
		<Link to={`/dashboard/user/${id}`}>
			<div className="relative p-4 mb-3 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg flex justify-between items-center">
				<p className="text-lg">
					{first_name}
					<span className="ml-2 text-sm text-slate-400">{email}</span>
				</p>
				<div>
					<Chip
						label={transl(role)}
						size="small"
						sx={{ marginRight: 1 }}
					/>
					<Chip
						label={transl(status)}
						size="small"
						color={status === "active" ? "success" : "error"}
					/>
				</div>
			</div>
		</Link>
	);
}

export default UserTableItem;
