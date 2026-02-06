import React from "react";
import transl from "../../../components/translate";
import SubmissionHistoric from "./SubmissionHistoric";
import { Button } from "@mui/material";
import { copyToClipboard } from "../../../components/copyToClipboard";
import { openInMaps } from "../../../components/openInMaps";

function ShareholderInfo({
    shares,
    shares_total,
    address,
    contact_info,
    contact_worker,
    submissions,
    resultsList,
    database,
}) {
    return (
        <div>
            <div className="flex items-center justify-between mt-4 mb-4">
                <div className="flex items-center">
                    <p className="">
                        <span className="text-xs block text-slate-500">
                            {transl("Shares")}
                        </span>
                        {shares}
                    </p>
                </div>
                <p className="">
                    <span className="text-xs block text-slate-500">
                        {transl("Total Shares")}
                    </span>
                    {shares_total}
                </p>
            </div>
            <p className=" mb-4">
                <span className="text-xs block text-slate-500">
                    {transl("Address")}
                </span>
                {address}
            </p>
            <div className="mt-2 mb-4 flex justify-between">
                <Button
                    onClick={(event) => {
                        event.stopPropagation();
                        copyToClipboard(address);
                    }}
                    variant="outlined"
                    size="small"
                >
                    {transl("Copy Address")}
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={(event) => {
                        event.stopPropagation();
                        openInMaps(address);
                    }}
                >
                    {transl("Open in Naver Maps")}
                </Button>
            </div>
            {contact_info && (
                <p className="mb-4">
                    <span className="text-xs block text-slate-500">
                        {transl("Contact Info")}
                    </span>
                    {contact_info}
                </p>
            )}
            {contact_worker && (
                <p className="mb-4">
                    <span className="text-xs block text-slate-500">
                        {transl("Contact for Worker")}
                    </span>
                    {contact_worker}
                </p>
            )}
            {database && (
                <p className="mb-4">
                    <span className="text-xs block text-slate-500">
                        {transl("database")}
                    </span>
                    {database}
                </p>
            )}
            {submissions && (
                <SubmissionHistoric
                    submissions={submissions}
                    resultsList={resultsList}
                    isAdmin={false}
                />
            )}
        </div>
    );
}

export default ShareholderInfo;
