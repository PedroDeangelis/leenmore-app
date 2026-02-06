import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import { useOption, useOptionUpdate } from "../../../../hooks/useOptions";
import { Button, CircularProgress } from "@mui/material";
import UsageHistorySetupItem from "./UsageHistorySetupItem";
import { toast } from "react-toastify";

function UsageHistorySetup({ close }) {
    const { data: usageHistory, isLoading } = useOption(
        "usage_history_schema",
        "multivalue"
    );
    const [newUsageHistory, setNewUsageHistory] = useState("");
    const updateOption = useOptionUpdate();

    const handleAddNewItem = () => {
        let arr = newUsageHistory;

        if (!arr) {
            arr = [];
        }

        setNewUsageHistory([...arr, ""]);
    };

    const handleSave = () => {
        let arr = newUsageHistory;

        if (!arr) {
            alert("Please add at least one item to the usage history");
            return;
        }

        // remove empty and duplicated items
        arr = arr.filter((item, index) => {
            return item && arr.indexOf(item) === index;
        });

        if (arr.length === 0) {
            alert("Please add at least one item to the usage history");
            return;
        }

        updateOption.mutate(
            {
                name: "usage_history_schema",
                value: arr,
                type: "multivalue",
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
                    close();
                },
            }
        );
    };

    const handleItemChange = (index, newValue) => {
        const updatedHistory = newUsageHistory.map((item, idx) => {
            if (idx === index) {
                return newValue;
            }
            return item;
        });

        setNewUsageHistory(updatedHistory);
    };

    useEffect(() => {
        if (usageHistory) {
            setNewUsageHistory(usageHistory);
            console.log("usageHistory", usageHistory);
        }
    }, [usageHistory]);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div className="bg-slate-200 p-4 rounded mb-4">
            <div className="flex justify-between items-center mb-6">
                <p className="text-center text-lg text-slate-500 ">
                    {transl("edit usage history details")}
                </p>
                <Button variant="outlined" color="primary" onClick={handleSave}>
                    {transl("save")}
                </Button>
            </div>
            {newUsageHistory &&
                newUsageHistory.map((item, index) => (
                    <UsageHistorySetupItem
                        key={index}
                        item={item}
                        onItemChange={(newValue) =>
                            handleItemChange(index, newValue)
                        }
                    />
                ))}

            <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 3 }}
                className="w-full"
                onClick={handleAddNewItem}
            >
                {transl("add new usage history item")}
            </Button>
            <p className="text-center mt-4 text-slate-500 text-sm">
                {transl("leave the field empty to remove a usage history")}
            </p>
        </div>
    );
}

export default UsageHistorySetup;
