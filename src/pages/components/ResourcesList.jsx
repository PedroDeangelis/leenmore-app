import React, { useEffect, useState } from "react";
import { useResourceDelete, useResources } from "../../hooks/useResource";
import {
    Button,
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
} from "@mui/material";
import transl from "./translate";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import ResourcesListItem from "./ResourcesListItem";
import ResourcesOrganizer from "../Admin/ProjectResources/components/ResourcesOrganizer";

function ResourcesList({ projectID, deleteOption }) {
    const { data: resources, isLoading } = useResources(projectID, "project");
    const deleteResourceMutation = useResourceDelete();
    const [searching, setSearching] = useState("");
    const [resourcesFiltered, setResourcesFiltered] = useState([]);
    const [isOrganizing, setIsOrganizing] = useState(false);

    const handleDelete = (id) => {
        if (
            window.confirm(
                transl("Are you sure you want to delete this resource?")
            )
        ) {
            deleteResourceMutation.mutate(
                {
                    resource_id: id,
                },
                {
                    onSuccess: (data) => {
                        toast.success(transl("deleted  successfully"), {
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
        }
    };

    useEffect(() => {
        if (resources) {
            const filtered = resources.filter((resource) => {
                return resource.title
                    .toLowerCase()
                    .includes(searching.toLowerCase());
            });
            setResourcesFiltered(filtered);
        }
    }, [searching, resources]);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (!resources) {
        return <p>{transl("No resources found")}</p>;
    }

    if (isOrganizing) {
        return (
            <ResourcesOrganizer
                resources={resources}
                setIsOrganizing={setIsOrganizing}
            />
        );
    }

    return (
        <div>
            {deleteOption && (
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    onClick={() => setIsOrganizing(true)}
                >
                    {transl("Organize resources")}
                </Button>
            )}
            <Paper className="p-2 mb-6" elevation={0}>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-adornment-seacrh">
                        {transl("Search")}...
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-seacrh"
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        aria-describedby="outlined-seacrh-helper-text"
                        label={`${transl("Search")}...`}
                        value={searching}
                        onChange={(e) => setSearching(e.target.value)}
                    />
                </FormControl>
            </Paper>

            {resourcesFiltered.map((resource) => (
                <ResourcesListItem
                    key={resource.id}
                    resource={resource}
                    handleDelete={handleDelete}
                    deleteOption={deleteOption}
                />
            ))}
        </div>
    );
}

export default ResourcesList;
