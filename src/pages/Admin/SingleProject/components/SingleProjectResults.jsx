import {
    Button,
    Card,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OChip from "../../../components/OChip";
import transl from "../../../components/translate";
import ProjectWorkspaceLoopItem from "../../Dashboard/components/ProjectWorkspaceLoopItem";
import EditIcon from "@mui/icons-material/Edit";
import ResultsTableLoop from "./results/ResultsTableLoop";
import { useProjecUpdate } from "../../../../hooks/useProject";
import { toast } from "react-toastify";
import ResultsDragnDrog from "./results/ResultsDragnDrog";
import RealTimeResults from "./RealTimeResults";

function SingleProjectResults({ results, project }) {
    const [isEdit, setIsEdit] = useState(false);
    const [isOrderning, setIsOrderning] = useState(false);
    const updateProjectMutation = useProjecUpdate();

    const handleEdit = () => {
        setIsEdit(!isEdit);
    };

    const [resultsTemp, setResultsTemp] = useState([...results]);

    const handleResultsSave = () => {
        updateProjectMutation.mutate(
            {
                project_id: project.id,
                meta: {
                    results: resultsTemp,
                },
            },
            {
                onSuccess: () => {
                    setIsEdit(false);
                    toast.success(transl("Project Updated Successfully"), {
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
    };
    return (
        <div className="grid grid-cols-3 mb-4 gap-4">
            <RealTimeResults project={project} />
            {isOrderning ? (
                <ResultsDragnDrog
                    results={results}
                    project={project}
                    setIsOrderning={setIsOrderning}
                />
            ) : (
                <Card className="">
                    <CardContent>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xl">{transl("Results")}</p>
                            {updateProjectMutation.isLoading ? (
                                <div>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <>
                                    {isEdit ? (
                                        <div className="flex items-center">
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    handleEdit();
                                                    setResultsTemp([
                                                        ...results,
                                                    ]);
                                                }}
                                            >
                                                {transl("cancel")}
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{ marginLeft: "10px" }}
                                                onClick={handleResultsSave}
                                            >
                                                {transl("save")}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ marginRight: "10px" }}
                                                onClick={() =>
                                                    setIsOrderning(true)
                                                }
                                            >
                                                {transl("Order Results")}
                                            </Button>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={handleEdit}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <TableContainer className="border border-gray-300 rounded-sm divide-y">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: "30px" }}>
                                            {transl("C")}
                                        </TableCell>
                                        <TableCell sx={{ width: "30px" }}>
                                            {transl("A")}
                                        </TableCell>
                                        <TableCell>{transl("Name")}</TableCell>
                                        <TableCell>{transl("Color")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <ResultsTableLoop
                                    results={resultsTemp}
                                    setResults={setResultsTemp}
                                    isEdit={isEdit}
                                />
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default SingleProjectResults;
