import React, { useEffect } from "react";
import AppHeader from "../components/AppHeader";
import AppContent from "../components/AppContent";
import transl from "../../components/translate";
import DeadlineWarning from "./components/DeadlineWarning";
import ReceiptSubmitForm from "./components/ReceiptSubmitForm";
import { useOption } from "../../../hooks/useOptions";
import { CircularProgress } from "@mui/material";

function ReceiptSubmit() {
    return (
        <div>
            <AppHeader>
                <h1 className="text-3xl">{transl("Upload receipt")}</h1>
            </AppHeader>
            <AppContent>
                <DeadlineWarning />
                <ReceiptSubmitForm />
            </AppContent>
        </div>
    );
}

export default ReceiptSubmit;
