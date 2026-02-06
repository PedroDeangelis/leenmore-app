import { Button, Card, CircularProgress } from "@mui/material";
import { rgba } from "polished";
import React, { useEffect, useRef, useState } from "react";
import transl from "../../../components/translate";
import getPercentageRateForShareholder from "../../components/getPercentageRateForShareholder";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSingleProjectWithShareholders } from "../../../../hooks/useProject";
import ProjectWorkspaceLoopItemContent from "./ProjectWorkspaceLoopItemContent";

function ProjectWorkspaceLoopItem({ project }) {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const accordionContentRef = useRef(null);
    const [daysLeft, setDaysLeft] = useState("none");
    const [daysLeftClassName, setDaysLeftClassName] = useState("");

    useEffect(() => {
        if (project?.end_date) {
            //endDate = 2023-03-26 00:00:00+00;
            const days = moment(project.end_date).diff(moment(), "days") + 1;

            if (days > 0) {
                setDaysLeft(`${days} ${transl("days left")}`);

                setDaysLeftClassName("text-blue-800 font-bold");
            } else if (days > -5) {
                setDaysLeft(transl("expired end date"));
                setDaysLeftClassName("text-sm font-bold");
            } else {
                setDaysLeft(transl("expired end date"));
                setDaysLeftClassName("text-gray-400  text-sm");
            }
        }
    }, [project]);

    return (
        <>
            <Card className="col-span-2">
                <div className="">
                    <div
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        className="flex items-center justify-between  cursor-pointer p-4"
                    >
                        <p className="text-base font-medium uppercase ">
                            {project.title}
                        </p>
                        <div className="flex items-center">
                            <div className={` mr-6 ${daysLeftClassName} `}>
                                {project.start_date && (
                                    <>
                                        <span className="mr-4">
                                            주총일(
                                            {moment(project.end_date).format(
                                                "MM/DD"
                                            )}
                                            )이
                                        </span>
                                        {daysLeft}
                                    </>
                                )}
                            </div>
                            <Button>
                                <Link to={`/dashboard/project/${project.id}`}>
                                    {transl("Go to project")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
                {isAccordionOpen && (
                    <ProjectWorkspaceLoopItemContent project_id={project.id} />
                )}
            </Card>
        </>
    );
}

export default ProjectWorkspaceLoopItem;
