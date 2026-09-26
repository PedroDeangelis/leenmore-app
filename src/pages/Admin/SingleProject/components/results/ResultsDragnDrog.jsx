import { Button, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useProjecUpdate } from "../../../../../hooks/useProject";
import transl from "../../../../components/translate";
import {
    parseProjectResults,
    serializeProjectResults,
    sortResultsForDisplay,
} from "../../../../components/projectResults";
import ResultsDragnDragItem from "./ResultsDragnDragItem";

function ResultsDragnDrog({ results, setIsOrderning, project }) {
    const [displayOrder, setDisplayOrder] = useState([]);
    const updateProjectMutation = useProjecUpdate();

    useEffect(() => {
        // Seed from display order. Each entry keeps its immutable physicalIndex.
        setDisplayOrder(sortResultsForDisplay(parseProjectResults(results)));
    }, [results]);

    const onDragEnd = ({ source, destination }) => {
        if (!destination || destination.index === source.index) return;

        // Reorder the DISPLAY list positionally. No name lookups and no
        // arithmetic on `order` — it is recomputed from scratch on save.
        setDisplayOrder((prev) => {
            const next = [...prev];
            const [moved] = next.splice(source.index, 1);
            next.splice(destination.index, 0, moved);
            return next;
        });
    };

    const handleResultsSave = () => {
        // Assign a clean dense 0..n-1 `order` from final display position. This
        // also repairs projects that had duplicate or gapped order values.
        const withOrder = displayOrder.map((result, i) => ({
            ...result,
            order: i,
        }));

        // Restore PHYSICAL order before serializing. The array layout is never
        // permuted, so every submission.result pointer stays valid.
        const inPhysicalOrder = [...withOrder].sort(
            (a, b) => a.physicalIndex - b.physicalIndex,
        );

        updateProjectMutation.mutate(
            {
                project_id: project.id,
                meta: {
                    results: serializeProjectResults(inPhysicalOrder),
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
                                {displayOrder.map((result, index) => (
                                    <Draggable
                                        // Key by immutable identity: names are
                                        // editable and can be duplicated.
                                        key={result.physicalIndex}
                                        draggableId={String(
                                            result.physicalIndex
                                        )}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                            >
                                                <ResultsDragnDragItem
                                                    result={result}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
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
