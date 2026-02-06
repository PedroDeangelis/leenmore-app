import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
} from "@mui/material";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProjectCreate } from "../../../hooks/useProject";
import transl from "../../components/translate";
import Header from "../components/Header";
import FormNewProject from "./components/FormNewProject";
import FormResultCreator from "./components/FormResultCreator";
import ShareholdersUpload from "./components/FormShareholdersUpload";

function AddNewProject() {
    const formTitleRef = useRef();
    const [startDate, setStartDate] = useState(moment().format("Y-MM-DD"));
    const [endDate, setEndDate] = useState(
        moment().add(10, "days").format("Y-MM-DD")
    );

    const sharesIssuedRef = useRef();
    const targetSharesRef = useRef();
    const [formResultsList, setFormResultsList] = useState([]);
    const [formError, setFormError] = useState([]);
    const [shareholderList, setShareholderList] = useState(false);
    const [creatingProjectLoading, setcreatingProjectLoading] = useState(false);
    const createProjectMutation = useProjectCreate();
    const navigate = useNavigate();

    const createNewProject = (status) => {
        setcreatingProjectLoading(true);
        setFormError([]);

        let error = [];

        if (!formTitleRef.current.value?.length) {
            error.push(transl("Title is a required field."));
        }

        if (!sharesIssuedRef.current.value?.length) {
            error.push(transl("Shares Issued is a required field."));
        }

        if (!targetSharesRef.current.value?.length) {
            error.push(transl("Target Shares is a required field."));
        }

        if (!formResultsList?.length) {
            error.push(
                transl(
                    "Results is a required field, please add a result before create the project."
                )
            );
        }

        if (!shareholderList?.length) {
            error.push(
                transl(
                    "Shareholder List is a required field, please add import a CSV file."
                )
            );
        }

        if (error.length) {
            setFormError(error);
            setcreatingProjectLoading(false);
            return;
        }

        createProjectMutation.mutate(
            {
                title: formTitleRef.current.value,
                results: formResultsList,
                status: status,
                shareholders: shareholderList,
                shares_issued: sharesIssuedRef.current.value,
                shares_target: targetSharesRef.current.value,
                start_date: startDate,
                end_date: endDate,
            },
            {
                onSuccess: (data) => {
                    navigate(`/dashboard/project/${data.id}`);
                    toast.success(transl("Project created with success"), {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                },
            }
        );
    };

    return (
        <div>
            <Header title={transl("Add New Project")}>
                <div className="flex items-center">
                    <div className="mr-2">
                        {creatingProjectLoading ? (
                            <CircularProgress />
                        ) : (
                            <Button
                                onClick={() => {
                                    createNewProject("draft");
                                }}
                                variant="text"
                            >
                                {transl("Save as Draft")}
                            </Button>
                        )}
                    </div>
                    <>
                        {creatingProjectLoading ? (
                            <CircularProgress />
                        ) : (
                            <Button
                                onClick={() => {
                                    createNewProject("publish");
                                }}
                                variant="contained"
                            >
                                {transl("Publish New Project")}
                            </Button>
                        )}
                    </>
                </div>
            </Header>

            {formError?.length ? (
                <Card className="mb-4">
                    <CardContent>
                        <Alert severity="error">
                            <ul className="list-disc pl-7">
                                {formError.map((value, key) => (
                                    <li key={key} className="mb-1">
                                        {value}
                                    </li>
                                ))}
                            </ul>
                        </Alert>
                    </CardContent>
                </Card>
            ) : (
                ""
            )}
            <FormNewProject
                titleRef={formTitleRef}
                sharesIssuedRef={sharesIssuedRef}
                targetSharesRef={targetSharesRef}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />
            <FormResultCreator
                formResultsList={formResultsList}
                setFormResultsList={setFormResultsList}
            />
            <ShareholdersUpload
                shareholderList={shareholderList}
                setShareholderList={setShareholderList}
            />
        </div>
    );
}

export default AddNewProject;
