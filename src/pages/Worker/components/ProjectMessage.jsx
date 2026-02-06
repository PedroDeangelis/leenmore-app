import React from "react";
import CampaignIcon from "@mui/icons-material/Campaign";

function ProjectMessage({ message }) {
    if (!message) {
        return null;
    }

    return (
        <p className="text-center text-red-900 font-bold flex items-center justify-center mb-4">
            <CampaignIcon sx={{ mr: 1 }} />
            <span>{message}</span>
        </p>
    );
}

export default ProjectMessage;
