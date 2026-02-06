import { Card, CardContent } from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import { useNavigate } from "react-router-dom";

function ReceiptLoopItem({
    date,
    usageHistory,
    amount,
    whereWereUsed,
    project_id,
    id,
    note,
}) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/app/my-receipts/${id}`)}>
            <Card sx={{ marginBottom: "14px" }}>
                <CardContent sx={{ position: "relative" }}>
                    <div className="flex items-center justify-between">
                        <p className="text-center">
                            <span className="text-xs block text-slate-500">
                                {transl("date")}
                            </span>
                            {date}
                        </p>
                        <p className="text-center">
                            <span className="text-xs block text-slate-500">
                                {transl("amount")}
                            </span>
                            ₩ {amount}
                        </p>
                        <p className="text-center">
                            <span className="text-sm inline-block  px-3 py-1 rounded-full bg-green-200 text-green-800 font-bold">
                                {usageHistory}
                            </span>
                        </p>
                    </div>

                    <p className="mt-4">
                        <span className="text-xs block text-slate-500">
                            {transl("where were used")}
                        </span>
                        {whereWereUsed}
                    </p>
                    {note && (
                        <p className="mt-4">
                            <span className="text-xs block text-slate-500">
                                {transl("note")}
                            </span>
                            {note}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default ReceiptLoopItem;
