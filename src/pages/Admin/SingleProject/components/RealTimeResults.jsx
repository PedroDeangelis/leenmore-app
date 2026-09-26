import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import transl from "../../../components/translate";
import EditIcon from "@mui/icons-material/Edit";
import { useProjecUpdate } from "../../../../hooks/useProject";
import { toast } from "react-toastify";
import { rgba } from "polished";
import { Link } from "react-router-dom";
import supabase from "../../../../utils/supabaseClient";
import { getPercentageRateFromTally } from "../../components/getPercentageRateForShareholder";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import downloadExcelNotes from "./downloadExcelNotes";
import {
    EPROXY_LINK_RESULT,
    isEproxyLinkResult,
} from "../../../components/resultSentinels";

function RealTimeResults({ project, tally }) {
    const [isEdit, setIsEdit] = useState(false);
    const [sharesIssued, setSharesIssued] = useState(project.shares_issued);
    const [sharesTarget, setSharesTarget] = useState(project.shares_target);
    const updateProjectMutation = useProjecUpdate();

    function formatNumber(value) {
        return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const handleChangeSharesTarget = () => {
        setIsEdit(!isEdit);
    };

    const handleShareTargetSave = () => {
        updateProjectMutation.mutate(
            {
                project_id: project.id,
                meta: {
                    shares_issued: sharesIssued,
                    shares_target: sharesTarget,
                },
            },
            {
                onSuccess: () => {
                    setIsEdit(false);
                    toast.success(
                        transl("Status Updated to the current project"),
                        {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        },
                    );
                },
            },
        );
    };
    const handleSharesIssuedChange = (event) => {
        const value = event.target.value;
        const formattedValue = formatNumber(value);
        setSharesIssued(formattedValue);
    };

    const handleSharesTargetChange = (event) => {
        const value = event.target.value;
        const formattedValue = formatNumber(value);
        setSharesTarget(formattedValue);
    };

    // Derived, not stored. This was a useEffect that called setResultsRate
    // with `commit_timestamp: Date.now()` spliced in -- a guaranteed-new
    // object identity on every commit, so React could never bail out and the
    // effect re-ran itself through its own `project` dependency. It also
    // re-aggregated every shareholder each pass.
    //
    // Keyed on the fields actually consumed rather than the whole `project`
    // object, so an unrelated project field changing does not recompute.
    const resultsRate = useMemo(() => {
        // `shares_target` is a nullable text column; an unguarded .replace()
        // here threw and blanked the whole panel.
        const target =
            Number(String(project.shares_target ?? "").replace(/,/g, "")) || 0;

        return getPercentageRateFromTally(tally, project.results, target);
    }, [tally, project.results, project.shares_target]);

    return (
        <Card className="col-span-2">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <Button
                        onClick={() => {
                            downloadExcelNotes(
                                project.shares_issued,
                                project.shares_target,
                                resultsRate,
                                project.title,
                                project.end_date,
                            );
                        }}
                    >
                        <FileDownloadIcon />
                    </Button>
                    {isEdit ? (
                        <div className="flex items-center">
                            <Button
                                size="small"
                                onClick={handleChangeSharesTarget}
                            >
                                {transl("cancel")}
                            </Button>
                            <Button
                                onClick={handleShareTargetSave}
                                size="small"
                                variant="contained"
                                sx={{ marginLeft: "10px" }}
                            >
                                {transl("save")}
                            </Button>
                        </div>
                    ) : (
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={handleChangeSharesTarget}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    )}
                </div>
            </div>
            <div>
                <CardContent>
                    <div className="flex items-start justify-between text-center mb-6">
                        <div>
                            <p className="text-sm text-gray-500">
                                {transl("total number of shares issued")}:
                            </p>
                            {updateProjectMutation.isLoading ? (
                                <div>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <>
                                    {isEdit ? (
                                        <TextField
                                            id="shares-issued"
                                            variant="outlined"
                                            value={sharesIssued}
                                            onChange={handleSharesIssuedChange}
                                            inputProps={{
                                                min: 0,
                                                style: { textAlign: "center" },
                                            }}
                                        />
                                    ) : (
                                        <p className="font-medium">
                                            {project.shares_issued}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {transl("target number of shares")}:
                            </p>
                            {updateProjectMutation.isLoading ? (
                                <div>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <>
                                    {isEdit ? (
                                        <TextField
                                            id="shares-issued"
                                            variant="outlined"
                                            value={sharesTarget}
                                            onChange={handleSharesTargetChange}
                                            inputProps={{
                                                min: 0,
                                                style: { textAlign: "center" },
                                            }}
                                        />
                                    ) : (
                                        <p className="font-medium">
                                            {project.shares_target}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
                <div className="grid grid-cols-6 text-sm text-gray-500 mb-2">
                    <p className="col-span-2 pl-4">{transl("Result")}</p>
                    <p className="text-center">{transl("number of shares")}</p>
                    <p className="text-center">{transl("Percentage")}</p>
                    <p className="text-center font-bold">
                        {transl("Type total")}
                    </p>
                    <p className="text-center font-bold">
                        {transl("Type Percentage")}
                    </p>
                </div>
                {resultsRate &&
                    resultsRate?.results?.map((result) => {
                        // `result.name` is a translated label, so comparing it
                        // to a hardcoded Korean literal broke under any other
                        // locale or a reworded translation.
                        const isEproxyRow = isEproxyLinkResult(result.name);

                        let linkResultGetValue = result.result;

                        if (isEproxyRow) {
                            linkResultGetValue = EPROXY_LINK_RESULT;
                        }

                        return (
                            <div
                                style={{
                                    backgroundColor: rgba(
                                        `${result.colorHex}`,
                                        0.4,
                                    ),
                                }}
                                className="grid grid-cols-6 text-sm text-gray-700  font-medium items-center"
                                key={result.result}
                            >
                                <p className="col-span-2 uppercase text-black  py-2 px-4">
                                    <Link
                                        to={`/dashboard/submission/project/${project.id}?result=${linkResultGetValue}`}
                                    >
                                        <span
                                            className={`${(isEproxyRow && "font-bold") || ""}`}
                                        >
                                            {result.name}
                                        </span>
                                    </Link>
                                </p>
                                <p className="text-center py-2 px-4">
                                    {result.total}
                                </p>
                                <p className="text-center py-2 px-4">
                                    {result.percentage}%
                                </p>

                                {resultsRate.colorTotal.hasOwnProperty(
                                    result.color,
                                ) &&
                                resultsRate.colorTotal[result.color][
                                    "result"
                                ] == result.result ? (
                                    <>
                                        <p
                                            className="text-center py-2 px-4 font-bold"
                                            style={{
                                                backgroundColor: rgba(
                                                    `${result.colorHex}`,
                                                    0.8,
                                                ),
                                            }}
                                        >
                                            {
                                                resultsRate.colorTotal[
                                                    result.color
                                                ]["total"]
                                            }
                                        </p>
                                        <p
                                            className="text-center py-2 px-4 font-bold"
                                            style={{
                                                backgroundColor: rgba(
                                                    `${result.colorHex}`,
                                                    0.8,
                                                ),
                                            }}
                                        >
                                            {resultsRate.colorTotal[
                                                result.color
                                            ]["percentage"].toFixed(2)}
                                            %
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p
                                            className="text-center py-2 px-4 col-span-2"
                                            style={{
                                                backgroundColor: rgba(
                                                    `${result.colorHex}`,
                                                    0.8,
                                                ),
                                            }}
                                        >
                                            <span className="opacity-0">.</span>
                                        </p>
                                    </>
                                )}
                            </div>
                        );
                    })}
            </div>
        </Card>
    );
}

export default RealTimeResults;
