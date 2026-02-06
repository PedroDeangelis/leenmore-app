import React, { useState } from "react";
import transl from "../../../components/translate";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import { useProjecUpdate } from "../../../../hooks/useProject";
import { toast } from "react-toastify";

function ProjectTitle({ title, status, project_id }) {
    const [isEditing, setIsEditing] = useState(false);
    const updateProjectMutation = useProjecUpdate();

    const handleEdit = () => {
        setIsEditing(title);
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const saveEdit = () => {
        updateProjectMutation.mutate(
            {
                project_id: project_id,
                meta: { title: isEditing },
            },
            {
                onSuccess: () => {
                    toast.success(transl("Project updated with success"), {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setIsEditing(false);
                },
            }
        );
    };

    if (isEditing)
        return (
            <div>
                <input
                    type="text"
                    value={isEditing}
                    onChange={(e) => setIsEditing(e.target.value)}
                    className="border rounded border-gray-300 text-base px-2 py-3"
                    style={{ minWidth: "425px" }}
                />
                <IconButton color="primary" size="small" onClick={saveEdit}>
                    <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton color="primary" size="small" onClick={cancelEdit}>
                    <ClearIcon fontSize="small" />
                </IconButton>
            </div>
        );

    return (
        <div>
            {title}

            <IconButton color="primary" size="small" onClick={handleEdit}>
                <EditIcon fontSize="small" />
            </IconButton>
            <span className="ml-2 text-sm">({transl(status)})</span>
        </div>
    );
}

export default ProjectTitle;
