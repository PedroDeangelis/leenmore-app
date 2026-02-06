import React from "react";
import transl from "../../../components/translate";
import ReceiptLoopItem from "./ReceiptLoopItem";
import moment from "moment";

function ReceiptLoop({ receipts }) {
    return (
        <div className="mt-10">
            {receipts?.length > 0 ? (
                receipts.map((receipt) => (
                    <ReceiptLoopItem
                        key={receipt.id}
                        date={moment(receipt.date).format("YYYY-MM-DD")}
                        usageHistory={receipt.usage_history}
                        amount={receipt.amount}
                        whereWereUsed={receipt.where_used}
                        project_id={receipt.project_id}
                        note={receipt.note}
                        id={receipt.id}
                    />
                ))
            ) : (
                <p className="text-center text-slate-500">
                    {transl("No receipts")}
                </p>
            )}
        </div>
    );
}

export default ReceiptLoop;
