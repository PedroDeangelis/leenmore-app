import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useProjectsSpecificUser } from "../../../../hooks/useProject";
import ProjectLoopListing from "./ProjectLoopListing";
import { useUser, useUserisLoggendIn } from "../../../../hooks/useUser";

function ProjectLoop() {
    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);
    const { data, isLoading } = useProjectsSpecificUser(usermeta.first_name);

    return (
        <>
            {isLoading ? (
                <div className="text-center">
                    <CircularProgress />
                </div>
            ) : (
                <ProjectLoopListing projects={data} />
            )}
        </>
    );
}

export default ProjectLoop;
