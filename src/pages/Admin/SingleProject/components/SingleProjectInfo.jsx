import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import transl from "../../../components/translate";
import DataDisplay from "../../components/DataDisplay";
import DownloadCSV from "./DownloadCSV";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    useDownloadZipFolder,
    useSelectDownloadFolder,
} from "../../../../hooks/useFileUpload";
import { toast } from "react-toastify";
import SelectFolderDialog from "./SelectFolderDialog";
import EditIcon from "@mui/icons-material/Edit";
import EditProjectTitlenDate from "./EditProjectTitlenDate";
import ProjectMessageEditing from "./ProjectMessageEditing";

function SingleProjectInfo({
    title,
    startDate,
    endDate,
    project,
    hasSubmission,
}) {
    const downloadZipFolderMutation = useDownloadZipFolder();
    const checkDownloadFolder = useSelectDownloadFolder();
    const [downloadPATH, setDownloadPATH] = useState("");
    const [openSelectFolder, setOpenSelectFolder] = useState(false);
    const [folderDownloadOptions, setFolderDownloadOptions] = useState([]);
    const [isEditProject, setIsEditProject] = useState(false);
    const [daysLeft, setDaysLeft] = useState("none");
    const [daysLeftClassName, setDaysLeftClassName] = useState("");

    const handleDownload = (folder) => {
        downloadZipFolderMutation.mutate(
            {
                project_id: project.id,
                folder: folder,
            },
            {
                onSuccess: (data) => {
                    if (data) {
                        setDownloadPATH(
                            `${process.env.REACT_APP_STORAGE_PATH}${data}`
                        );
                    } else {
                        toast.warn(
                            transl("There is no files for this project"),
                            {
                                position: "top-right",
                                autoClose: 4000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            }
                        );
                    }
                },
            }
        );
    };

    const selectFolderToDownload = () => {
        checkDownloadFolder.mutate(
            {
                project_id: project.id,
            },
            {
                onSuccess: (data) => {
                    setFolderDownloadOptions(data);
                    setOpenSelectFolder(true);
                },
            }
        );
    };

    useEffect(() => {
        if (endDate) {
            //endDate = 2023-03-26 00:00:00+00;
            const days = moment(endDate).diff(moment(), "days") + 1;

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
    }, [startDate, endDate]);

    return (
        <>
            <div className="mb-6 grid grid-cols-5 gap-4 items-center">
                <ProjectMessageEditing
                    message={project.message}
                    projectID={project.id}
                />
                <div
                    className={`text-left font-bold   rounded-lg ${daysLeftClassName}`}
                >
                    {daysLeft !== "none" && (
                        <>
                            <span className="mr-4">
                                주총일({moment(endDate).format("MM/DD")}
                                )이주총일
                            </span>
                            {daysLeft}
                        </>
                    )}
                </div>
            </div>
            <div className="mb-4 grid grid-cols-5 gap-4 ">
                <Card className="col-span-2">
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <DataDisplay label={transl("Start Date")}>
                                {startDate
                                    ? moment(startDate).format("YYYY/MM/DD")
                                    : transl("Not Set")}
                            </DataDisplay>
                            <DataDisplay label={transl("End Date")}>
                                {endDate
                                    ? moment(endDate).format("YYYY/MM/DD")
                                    : transl("Not Set")}
                            </DataDisplay>
                            <p className="text-right">
                                <Button
                                    onClick={() =>
                                        setIsEditProject(!isEditProject)
                                    }
                                >
                                    <EditIcon />
                                    {transl("edit project")}
                                </Button>
                            </p>
                        </div>
                        {isEditProject && (
                            <EditProjectTitlenDate
                                projectTitle={title}
                                projectID={project.id}
                                setIsEditProject={setIsEditProject}
                                startDateVal={
                                    startDate
                                        ? moment(startDate).format("Y-MM-DD")
                                        : moment().format("Y-MM-DD")
                                }
                                endDateVal={
                                    endDate
                                        ? moment(endDate).format("Y-MM-DD")
                                        : moment()
                                              .add(10, "days")
                                              .format("Y-MM-DD")
                                }
                            />
                        )}
                    </CardContent>
                </Card>
                <Card className="flex items-center text-center justify-center">
                    {downloadZipFolderMutation.isLoading ? (
                        <>
                            <CircularProgress />
                            <p className="font-bold text-stone-500 text-xs">
                                {transl(
                                    "Please Wait, it may take few minutes."
                                )}
                            </p>
                        </>
                    ) : (
                        <>
                            {downloadPATH ? (
                                <a href={downloadPATH} download>
                                    <Button>
                                        <FileDownloadIcon />
                                        {transl("Download Files")}
                                    </Button>
                                </a>
                            ) : (
                                <Button onClick={selectFolderToDownload}>
                                    <FileDownloadIcon />
                                    {transl("Select Folder")}
                                </Button>
                            )}
                        </>
                    )}
                </Card>
                <Card className="flex items-center text-center justify-center">
                    <DownloadCSV project={project} />
                </Card>
                <Card className="flex items-center text-center justify-center">
                    {hasSubmission ? (
                        <Link
                            to={`/dashboard/submission/project/${project.id}`}
                        >
                            <Button>
                                {transl("Check Project Submissions")}
                            </Button>
                        </Link>
                    ) : (
                        <p className="font-bold text-stone-500">
                            {transl("This Project has no submissions yet.")}
                        </p>
                    )}
                </Card>
                <SelectFolderDialog
                    open={openSelectFolder}
                    handleClose={() => {
                        setOpenSelectFolder(false);
                    }}
                    folders={folderDownloadOptions}
                    handleDownload={handleDownload}
                />
            </div>
        </>
    );
}

export default SingleProjectInfo;
