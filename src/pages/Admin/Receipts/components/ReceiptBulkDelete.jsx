import { Button } from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import { useReceiptBulkDelete } from "../../../../hooks/useReceipt";
import { toast } from "react-toastify";

function ReceiptBulkDelete({
    bulkDeleteOn,
    setBulkDeleteOn,
    setBulkDeleteList,
    bulkDeleteList,
}) {
    const bulkDelete = useReceiptBulkDelete();

    const handleTurnOffBulkDelete = () => {
        setBulkDeleteOn(false);
        setBulkDeleteList([]);
    };

    const handleBulkDelete = () => {
        if (
            bulkDeleteList.length &&
            window.confirm(
                `${transl("do you really want to delete these items?")}}`
            )
        ) {
            bulkDelete.mutate(
                {
                    userIds: bulkDeleteList,
                },
                {
                    onSuccess: async (data) => {
                        toast.success(transl("deleted with success"), {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        handleTurnOffBulkDelete();
                    },
                }
            );
        }
    };

    if (bulkDeleteOn) {
        return (
            <div className="flex items-center gap-3 mb-4">
                <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={handleBulkDelete}
                >
                    {transl("delete")}
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                        handleTurnOffBulkDelete();
                    }}
                >
                    {transl("cancel")}
                </Button>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <Button size="small" onClick={() => setBulkDeleteOn(true)}>
                {transl("select items to delete")}
            </Button>
        </div>
    );
}

export default ReceiptBulkDelete;
