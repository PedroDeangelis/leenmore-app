import { Card, CardContent } from "@mui/material";
import React from "react";
import transl from "../../../components/translate";

function SubmissionData({ project, submission, shareholder }) {
	return (
		<Card className="mb-10">
			<CardContent className="flex items-center">
				<div>
					<p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
						{transl("project")}
					</p>
					<p>{project?.title}</p>
				</div>
				<div className="ml-20">
					<p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
						{transl("shareholder")}
					</p>
					<p>{shareholder?.name}</p>
				</div>
				<div className="ml-20">
					<p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
						{transl("worker")}
					</p>
					<p>{submission?.user_name}</p>
				</div>
			</CardContent>
		</Card>
	);
}

export default SubmissionData;
