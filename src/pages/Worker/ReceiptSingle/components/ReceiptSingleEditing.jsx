import React from "react";
import DeadlineWarning from "../../ReceiptSubmit/components/DeadlineWarning";
import ReceiptSubmitForm from "../../ReceiptSubmit/components/ReceiptSubmitForm";

function ReceiptSingleEditing({
    date,
    amount,
    usageHistory,
    whereWereUsed,
    attachments,
    receipt_id,
    note,
    setIsEditing,
}) {
    return (
        <>
            <DeadlineWarning />
            <ReceiptSubmitForm
                savedNote={note}
                savedAttachments={attachments}
                savedAmount={amount}
                savedDate={date}
                savedUsageHistory={usageHistory}
                savedWhereWereUsed={whereWereUsed}
                savedReceiptId={receipt_id}
                setIsEditing={setIsEditing}
            />
        </>
    );
}

export default ReceiptSingleEditing;
