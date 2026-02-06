import { Button, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import transl from "../../../components/translate";
import getOrganizedBills from "../../../Worker/ReceiptArchive/components/getOrganizedBills";
import formatNumber from "../../../components/formatNumber";

function ReceiptFLoopItem({
    userName,
    user_id,
    receipts,
    bulkDeleteOn,
    setReceiptToDelete,
}) {
    const navigate = useNavigate();
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [usageHistory, setUsageHistory] = useState([]);

    const organizeReceiptsBills = (receipts) => {
        let bills = getOrganizedBills(receipts);

        setTotalSubmissions(receipts.length);
        setTotalAmount(bills.total);
        setUsageHistory(bills.list);
    };

    useEffect(() => {
        if (receipts) {
            organizeReceiptsBills(receipts);
        }
    }, [receipts]);

    return (
        <div
            onClick={() => {
                if (!bulkDeleteOn) {
                    navigate(`/dashboard/receipt/user/${user_id}`);
                }
            }}
        >
            <Card className="mb-4">
                <div className="flex justify-between items-center   cursor-pointer p-4">
                    <div className="flex items-center">
                        {bulkDeleteOn && (
                            <input
                                onChange={(e) => {
                                    setReceiptToDelete(e, user_id);
                                }}
                                type="checkbox"
                                className="mr-2 h-5 w-5 cursor-pointer "
                            />
                        )}
                        <p className="text-lg font-semibold mr-2 w-24">
                            {userName}
                        </p>
                        <p>
                            {transl("number of submissions")}:{" "}
                            {totalSubmissions}개
                        </p>
                        <p className="mx-3">-</p>
                        <p className="mr-3">
                            {transl("total amount")}:{" "}
                            {formatNumber(totalAmount)}원
                        </p>
                        {usageHistory.map((bill, index) => (
                            <div key={index} className="ml-10">
                                <p className="text-sm">
                                    {bill.usage_history}:{" "}
                                    {formatNumber(bill.amount)}원
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <Button
                            onClick={() =>
                                navigate(`/dashboard/receipt/user/${user_id}`)
                            }
                        >
                            {transl("View all receipt")}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ReceiptFLoopItem;
