import { Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import { getLastSubmissions } from "./getSubmissionActivityData";
import formatNumber from "../../../components/formatNumber";

function ActivitySummaryTable({ submissions, results }) {
    const [totalWorkers, setTotalWorkers] = useState(0);
    const [totalProxyShareholders, setTotalProxyShareholders] = useState(0);
    const [totalSharesOwnedByProxy, setTotalSharesOwnedByProxy] = useState(0);

    useEffect(() => {
        if (!submissions) {
            return;
        }

        var workers = {};
        var resultList = results.map((result) => JSON.parse(result));
        const greensResults = resultList.reduce((acc, item, index) => {
            if (item.color === "green") {
                acc.push({ ...item, pos: index });
            }
            return acc;
        }, []);

        var lastSubmissionPerShareholder = getLastSubmissions(submissions);

        lastSubmissionPerShareholder.forEach((submission) => {
            const worker = submission.user_name;
            var shares = submission.shareholder.shares;
            shares = shares.replace(",", "");
            shares = shares.replace(".", "");
            shares = parseInt(shares);

            if (!workers[worker]) {
                workers[worker] = {
                    totalReports: 0,
                    totalSharesContacted: 0,
                    proxyShareholders: 0,
                    ownedSharesByProxy: 0,
                };
            }

            workers[worker].totalReports += 1;
            workers[worker].totalSharesContacted += shares;

            // check if its a green result
            if (greensResults.some((item) => item.pos == submission.result)) {
                workers[worker].proxyShareholders += 1;
                workers[worker].ownedSharesByProxy += shares;
            }
        });

        setTotalWorkers(Object.keys(workers).length);

        var _totalProxyShareholders = 0;
        var _totalSharesOwnedByProxy = 0;

        Object.values(workers).forEach((worker) => {
            _totalProxyShareholders += worker.proxyShareholders;
            _totalSharesOwnedByProxy += worker.ownedSharesByProxy;
        });

        setTotalProxyShareholders(_totalProxyShareholders);
        setTotalSharesOwnedByProxy(_totalSharesOwnedByProxy);
    }, [submissions]);

    return (
        <div className="w-3/12 pl-10">
            <Card className="mb-4">
                <CardContent>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        {transl("number of workers")}
                    </p>
                    <p className="text-lg">{totalWorkers}</p>
                </CardContent>
            </Card>
            <Card className="mb-4">
                <CardContent>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        {transl("Total Number of Proxy Shareholders")}
                    </p>
                    <p className="text-lg">{totalProxyShareholders}</p>
                </CardContent>
            </Card>
            <Card className="">
                <CardContent>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        {transl("total number of shares owned by proxy")}
                    </p>
                    <p className="text-lg">
                        {formatNumber(totalSharesOwnedByProxy)}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default ActivitySummaryTable;
