import { Button, CircularProgress, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useShareholderUpdate } from "../../../../hooks/useShareholder";
import transl from "../../../components/translate";
import ShareholderTable from "../../components/ShareholderTable";
import EditShareholderResultDialog from "./EditShareholderResultDialog";
import EditShareholdersListDialog from "./EditShareholdersListDialog";
import getShaholdersEditList from "./getShaholdersEditList";
import ShareholderSearchTable from "./ShareholderSearchTable";

function SingleProjectShareholders({ project }) {
	const [csvBody, setCsvBody] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editDialogShareholder, setEditDialogShareholder] = useState(false);
	const updateShaholdersMutation = useShareholderUpdate();
	const [searchField, setSearchField] = useState("");
	const [searchShareholderResults, setSearchShareholderResults] = useState(
		[]
	);

	const handleSearchChange = (event) => {
		setSearchField(event.target.value);
	};

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleEditing = (shareholder) => {
		setOpenEditDialog(true);
		setEditDialogShareholder(shareholder);
	};

	const handleCloseEditing = () => {
		setOpenEditDialog(false);
		setEditDialogShareholder(false);
	};

	const handleResultUpdate = (shareholder, result) => {
		const formatedShareholders = [{ id: shareholder.id, result: result }];

		updateShaholdersMutation.mutate(
			{
				formatedShareholders,
			},
			{
				onSuccess: (error) => {
					if (error) {
						toast.error(
							"Something went wrong! Check your excel please.",
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
					} else {
						toast.success(
							transl("The Shareholder result is updated"),
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
					}
					handleCloseEditing();
				},
			}
		);
	};

	useEffect(() => {
		if (project.shareholder) {
			setCsvBody(getShaholdersEditList(project.shareholder));
			setSearchShareholderResults(project.shareholder.slice(0, 10));
		}
	}, [project]);

	useEffect(() => {
		if (searchField) {
			const filteredShareholders = project.shareholder.filter(
				(shareholder) =>
					shareholder.name
						.toLowerCase()
						.includes(searchField.toLowerCase()) ||
					shareholder.registration
						.toLowerCase()
						.includes(searchField.toLowerCase())
			);
			setSearchShareholderResults(filteredShareholders.slice(0, 40));
		} else {
			setSearchShareholderResults(project.shareholder.slice(0, 10));
		}
	}, [searchField]);

	return (
		<div>
			<Paper className="mb-8">
				<div className="flex justify-between p-4 pb-0 items-center">
					<div className="flex items-center">
						<p className="text-xl mr-4 flex-shrink-0">
							{transl("Shareholders")}{" "}
							<span className="text-sm text-slate-400">
								({project.shareholder?.length})
							</span>
						</p>
						<ShareholderSearchTable
							searchField={searchField}
							handleSearchChange={handleSearchChange}
						/>
					</div>
					<div className="flex items-start">
						<p className="mr-4">
							{!csvBody ? (
								<CircularProgress />
							) : (
								<Button onClick={handleOpenDialog}>
									{transl("Edit Shareholders List")}
								</Button>
							)}
						</p>
						<Link
							to={`/dashboard/project/${project.id}/add-more-shareholders`}
						>
							<Button variant="outlined" className="">
								{transl("Add more shareholders")}
							</Button>
						</Link>
					</div>
				</div>
				<ShareholderTable
					list={searchShareholderResults}
					isEditble={true}
					projectResult={project.results}
					handleEditing={handleEditing}
				/>
			</Paper>
			<EditShareholdersListDialog
				open={openDialog}
				csvBody={csvBody}
				handleClose={handleCloseDialog}
			/>
			<EditShareholderResultDialog
				shareholder={editDialogShareholder}
				handleCloseEditing={handleCloseEditing}
				open={openEditDialog}
				results={project.results}
				handleResultUpdate={handleResultUpdate}
			/>
		</div>
	);
}

export default SingleProjectShareholders;
