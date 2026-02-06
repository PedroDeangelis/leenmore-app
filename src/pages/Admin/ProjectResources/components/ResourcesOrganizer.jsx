import React, { useState } from "react";
import transl from "../../../components/translate";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Avatar, Button } from "@mui/material";
import { useMultiResourcesUpdate } from "../../../../hooks/useResource";

function ResourcesOrganizer({ resources, setIsOrganizing }) {
    const [organizedResources, setOrganizedResources] = useState(resources);
    const updateResourcesMutation = useMultiResourcesUpdate();

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        var newItems = Array.from(organizedResources);
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);

        // Update the order property if necessary
        newItems = newItems.map((item, i) => ({ ...item, order: i }));

        // Update the state with the new order
        setOrganizedResources(newItems);
    };

    const handleSave = () => {
        updateResourcesMutation.mutate(
            {
                resources: organizedResources,
            },
            {
                onSuccess: (data) => {
                    setIsOrganizing(false);
                },
            }
        );
    };

    return (
        <div>
            <div className="flex items-end justify-between mb-4">
                <p className="">
                    {transl("Drag and Drop to change resources position")}
                </p>
                <div>
                    <Button
                        variant="text"
                        size="small"
                        sx={{ mr: 2 }}
                        onClick={() => {
                            setIsOrganizing(false);
                        }}
                    >
                        {transl("Cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            handleSave();
                        }}
                    >
                        {transl("save")}
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="item-list">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {organizedResources.map((resource, index) => {
                                return (
                                    <Draggable
                                        key={resource.id}
                                        draggableId={resource.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                            >
                                                <div
                                                    key={resource.id}
                                                    className=" p-4 rounded-md shadow-md hover:shadow-lg  bg-white mb-3 flex items-center justify-start relative"
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                        }}
                                                    >
                                                        <p className="text-sm">
                                                            {index}
                                                        </p>
                                                    </Avatar>
                                                    <p className="ml-2">
                                                        {resource.title}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder} {/* Add this line */}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default ResourcesOrganizer;
