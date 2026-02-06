import { Button, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OChip from "../../../components/OChip";
import transl from "../../../components/translate";
import getShareholderSex from "../../components/getShareholderSex";
import { copyToClipboard } from "../../../components/copyToClipboard";
import { openInMaps } from "../../../components/openInMaps";

function ProjectLoopItem({
    name,
    sex,
    date_of_birth_code,
    shares,
    shares_total,
    contact_info,
    project_id,
    id,
    result,
    projectResult,
    address,
    contact_worker,
    eletronic_voting,
}) {
    const [resultJson, setResultJson] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (result?.length) {
            setResultJson(JSON.parse(projectResult[result]));
        }
    }, []);

    return (
        <div
            onClick={() =>
                navigate(`/app/project/${project_id}/shareholder/${id}`)
            }
        >
            <Card sx={{ marginBottom: "14px" }}>
                <CardContent sx={{ position: "relative" }}>
                    {/* if has eletronic_voting  */}
                    {eletronic_voting && (
                        <p className="text-center mb-1 font-extrabold text-lg text-blue-700 md:absolute md:top-5 left-0 w-full">
                            (전자투표 완료)
                        </p>
                    )}
                    <div className="flex items-center justify-between">
                        <p className="font-bold">
                            {name}
                            <span className="text-slate-500 font-normal mx-2">
                                {date_of_birth_code}
                            </span>
                            {getShareholderSex(sex)}
                        </p>
                        <div>
                            {resultJson && (
                                <OChip color={resultJson.color}>
                                    {resultJson.name}
                                </OChip>
                            )}
                        </div>
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
                    </div>
                    {contact_info && (
                        <p className=" mt-4">
                            <span className="text-xs block text-slate-500">
                                {transl("Contact info")}
                            </span>
                            {contact_info}
                        </p>
                    )}
                    {contact_worker && (
                        <p className=" mt-4">
                            <span className="text-xs block text-slate-500">
                                {transl("Contact for worker")}
                            </span>
                            {contact_worker}
                        </p>
                    )}
                    {address && (
                        <>
                            <p className=" mt-4">
                                <span className="text-xs block text-slate-500">
                                    {transl("Address")}
                                </span>
                                {address}
                            </p>
                            <div className="mt-2 flex justify-between">
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
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default ProjectLoopItem;
