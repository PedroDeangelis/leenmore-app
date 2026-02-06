import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import React from "react";
import transl from "../../components/translate";
import ClearIcon from "@mui/icons-material/Clear";
import OChip from "../../components/OChip";
import {
    useShareholderDelete,
    useShareholderUpdate,
} from "../../../hooks/useShareholder";
import { toast } from "react-toastify";

function ShareholderTable({ list, isEditble, projectResult }) {
	const stickyCell = "sticky left-0 bg-white z-20";
	const deleteShareholderMutation = useShareholderDelete();
    const updateShareholderMutation = useShareholderUpdate();
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [selectedShareholder, setSelectedShareholder] = React.useState(null);
    const [workers, setWorkers] = React.useState([]);

	const handleDeleteShareholder = (id, name) => {
		if (
			window.confirm(
				`${transl(
					"Do you really want to delete this shareholder?"
				)} \n\n\n${transl("shareholder name")}: ${name} `
			) == true
		) {
			deleteShareholderMutation.mutate(
				{
					id: id,
				},
				{
					onSuccess: () => {
						toast.success("Shareholder deleted successfully", {
							position: "top-right",
							autoClose: 4000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
						});
					},
				}
			);
		}
	};

    const openWorkersModal = (shareholder) => {
        setSelectedShareholder(shareholder);
        const currentWorkers = Array.isArray(shareholder.user)
            ? shareholder.user.slice(0, 5)
            : [];
        setWorkers(currentWorkers.length ? currentWorkers : [""]);
        setEditModalOpen(true);
    };

    const closeWorkersModal = () => {
        setEditModalOpen(false);
        setSelectedShareholder(null);
        setWorkers([]);
    };

    const handleWorkerChange = (index, value) => {
        const next = [...workers];
        next[index] = value;
        setWorkers(next);
    };

    const handleAddWorker = () => {
        if (workers.length >= 5) return;
        setWorkers([...workers, ""]);
    };

    const handleRemoveWorker = (index) => {
        const next = workers.filter((_, i) => i !== index);
        setWorkers(next.length ? next : [""]);
    };

    const handleSaveWorkers = () => {
        if (!selectedShareholder) return;
        const cleanWorkers = workers
            .map((w) => w.trim())
            .filter(Boolean)
            .slice(0, 5);

        if (!cleanWorkers.length) {
            toast.error(transl("Please add at least one worker"));
            return;
        }

        updateShareholderMutation.mutate(
            {
                formatedShareholders: [
                    {
                        id: selectedShareholder.id,
                        user: cleanWorkers,
                    },
                ],
            },
            {
                onSuccess: () => {
                    toast.success(transl("Workers updated"));
                    closeWorkersModal();
                },
                onError: () => {
                    toast.error(transl("Could not update workers"));
                },
            }
        );
    };

	return (
		<div className="p-4 ">
			<TableContainer
				className="border"
				sx={{
					maxHeight: 440,
					maxWidth: "100%",
					overflowX: "auto",
				}}
			>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell
								className={stickyCell}
								style={{ minWidth: 96, zIndex: 22 }}
							>
								{transl("no")}.
							</TableCell>
							<TableCell
								className={`${stickyCell} left-24`}
								style={{
									minWidth: 120,
									zIndex: 22,
									borderRight: "1px solid #e0e0e0",
								}}
							>
								{transl("name")}
							</TableCell>
							<TableCell style={{ minWidth: 100 }}>
								{transl("Resident Registration Number")}
							</TableCell>
							<TableCell style={{ minWidth: 100 }}>
								{transl("sex")}
							</TableCell>
							<TableCell style={{ minWidth: 200 }}>
								{transl("number Of Shares")}
							</TableCell>
							<TableCell style={{ minWidth: 200 }}>
								{transl("total Number Of Shares")}
							</TableCell>
							<TableCell style={{ minWidth: 300 }}>
								{transl("contact Info")}
							</TableCell>
							<TableCell style={{ minWidth: 300 }}>
								{transl("database")}
							</TableCell>
							<TableCell style={{ minWidth: 300 }}>
								{transl("contact for worker")}
							</TableCell>
							<TableCell style={{ minWidth: 300 }}>
								{transl("Eletronic Voting")}
							</TableCell>
							<TableCell style={{ minWidth: 300 }}>
								{transl("address")}
							</TableCell>
							<TableCell style={{ minWidth: 100 }}>
								{transl("worker")}
							</TableCell>
							<TableCell style={{ minWidth: 100 }}>
								{transl("Result")}
							</TableCell>
							<TableCell style={{ minWidth: 150 }}>
								{transl("person Type")}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{list
							.sort((a, b) => a.no - b.no)
							.map((value, key) => {
								var chip = "";
								if (isEditble && projectResult[value.result]) {
									chip = JSON.parse(
										projectResult[value.result]
									);
								}

								return (
									<TableRow key={key}>
										<TableCell className={stickyCell}>
											{isEditble && !value?.result && (
												<IconButton
													size="small"
													onClick={() =>
														handleDeleteShareholder(
															value.id,
															value.name
														)
													}
												>
													<ClearIcon
														sx={{ fontSize: 12 }}
													/>
												</IconButton>
											)}
											{value?.no}
										</TableCell>
										<TableCell
											className={`${stickyCell} left-24`}
											style={{
												borderRight:
													"1px solid #e0e0e0",
											}}
										>
											<div className="flex items-center">
												{value.name}
											</div>
										</TableCell>
										<TableCell>
											{value.registration}
										</TableCell>
										<TableCell>{value.sex}</TableCell>
										<TableCell>{value.shares}</TableCell>
										<TableCell>
											{value.shares_total}
										</TableCell>
										<TableCell>
											{value.contact_info}
										</TableCell>
										<TableCell>{value.database}</TableCell>
										<TableCell>
											{value.contact_worker}
										</TableCell>
										<TableCell>
											{value.eletronic_voting}
										</TableCell>
										<TableCell>{value.address}</TableCell>
										<TableCell>
                                        {value.user.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                size="small"
                                                variant="outlined"
                                                sx={{ marginBottom: "6px" }}
                                            />
                                        ))}
                                            {/* Edit Users */}
                                            <button
                                                type="button"
                                                className="underline"
                                                style={{ fontSize: "10px" }}
                                                onClick={() =>
                                                    openWorkersModal(value)
                                                }
                                                disabled={updateShareholderMutation.isLoading}
                                            >
                                                {transl("Edit Workers")}
                                            </button>
                                        </TableCell>
										<TableCell>
											<OChip color={chip.color}>
												{chip.name}
											</OChip>
										</TableCell>
										<TableCell>
											{value.person_type}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
            <Dialog
                open={editModalOpen}
                onClose={closeWorkersModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{transl("Edit Workers")}</DialogTitle>
                <DialogContent>
                    <p className="text-sm text-gray-600 mb-3">
                        {transl("Add up to 5 workers for this shareholder")}
                    </p>
                    {workers.map((worker, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                        >
                            <TextField
                                fullWidth
                                size="small"
                                label={`${transl("Worker")} ${index + 1}`}
                                value={worker}
                                onChange={(e) =>
                                    handleWorkerChange(index, e.target.value)
                                }
                            />
                            <IconButton
                                aria-label={transl("Remove")}
                                onClick={() => handleRemoveWorker(index)}
                                size="small"
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </div>
                    ))}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            {transl("Maximum 5 workers")}
                        </span>
                        <Button
                            onClick={handleAddWorker}
                            size="small"
                            variant="outlined"
                            disabled={workers.length >= 5}
                        >
                            {transl("Add Worker")}
                        </Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeWorkersModal}
                        disabled={updateShareholderMutation.isLoading}
                    >
                        {transl("Cancel")}
                    </Button>
                    <Button
                        onClick={handleSaveWorkers}
                        variant="contained"
                        disabled={updateShareholderMutation.isLoading}
                    >
                        {updateShareholderMutation.isLoading
                            ? transl("Saving...")
                            : transl("Save")}
                    </Button>
                </DialogActions>
            </Dialog>
		</div>
	);
}

export default ShareholderTable;
