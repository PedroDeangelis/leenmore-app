import { Card, CardContent, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import getShareholderSex from "../../../Worker/components/getShareholderSex";
import transl from "../../../components/translate";
import { Link } from "react-router-dom";
import OChip from "../../../components/OChip";
import { useSubmissionsByProjectAndShareholder } from "../../../../hooks/useSubmission";

function SelectShareholdersLoopItem({ shareholder, project_id, resultsList }) {
    const {
        name,
        date_of_birth_code,
        sex,
        shares,
        shares_total,
        address,
        id,
        result,
    } = shareholder;

    const [resultChipValue, setResultChipValue] = useState(null);
    const [lastWorker, setLastWorker] = useState(null);
    const [firstWorker, setFirstWorker] = useState(null);
    const { data: submissions, isLoading } =
        useSubmissionsByProjectAndShareholder(project_id, id);

    useEffect(() => {
        if (resultsList) {
            let temp_result = resultsList[result];
            if (temp_result) {
                setResultChipValue(JSON.parse(temp_result));
            }
        }
    }, [result, resultsList]);

    useEffect(() => {
        if (submissions) {
            if (submissions.length > 0) {
                // get the last submission by the date and sort by date first and id second
                const sortedSubmissions = submissions.sort(
                    (a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id
                );

                setLastWorker(sortedSubmissions[0].user_name);

                // get the first submission by the date and sort by date first and id second
                const sortedSubmissions2 = submissions.sort(
                    (a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id
                );

                setFirstWorker(sortedSubmissions2[0].user_name);
            }
        }
    }, [submissions]);

    return (
        <Card>
            <Link to={`/dashboard/activity-report/new/${project_id}/${id}`}>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <p className="font-bold">
                            {name}
                            <span className="text-slate-500 font-normal mx-2">
                                {date_of_birth_code}
                            </span>
                            {getShareholderSex(sex)}
                        </p>
                        {lastWorker && (
                            <p className="font-bold text-xs text-blue-600">
                                최종 보고자: {lastWorker}
                            </p>
                        )}
                        {resultChipValue && (
                            <OChip color={resultChipValue.color} size="sm">
                                {resultChipValue.name}
                            </OChip>
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-center">
                            <span className="text-xs block text-slate-500">
                                {transl("Shares")}
                            </span>
                            {shares}
                        </p>
                        <p className="text-center">
                            <span className="text-xs block text-slate-500">
                                {transl("Total Shares")}
                            </span>
                            {shares_total}
                        </p>
                        <p className="text-center">
                            {firstWorker && (
                                <>
                                    <span className="text-xs block text-slate-500">
                                        {transl("first person")}
                                    </span>
                                    {firstWorker}
                                </>
                            )}
                        </p>
                    </div>
                    <p className=" mt-4">
                        <span className="text-xs block text-slate-500">
                            {transl("Address")}
                        </span>
                        {address}
                    </p>
                </CardContent>
            </Link>
        </Card>
    );
}

export default SelectShareholdersLoopItem;
