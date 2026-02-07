import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useResourceUpdate } from "../../hooks/useResource";
import { toast } from "react-toastify";
import transl from "./translate";

function ResourcesListLinkItem({ resource, handleDelete, deleteOption }) {
    const [isEditing, setIsEditing] = useState(false);
    const resourceUpdateMutation = useResourceUpdate();
    const [title, setTitle] = useState(resource.title || "");
    const [link, setLink] = useState(resource.url || resource.path || "");

    const normalizeUrl = (value) => {
        const trimmed = value.trim();
        if (!trimmed) {
            return "";
        }
        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }
        return `https://${trimmed}`;
    };

    const resourceUrl = normalizeUrl(link || "");

    const handleSave = () => {
        const normalizedLink = normalizeUrl(link);
        const titleValue = title.trim();

        if (!titleValue || !normalizedLink) {
            toast.error(transl("please fill all fields"), {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (
            resource.title === titleValue &&
            (resource.url || resource.path || "") === normalizedLink
        ) {
            setIsEditing(false);
            return;
        }

        resourceUpdateMutation.mutate(
            {
                resource: {
                    id: resource.id,
                },
                meta: {
                    title: titleValue,
                    path: normalizedLink,
                },
            },
            {
                onSuccess: () => {
                    toast.success(transl("updated with success"), {
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
            },
        );
    };

    return (
        <div className="p-4 rounded-md shadow-md hover:shadow-lg bg-white mb-3 flex items-center justify-between relative">
            <div className="w-full">
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <TextField
                            label={transl("content")}
                            variant="outlined"
                            size="small"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label={transl("website address")}
                            variant="outlined"
                            size="small"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <p>{resource.title}</p>
                        {resourceUrl && (
                            <p className="text-xs text-gray-500 break-all">
                                {resourceUrl}
                            </p>
                        )}
                    </div>
                )}
            </div>
            {deleteOption ? (
                <div className="flex flex-shrink-0 ml-5 gap-1">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            if (resourceUrl) {
                                window.open(resourceUrl, "_blank");
                            }
                        }}
                    >
                        {transl("View link")}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        disabled={resourceUpdateMutation.isLoading}
                        onClick={() => {
                            if (isEditing) {
                                handleSave();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                    >
                        {isEditing ? transl("Save") : transl("Edit")}
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            handleDelete(resource.id);
                        }}
                    >
                        {transl("Delete")}
                    </Button>
                </div>
            ) : (
                <>
                    <Button
                        sx={{ flexShrink: 0 }}
                        variant="contained"
                        size="small"
                    >
                        {transl("View link")}
                    </Button>

                    <div
                        style={{ width: "100%" }}
                        className="h-full absolute top-0 left-0"
                        onClick={() => {
                            if (resourceUrl) {
                                window.open(resourceUrl, "_blank");
                            }
                        }}
                    ></div>
                </>
            )}
        </div>
    );
}

export default ResourcesListLinkItem;
