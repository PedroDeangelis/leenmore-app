import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import { CircularProgress } from "@mui/material";
import { numberWithCommas } from "../../../components/formatNumber";

// `shares` is a text column holding comma-formatted numbers, and a few rows
// are null -- an unguarded .replace() here threw and blanked the page.
const parseShares = (value) =>
    Math.trunc(Number(String(value ?? "").replace(/,/g, "")) || 0);

function SubmissionInfo({ data }) {
    const [submissionInfo, setSubmissionInfo] = useState({});

    useEffect(() => {
        // Totals follow the rows actually listed: a shareholder with two 유보
        // submissions counts twice. With "show only last submission" checked
        // the list already holds one row per shareholder, so the same sum
        // matches the per-result totals on the project page.
        let rowsTotal = 0;
        let totalShares = 0;
        let totalSharesTotal = 0;

        if (data) {
            data.forEach(({ shareholder }) => {
                // Electronic-vote shareholders are left out of the result
                // totals on the project page too.
                if (shareholder?.eletronic_voting?.length) return;

                rowsTotal += 1;
                totalShares += parseShares(shareholder?.shares);
                totalSharesTotal += parseShares(shareholder?.shares_total);
            });
        }

        setSubmissionInfo({
            shareholdersTotal: rowsTotal,
            totalShares: numberWithCommas(totalShares),
            totalSharesTotal: numberWithCommas(totalSharesTotal),
        });
    }, [data]);

    return (
        <div className="mb-3 rounded-lg bg-white shadow-card flex ">
            <span
                className={`py-3 text-sm tracking-wider font-bold w-2/12 pl-6`}
            >
                {submissionInfo?.shareholdersTotal ?? (
                    <CircularProgress size={18} />
                )}
            </span>
            <span className={`py-3 text-sm tracking-wider font-bold w-2/12`}>
                {submissionInfo?.totalShares ?? <CircularProgress size={18} />}
            </span>
            <span className={`py-3 text-sm tracking-wider font-bold w-2/12`}>
                {submissionInfo?.totalSharesTotal ?? (
                    <CircularProgress size={18} />
                )}
            </span>
        </div>
    );
}

export default SubmissionInfo;
