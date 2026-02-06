import { Card, CardContent } from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import DataDisplay from "../../components/DataDisplay";

function SingleUserInfo({ first_name, email, role, status }) {
	return (
		<Card className="mb-4">
			<CardContent>
				<div className="grid grid-cols-4 gap-4">
					<DataDisplay className="col-span-2" label={transl("Title")}>
						{first_name}
					</DataDisplay>
					<DataDisplay label={transl("Email")}>{email}</DataDisplay>
					<div className="grid grid-cols-2">
						<DataDisplay label={transl("Role")}>
							{transl(role)}
						</DataDisplay>
						<DataDisplay label={transl("Status")}>
							{transl(status)}
						</DataDisplay>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default SingleUserInfo;
