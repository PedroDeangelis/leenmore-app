import { Button, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useProjecUpdate } from "../../../../../hooks/useProject";
import transl from "../../../../components/translate";
import ResultsDragnDragItem from "./ResultsDragnDragItem";

function ResultsDragnDrog({ results, setIsOrderning, project }) {
    const [resultsTemp, setResultsTemp] = useState([]);
    const updateProjectMutation = useProjecUpdate();

    const handleResultsSave = () => {
        updateProjectMutation.mutate(
            {
                project_id: project.id,
                meta: {
                    results: resultsTemp,
                },
            },
            {
                onSuccess: () => {
                    setIsOrderning(false);

                    toast.success(transl("Project Updated Successfully"), {
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
    const handleCancel = () => {
        setIsOrderning(false);
    };

    const onDragEnd = (result) => {
        const { draggableId, source, destination } = result;

        var newItems = JSON.parse(JSON.stringify(resultsTemp));
        if (!destination) {
            return newItems;
        }

        // // Update the 'order' property based on the movement
        newItems = newItems.map((item, index) => {
            if (source.index < destination.index) {
                // Moving down in the list
                if (
                    item.order > source.index &&
                    item.order <= destination.index
                ) {
                    item.order--;
                }
            } else if (source.index > destination.index) {
                // Moving up in the list
                if (
                    item.order >= destination.index &&
                    item.order < source.index
                ) {
                    item.order++;
                }
            }
            return item;
        });

        // Update the destination object with the new order value
        newItems.find((item) => item.name === draggableId).order =
            destination.index;

        setResultsTemp(newItems);
    };

    useEffect(() => {
        const newResult = results.map((value, i) => {
            let result = JSON.parse(value);

            if (result?.order === undefined) {
                result = { ...result, order: i };
            }

            return result;
        });

        setResultsTemp(newResult);
    }, [results]);

    return (
        <Card>
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xl">{transl("Results order")}</p>
                    <div className="flex items-center">
                        <Button
                            size="small"
                            variant="outlined"
                            sx={{ marginLeft: "10px" }}
                            onClick={handleCancel}
                        >
                            {transl("cancel updates")}
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ marginLeft: "10px" }}
                            onClick={handleResultsSave}
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
                                {resultsTemp &&
                                    resultsTemp.length > 0 &&
                                    Array.from(resultsTemp)
                                        .sort((a, b) => a?.order - b?.order)

                                        .map((result, index) => {
                                            return (
                                                <Draggable
                                                    key={result.name}
                                                    draggableId={result.name.toString()}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                        >
                                                            <ResultsDragnDragItem
                                                                result={result}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardContent>
        </Card>
    );
}

export default ResultsDragnDrog;
