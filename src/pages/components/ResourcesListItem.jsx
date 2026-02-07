import { Button } from "@mui/material";
import React, { useState } from "react";
import transl from "./translate";
import DownloadIcon from "@mui/icons-material/Download";
import { useResourceUpdate } from "../../hooks/useResource";
import { toast } from "react-toastify";

function ResourcesListItem({ resource, handleDelete, deleteOption }) {
    const [isEditing, setIsEditing] = useState(false);
    const resourceUpdateMutation = useResourceUpdate();
    const [title, setTitle] = useState(resource.title);

    const getResourcePath = (resource) => resource?.url || resource?.path || "";
    const isExternalLink = (value) => /^https?:\/\//i.test(value);
    const getResourceUrl = (resource) => {
        const rawPath = getResourcePath(resource);
        if (!rawPath) {
            return "";
        }
        if (isExternalLink(rawPath)) {
            return rawPath;
        }
        const storagePath = process.env.REACT_APP_STORAGE_PATH || "";
        return `${storagePath}${rawPath}`;
    };

    const resourceUrl = getResourceUrl(resource);

    const handleSave = (resource) => {
        if (!title) {
            toast.error(transl("title is required"), {
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

        if (resource.title === title) {
            setIsEditing(false);
            return;
        }

        resourceUpdateMutation.mutate(
            {
                resource: {
                    id: resource.id,
                },
                meta: {
                    title: title,
                },
            },
            {
                onSuccess: (data) => {
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
            }
        );
    };

    const handleDownload = (resource) => {
        const rawPath = getResourcePath(resource);
        if (!rawPath) {
            return;
        }

        if (isExternalLink(rawPath)) {
            window.open(rawPath, "_blank");
            return;
        }

        fetch(resourceUrl)
            .then((response) => response.blob())
            .then((blob) => {
                saveAs(blob, resource.title);
            });
    };

    const saveAs = (blob, filename) => {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const a = document.createElement("a");
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 0);
        }
    };

    return (
        <div
            key={resource.id}
            className=" p-4 rounded-md shadow-md hover:shadow-lg  bg-white mb-3 flex items-center justify-between relative"
        >
            {isEditing ? (
                <input
                    type="text"
                    defaultValue={title}
                    className="border-2 border-gray-300 rounded-md p-1 w-full"
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
            ) : (
                <p>{resource.title}</p>
            )}
            <div className="flex flex-shrink-0 ml-5 gap-1 ">
                <Button
                    sx={{ padding: 0, minWidth: 0 }}
                    onClick={() => {
                        handleDownload(resource);
                    }}
                >
                    <DownloadIcon />
                </Button>
                {!deleteOption && (
                    <div
                        style={{ width: "calc(100% - 60px)" }}
                        className="h-full absolute top-0 left-0"
                        onClick={() => {
                            window.open(
                                resourceUrl,
                                "_blank"
                            );
                        }}
                    ></div>
                )}
                {deleteOption && (
                    <>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                window.open(
                                    resourceUrl,
                                    "_blank"
                                );
                            }}
                        >
                            {transl("View resource")}
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                if (isEditing) {
                                    handleSave(resource);
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
                    </>
                )}
            </div>
        </div>
    );
}

export default ResourcesListItem;
