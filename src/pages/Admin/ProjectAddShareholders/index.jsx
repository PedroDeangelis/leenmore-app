import { Button, CircularProgress, Paper } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	useShareholderInsert,
	useShareholdersFromProject,
} from "../../../hooks/useShareholder";
import transl from "../../components/translate";
import Header from "../components/Header";
import ShareholderTable from "../components/ShareholderTable";
import InputCSV from "./components/InputCSV";

import DownloadIcon from "@mui/icons-material/Download";
import { downloadShareholderTemplate } from "../components/shareholderSheet";

function ProjectAddShareholders() {
	const { id } = useParams();
	const { data, isLoading } = useShareholdersFromProject(id);
	const [shareholderList, setShareholderList] = useState(false);
	const [addingShareholderLoading, setaddingShareholderLoading] =
		useState(false);
	const shareholderMutation = useShareholderInsert();
	const navigate = useNavigate();

	const submitShareholder = () => {
		setaddingShareholderLoading(true);
		shareholderMutation.mutate(
			{
				currentShareholders: data,
				shareholdersList: shareholderList,
				project_id: id,
			},
			{
				onSuccess: (data) => {
					navigate(`/dashboard/project/${id}`);
					toast.success(
						transl("List of shareholders added with sucesss"),
						{
							position: "top-right",
							autoClose: 4000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
						}
					);
				},
			}
		);
	};

	return (
		<>
			{isLoading ? (
				<p>{transl("Loading")}</p>
			) : (
				<div>
					<Header title={transl("Add more Shareholders to Project")}>
						<Button sx={{ mr: "20px" }} variant="text">
							<Link to={`/dashboard/project/${id}`}>
								{transl("Go Back")}
							</Link>
						</Button>

						<Button onClick={() => downloadShareholderTemplate()}>
							<DownloadIcon />
							{transl("Download Sample")}
						</Button>
						{shareholderList && (
							<>
								{addingShareholderLoading ? (
									<CircularProgress />
								) : (
									<Button
										onClick={submitShareholder}
										variant="contained"
									>
										{transl("Submit")}
									</Button>
								)}
							</>
						)}
					</Header>
					<div className="mb-4">
						<InputCSV setShareholderList={setShareholderList} />
					</div>
					{shareholderList && (
						<Paper>
							<ShareholderTable list={shareholderList} />
						</Paper>
					)}
				</div>
			)}
		</>
	);
}

export default ProjectAddShareholders;
