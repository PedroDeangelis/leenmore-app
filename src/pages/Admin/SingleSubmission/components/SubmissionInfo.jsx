import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import { CircularProgress } from "@mui/material";
import { numberWithCommas } from "../../../components/formatNumber";

function SubmissionInfo({ data }) {
    const [submissionInfo, setSubmissionInfo] = useState({});

    useEffect(() => {
        const shareholdersTotal = new Set();
        let totalShares = 0;
        let totalSharesTotal = 0;

        if (data) {
            data.forEach((submission) => {
                const { shareholder_id, shareholder } = submission;

                if (
                    !shareholdersTotal.has(shareholder_id) &&
                    shareholder.eletronic_voting == ""
                ) {
                    shareholdersTotal.add(shareholder_id);
                    const shares = parseInt(
                        shareholder.shares.replace(/,/g, ""),
                        10
                    );
                    const sharesTotal = parseInt(
                        shareholder.shares_total.replace(/,/g, ""),
                        10
                    );
                    totalShares += shares;
                    totalSharesTotal += sharesTotal;
                }
            });
        }

        setSubmissionInfo({
            shareholdersTotal: shareholdersTotal.size,
            totalShares: numberWithCommas(totalShares),
            totalSharesTotal: numberWithCommas(totalSharesTotal),
        });
    }, [data]);

    return (
        <div className="mb-3 rounded-lg bg-white shadow-card flex ">
            <span
                className={`py-3 text-sm tracking-wider font-bold w-2/12 pl-6`}
            >
                {submissionInfo?.shareholdersTotal || (
                    <CircularProgress size={18} />
                )}
            </span>
            <span className={`py-3 text-sm tracking-wider font-bold w-2/12`}>
                {submissionInfo?.totalShares || <CircularProgress size={18} />}
            </span>
            <span className={`py-3 text-sm tracking-wider font-bold w-2/12`}>
                {submissionInfo?.totalSharesTotal || (
                    <CircularProgress size={18} />
                )}
            </span>
        </div>
    );
}

export default SubmissionInfo;
