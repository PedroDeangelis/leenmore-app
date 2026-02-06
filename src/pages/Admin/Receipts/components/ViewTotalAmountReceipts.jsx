import React, { useEffect, useState } from "react";
import UsageHistoryBill from "./UsageHistoryBill";
import getOrganizedBills from "../../../Worker/ReceiptArchive/components/getOrganizedBills";

function ViewTotalAmountReceipts({ receipts }) {
    const [totalAmount, setTotalAmount] = useState(0);
    const [usageHistory, setUsageHistory] = useState([]);
    const [numberOfWOrkers, setNumberOfWOrkers] = useState(0);

    const organizeReceiptsBills = (receipts) => {
        let bills = getOrganizedBills(receipts);

        setTotalAmount(bills.total);
        setUsageHistory(bills.list);
    };

    useEffect(() => {
        if (receipts) {
            organizeReceiptsBills(receipts);

            let users = [];
            receipts.forEach((receipt) => {
                if (receipt.user_id) {
                    users.push(receipt.user_id);
                }
            });

            // remove duplicates
            users = [...new Set(users)];

            setNumberOfWOrkers(users.length);
        }
    }, [receipts]);

    return (
        <div className="bg-slate-200 p-4 rounded mb-4 flex gap-10 flex-col">
            <UsageHistoryBill
                receipts={receipts}
                usageHistory={usageHistory}
                totalAmount={totalAmount}
                numberOfWOrkers={numberOfWOrkers}
            />
        </div>
    );
}

export default ViewTotalAmountReceipts;
