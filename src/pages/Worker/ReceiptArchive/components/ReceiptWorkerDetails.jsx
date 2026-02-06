import React from "react";
import getOrganizedBills from "./getOrganizedBills";
import formatNumber from "../../../components/formatNumber";
import DeadlineWarning from "../../ReceiptSubmit/components/DeadlineWarning";

function ReceiptWorkerDetails({ receipts }) {
    const OrganizedBills = getOrganizedBills(receipts);

    return (
        <div className="grid grid-cols-2 items-start">
            <DeadlineWarning />
            <div>
                {OrganizedBills.list.map((bill) => (
                    <p
                        key={bill.usage_history}
                        className="flex  text-right text-xs  text-slate-500 gap-1 justify-end"
                    >
                        <span>{bill.usage_history} :</span>
                        <span className="w-20">
                            총 {formatNumber(bill.amount)} 원
                        </span>
                    </p>
                ))}
                <hr className="my-2 w-44 ml-auto border-slate-400 border-dashed" />
                <p className="flex  text-right text-xs  text-slate-500 gap-1 justify-end">
                    <span>
                        <span className="mr-2">( {receipts.length}개 )</span>합
                        계 :
                    </span>
                    <span className="">
                        총 {formatNumber(OrganizedBills.total)} 원
                    </span>
                </p>
            </div>
        </div>
    );
}

export default ReceiptWorkerDetails;
