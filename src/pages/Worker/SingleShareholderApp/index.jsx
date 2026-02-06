import { CircularProgress } from "@mui/material";
import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";
import { useShareholderFromWorker } from "../../../hooks/useShareholder";
import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";
import AppContent from "../components/AppContent";
import AppHeader from "../components/AppHeader";
import ShareholderInfo from "./components/ShareholderInfo";
import ShareholderInfoHeader from "./components/ShareholderInfoHeader";
import SubmissionForm from "./SubmissionForm/SubmissionForm";
import ProjectMessage from "../components/ProjectMessage";
import { useProject } from "../../../hooks/useProject";

function SingleShareholderApp() {
    const { id, project_id } = useParams();
    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);
    const { data: shareholder, isLoading } = useShareholderFromWorker(
        id,
        usermeta.first_name
    );

    const { data: project, isLoading: isProjectLoading } =
        useProject(project_id);

    return (
        <div>
            <AppHeader projectID={project_id}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <ShareholderInfoHeader
                        project_id={shareholder.project_id}
                        name={shareholder.name}
                        sex={shareholder.sex}
                        id={shareholder.id}
                        date_of_birth_code={shareholder.date_of_birth_code}
                    />
                )}
            </AppHeader>
            <AppContent>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {!isProjectLoading && (
                            <ProjectMessage message={project.message} />
                        )}
                        <ShareholderInfo
                            shares={shareholder.shares}
                            sex={shareholder.sex}
                            shares_total={shareholder.shares_total}
                            contact_info={shareholder.contact_info}
                            contact_worker={shareholder.contact_worker}
                            database={shareholder.database}
                            address={shareholder.address}
                            date_of_birth_code={shareholder.date_of_birth_code}
                            submissions={shareholder?.submission}
                            resultsList={shareholder?.project.results}
                        />
                        <SubmissionForm
                            project_id={shareholder.project_id}
                            filename={`${shareholder.name}${shareholder.date_of_birth_code}`}
                            user={usermeta.first_name}
                            user_id={usermeta.id}
                            shareholder={shareholder}
                            date={moment().format("YYYYMMDD")}
                        />
                    </>
                )}
            </AppContent>
        </div>
    );
}

export default SingleShareholderApp;
