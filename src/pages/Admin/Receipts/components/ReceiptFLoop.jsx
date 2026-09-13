import React, { useEffect, useState } from "react";
import ReceiptFLoopItem from "./ReceiptFLoopItem";
import transl from "../../../components/translate";
import getOrganizedBills from "../../../Worker/ReceiptArchive/components/getOrganizedBills";

// The cards are users, so sorting happens after grouping. The totals come from
// getOrganizedBills — the same helper ReceiptFLoopItem displays from — so the
// order always agrees with the numbers on screen.
const sortUserGroups = (groups, sortBy, sortDirection) => {
    if (sortBy === "default") {
        return groups;
    }

    // getOrganizedBills walks every receipt, so key each group once up front
    // rather than recomputing inside the comparator.
    const keyed = groups.map((group) => ({
        group,
        total_amount: getOrganizedBills(group.receipts).total,
        total_submissions: group.receipts.length,
    }));

    keyed.sort((itemA, itemB) => {
        const comparison =
            sortBy === "user_name"
                ? String(itemA.group.user_name ?? "").localeCompare(
                      String(itemB.group.user_name ?? ""),
                  )
                : itemA[sortBy] - itemB[sortBy];

        return sortDirection === "asc" ? comparison : -comparison;
    });

    return keyed.map((item) => item.group);
};

function ReceiptFLoop({
    receipts,
    bulkDeleteOn,
    bulkDeleteList,
    setBulkDeleteList,
    sortBy,
    sortDirection,
}) {
    // Starts empty rather than at the ungrouped receipts prop, which used to
    // render one frame of cards missing their user name and totals.
    const [organizedReceipts, setOrganizedReceipts] = useState([]);

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

        setOrganizedReceipts(
            sortUserGroups(tempReceipts, sortBy, sortDirection),
        );
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
    }, [receipts, sortBy, sortDirection]);

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
