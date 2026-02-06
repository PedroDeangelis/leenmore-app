import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useProject } from "../../../hooks/useProject";
import { useShareholder } from "../../../hooks/useShareholder";
import { useSubmission } from "../../../hooks/useSubmission";
import transl from "../../components/translate";
import Header from "../components/Header";
import SubmissionData from "./components/SubmissionData";
import SubmissionFormEdit from "./components/SubmissionFormEdit";

function SubmissionEdit() {
	const { id } = useParams();
	const { data, isLoading } = useSubmission(id);
	const { data: projectData, isLoading: isLoadingProject } = useProject(
		data?.project_id
	);
	const { data: shareholderData, isLoading: isLoadingShareholder } =
		useShareholder(data?.shareholder_id);
	const [project, setProject] = useState(null);
	const [shareholder, setShareholder] = useState(null);

	useEffect(() => {
		if (data?.project_id && !isLoadingProject && projectData) {
			setProject(projectData);
		}
	}, [data, projectData, isLoadingProject]);

	useEffect(() => {
		if (data?.shareholder_id && !isLoadingShareholder && shareholderData) {
			setShareholder(shareholderData);
		}
	}, [data, shareholderData, isLoadingShareholder]);

	return (
		<>
			<Header title={`${transl("Submission")}: ${id}`}></Header>
			<SubmissionData
				project={project}
				submission={data}
				shareholder={shareholder}
			/>
			{project?.id && (
				<SubmissionFormEdit project={project} submission={data} />
			)}
		</>
	);
}

export default SubmissionEdit;
