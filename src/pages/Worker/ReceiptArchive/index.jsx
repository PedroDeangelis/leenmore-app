import React from "react";
import transl from "../../components/translate";
import AppHeader from "../components/AppHeader";
import AppContent from "../components/AppContent";
import ReceiptWorkerDetails from "./components/ReceiptWorkerDetails";
import ReceiptLoop from "./components/ReceiptLoop";
import { CircularProgress } from "@mui/material";
import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";
import { useReceipts } from "../../../hooks/useReceipt";

function ReceiptArchive() {
    const { data: currentUser } = useUserisLoggendIn();
    const { data: user } = useUser(currentUser?.id);
    const { data: receipts, isLoading } = useReceipts(user?.id);

    return (
        <div>
            <AppHeader>
                <h1 className="text-3xl">{transl("My receipts")}</h1>
            </AppHeader>
            <AppContent>
                {!isLoading ? (
                    receipts?.length ? (
                        <>
                            <ReceiptWorkerDetails receipts={receipts} />
                            <ReceiptLoop user={user} receipts={receipts} />
                        </>
                    ) : (
                        <p className="text-center text-slate-400">
                            {transl("You have no receipts yet")}
                        </p>
                    )
                ) : (
                    <CircularProgress />
                )}
            </AppContent>
        </div>
    );
}

export default ReceiptArchive;
