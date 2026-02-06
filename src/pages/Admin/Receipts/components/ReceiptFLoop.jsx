import React, { useEffect, useState } from "react";
import ReceiptFLoopItem from "./ReceiptFLoopItem";
import transl from "../../../components/translate";

function ReceiptFLoop({
    receipts,
    bulkDeleteOn,
    bulkDeleteList,
    setBulkDeleteList,
}) {
    const [organizedReceipts, setOrganizedReceipts] = useState(receipts);

    const organizeReceiptsByUser = (receipts) => {
        let tempReceipts = [];

        receipts.forEach((receipt) => {
            const userIndex = tempReceipts.findIndex(
                // match project and user id
                (tempReceipt) => {
                    return tempReceipt.user_id === receipt.user_id;
                }
            );

            if (userIndex === -1) {
                tempReceipts.push({
                    user_id: receipt.user_id,
                    user_name: receipt.user_name,
                    receipts: [receipt],
                });
            } else {
                tempReceipts[userIndex].receipts.push(receipt);
            }
        });

        setOrganizedReceipts(tempReceipts);
    };

    const setReceiptToDelete = (e, user_id) => {
        if (e.target.checked) {
            setBulkDeleteList([...bulkDeleteList, user_id]);
        } else {
            setBulkDeleteList(
                bulkDeleteList.filter((item) => item !== user_id)
            );
        }
    };

    useEffect(() => {
        if (receipts) {
            organizeReceiptsByUser(receipts);
        }
    }, [receipts]);

    return receipts?.length ? (
        <div className="">
            {organizedReceipts.map((receipt) => (
                <ReceiptFLoopItem
                    key={`${receipt.project_id}-${receipt.user_id}`}
                    project_id={receipt.project_id}
                    user_id={receipt.user_id}
                    userName={receipt.user_name}
                    projectTitle={receipt.projectTitle}
                    receipts={receipt.receipts}
                    bulkDeleteOn={bulkDeleteOn}
                    setReceiptToDelete={setReceiptToDelete}
                />
            ))}
        </div>
    ) : (
        <p className="text-center text-slate-400">
            {transl("No receipts found")}
        </p>
    );
}

export default ReceiptFLoop;
