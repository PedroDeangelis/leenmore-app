import {
	Button,
	FormControl,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";
import moment from "moment";
import React, { useRef, useState } from "react";
import transl from "../../../components/translate";
import { useProjecUpdate } from "../../../../hooks/useProject";
import { toast } from "react-toastify";

function EditProjectTitlenDate({
	projectTitle,
	projectID,
	startDateVal,
	endDateVal,
	setIsEditProject,
}) {
	const [startDate, setStartDate] = useState(startDateVal);
	const [endDate, setEndDate] = useState(endDateVal);
	const titleRef = useRef();
	const projectUpdateMutation = useProjecUpdate();

	const handleProjectChanges = (e) => {
		e.preventDefault();

		projectUpdateMutation.mutate(
			{
				project_id: projectID,
				meta: {
					title: titleRef.current.value,
					start_date: startDate,
					end_date: endDate,
				},
			},
			{
				onSuccess: (data) => {
					toast.success(transl("Project updated with success"), {
						position: "top-right",
						autoClose: 4000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
					setIsEditProject(false);
				},
			}
		);
	};

	return (
		<div className="mt-6">
			<TextField
				id="project-title"
				label={transl("Project Title")}
				variant="outlined"
				sx={{ width: "100%" }}
				inputRef={titleRef}
				defaultValue={projectTitle}
			/>

			<FormControl
				variant="outlined"
				className="w-full "
				sx={{ mt: "20px" }}
			>
				<InputLabel htmlFor="start-date-id">
					{transl("Start Date")}
				</InputLabel>
				<OutlinedInput
					id="start-date-id"
					value={startDate}
					type={`date`}
					onChange={(e) => setStartDate(e.target.value)}
					label={transl("Start Date")}
				/>
			</FormControl>

			<FormControl
				variant="outlined"
				className="w-full "
				sx={{ mt: "20px" }}
			>
				<InputLabel htmlFor="end-date-id">
					{transl("End Date")}
				</InputLabel>
				<OutlinedInput
					id="end-date-id"
					value={endDate}
					type={`date`}
					onChange={(e) => setEndDate(e.target.value)}
					label={transl("End Date")}
				/>
			</FormControl>
			<Button
				onClick={handleProjectChanges}
				variant="contained"
				sx={{ mt: "20px", width: "100%" }}
			>
				{transl("Save")}
			</Button>
		</div>
	);
}

export default EditProjectTitlenDate;
