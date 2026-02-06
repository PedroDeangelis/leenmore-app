import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import OChip from "../../../components/OChip";
import transl from "../../../components/translate";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "@mui/material";
import { submissionEditAtom } from "../../../../helpers/atom";
import { useAtom } from "jotai";

function SubmissionHistoric({
    submissions,
    resultsList,
    isAdmin,
    handleDeleteSubmission,
}) {
    const [submissionEdit, setSubmissionEdit] = useAtom(submissionEditAtom);
    const [submissionsSorted, setSubmissionsSorted] = useState([]);

    useEffect(() => {
        if (submissions) {
            setSubmissionsSorted(
                submissions.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date) || b.id - a.id;
                })
            );
        }
    }, [submissions]);

    return (
        <div>
            <span className="text-xs block text-slate-500 mb-4">
                {transl("Previous Submissions")}
            </span>
            {submissionsSorted?.map((value) => {
                const resultJson = JSON.parse(resultsList[value.result]);

                let background = "bg-gray-50";

                if (submissionEdit?.id === value.id) {
                    background = "bg-red-50";
                }

                return (
                    <div
                        key={value.id}
                        className={`mb-6 last:mb-0 p-2 rounded ${background} `}
                    >
                        <div className="flex items-start mb-2">
                            <div className="w-full flex items-center">
                                {resultJson && (
                                    <OChip color={resultJson.color} size="sm">
                                        {resultJson.name}
                                    </OChip>
                                )}
                                <p className="text-xs ml-2">
                                    {value.user_name}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <span className="text-xs text-slate-500 mr-2">
                                    {moment(value.date).format("YYYY/MM/DD")}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center mb-2 justify-between">
                            <p className="text-sm">
                                {transl("contact for worker")}:{" "}
                                {value.contact_worker}
                            </p>
                            {isAdmin && (
                                <div className="flex items-center gap-1">
                                    <Button
                                        onClick={() => {
                                            setSubmissionEdit(value);
                                        }}
                                        size="small"
                                        variant="outlined"
                                        sx={{ minWidth: 0 }}
                                    >
                                        <EditIcon sx={{ fontSize: "14px" }} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSubmissionEdit(false);
                                            handleDeleteSubmission(
                                                value.id,
                                                submissionsSorted,
                                                value.project_id
                                            );
                                        }}
                                        size="small"
                                        variant="outlined"
                                        sx={{ minWidth: 0 }}
                                    >
                                        <ClearIcon sx={{ fontSize: "14px" }} />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <p className="">{value.note}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default SubmissionHistoric;
