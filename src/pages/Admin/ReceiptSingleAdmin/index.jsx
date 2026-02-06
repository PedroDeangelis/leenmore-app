import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import transl from "../../components/translate";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import Header from "../components/Header";
import { useReceipt, useReceiptDeactivate } from "../../../hooks/useReceipt";
import moment from "moment/moment";
import { toast } from "react-toastify";

function ReceiptSingleAdmin() {
    const { receipt_id } = useParams();
    const { data: receipt, isLoading } = useReceipt(receipt_id);
    const deactivateReceipt = useReceiptDeactivate();
    const navigate = useNavigate();

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this receipt?")) {
            deactivateReceipt.mutate(
                { receipt_id },
                {
                    onSuccess: () => {
                        navigate(`/dashboard/receipt/`);
                        toast.success(
                            `${transl("Receipt deleted successfully")}`,
                            {
                                position: "top-right",
                                autoClose: 4000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            }
                        );
                    },
                }
            );
        }
    };

    if (isLoading) {
        return (
            <div>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div>
            <Header title={`${transl("receipt")} (${receipt.user_name})`}>
                <Link to={`/dashboard/receipt`}>
                    <Button variant="text">{transl("Go Back")}</Button>
                </Link>
            </Header>
            <div className="grid grid-cols-2 gap-10 items-start">
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {transl("actions")}
                        </p>
                        <div>
                            <Button variant="outlined" color="primary">
                                {transl("edit")}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ ml: 1 }}
                                onClick={handleDelete}
                            >
                                {transl("delete")}
                            </Button>
                        </div>
                    </div>
                    <Card className="mb-10">
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4 items-center">
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                        {transl("project")}
                                    </p>
                                    <p>{receipt.project_title}</p>
                                </div>
                                <div className="ml-20">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                        {transl("worker")}
                                    </p>
                                    <p>{receipt.user_name}</p>
                                </div>
                                <div className="ml-20">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                        {transl("date")}
                                    </p>
                                    <p>
                                        {moment(receipt.created_at).format(
                                            "Y-MM-DD"
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-8">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                        {transl("amount")}
                                    </p>
                                    <p>₩ {receipt.amount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                        {transl("usage history")}
                                    </p>
                                    <p>{receipt.usage_history}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <div></div>
                    {receipt.attachments?.length > 0 ? (
                        receipt.attachments.map((attachment) => (
                            <div key={attachment}>
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide ">
                                        {transl("receipt")}
                                    </p>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href={`${process.env.REACT_APP_STORAGE_PATH}${attachment}`}
                                        target="_blank"
                                        download={true}
                                    >
                                        Download
                                    </Button>
                                </div>
                                <img
                                    src={`${process.env.REACT_APP_STORAGE_PATH}${attachment}`}
                                    alt=""
                                    className="mt-2"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500">
                            {transl("No attachments")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReceiptSingleAdmin;
