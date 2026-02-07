import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import UsageHistoryBill from "../../Receipts/components/UsageHistoryBill";
import getOrganizedBills from "../../../Worker/ReceiptArchive/components/getOrganizedBills";
import ReceiptsTableRow from "./ReceiptsTableRow";

function ReceiptsTable({
    receipts,
    setAttachmentPreview,
    setIsEditing,
    isEditing,
}) {
    const [totalAmount, setTotalAmount] = useState(0);
    const [usageHistory, setUsageHistory] = useState([]);
    const organizeReceiptsBills = (receipts) => {
        let bills = getOrganizedBills(receipts);

        setTotalAmount(bills.total);
        setUsageHistory(bills.list);
    };

    useEffect(() => {
        if (receipts) {
            organizeReceiptsBills(receipts);
        }
    }, [receipts]);

    return (
        <div className="w-full">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                className="bg-slate-100"
                                sx={{ width: "70px" }}
                            >
                                {transl("no")}.
                            </TableCell>
                            <TableCell className="bg-slate-100">
                                {transl("date")}
                            </TableCell>
                            <TableCell className="bg-slate-100">
                                {transl("submission date")}
                            </TableCell>
                            <TableCell className="bg-slate-100">
                                {transl("usage history")}
                            </TableCell>
                            <TableCell className="bg-slate-100">
                                {transl("where were used")}
                            </TableCell>
                            <TableCell className="bg-slate-100">
                                {transl("amount used")}
                            </TableCell>
                            <TableCell className="bg-slate-100">
                                {transl("remarks notes")}
                            </TableCell>
                            <TableCell
                                className="bg-slate-100"
                                sx={{ textAlign: "center" }}
                            >
                                {transl("attachment")}
                            </TableCell>
                            <TableCell
                                className="bg-slate-100"
                                sx={{ textAlign: "center" }}
                            >
                                {transl("actions")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {receipts.map((receipt, index) => (
                            <ReceiptsTableRow
                                key={receipt.id}
                                id={receipt.id}
                                receipt={receipt}
                                index={index}
                                setAttachmentPreview={setAttachmentPreview}
                                usage_history={receipt.usage_history}
                                where_used={receipt.where_used}
                                amount={receipt.amount}
                                note={receipt.note}
                                attachments={receipt.attachments}
                                setIsEditing={setIsEditing}
                                isEditing={isEditing}
                                date={receipt.date}
                                createdAt={receipt.created_at}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="mx-auto max-w-3xl grid grid-cols-2 items-start gap-10 mt-14">
                <UsageHistoryBill
                    receipts={receipts}
                    usageHistory={usageHistory}
                    totalAmount={totalAmount}
                />
            </div>
        </div>
    );
}

export default ReceiptsTable;
