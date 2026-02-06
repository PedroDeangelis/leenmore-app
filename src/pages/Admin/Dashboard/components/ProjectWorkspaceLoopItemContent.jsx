import { CircularProgress } from "@mui/material";
import { rgba } from "polished";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSingleProjectWithShareholders } from "../../../../hooks/useProject";
import getPercentageRateForShareholder from "../../components/getPercentageRateForShareholder";
import transl from "../../../components/translate";

function ProjectWorkspaceLoopItemContent({ project_id }) {
    const [resultsRate, setResultsRate] = useState([]);

    const { data: project, isLoading } =
        useSingleProjectWithShareholders(project_id);

    useEffect(() => {
        if (project) {
            const newRate = getPercentageRateForShareholder(
                project.shareholder,
                project.results,
                Number(project.shares_target.replace(/,/g, ""))
            );

            if (newRate) {
                setResultsRate({ commit_timestamp: Date.now(), ...newRate });
            }
        }
    }, [project]);

    return (
        <div className="overflow-hidden transition-all">
            {!isLoading ? (
                <>
                    <div className="flex justify-between items-end px-7 mb-4 max-w-lg">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                {transl("total number of shares issued")}:
                            </p>

                            <p className="font-medium">
                                {project.shares_issued}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                {transl("target number of shares")}:
                            </p>

                            <p className="font-medium">
                                {project.shares_target}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 text-sm text-gray-500 px-4 mb-2">
                        <p className="col-span-2">{transl("Result")}</p>
                        <p className="text-center">
                            {transl("number of shares")}
                        </p>
                        <p className="text-center">{transl("Percentage")}</p>
                        <p className="text-center">{transl("Type total")}</p>
                        <p className="text-center">
                            {transl("Type Percentage")}
                        </p>
                    </div>
                    {resultsRate?.results?.map((result) => (
                        <div
                            style={{
                                backgroundColor: rgba(
                                    `${result.colorHex}`,
                                    0.4
                                ),
                            }}
                            className="grid grid-cols-6 text-sm text-gray-700 py-2 px-4 font-medium items-center"
                            key={result.result}
                        >
                            <p className="col-span-2 uppercase text-black ">
                                <Link
                                    to={`/dashboard/submission/project/${project.id}?result=${result.result}`}
                                >
                                    {result.name}
                                </Link>
                            </p>
                            <p className="text-center">{result.total}</p>
                            <p className="text-center">{result.percentage}%</p>

                            {resultsRate.colorTotal.hasOwnProperty(
                                result.color
                            ) &&
                                resultsRate.colorTotal[result.color][
                                    "result"
                                ] == result.result && (
                                    <>
                                        <p className="text-center ">
                                            {
                                                resultsRate.colorTotal[
                                                    result.color
                                                ]["total"]
                                            }
                                        </p>
                                        <p className="text-center ">
                                            {resultsRate.colorTotal[
                                                result.color
                                            ]["percentage"].toFixed(2)}
                                            %
                                        </p>
                                    </>
                                )}
                        </div>
                    ))}
                </>
            ) : (
                <div className="flex justify-center items-center pb-4">
                    <CircularProgress />
                </div>
            )}
        </div>
    );
}

export default ProjectWorkspaceLoopItemContent;
