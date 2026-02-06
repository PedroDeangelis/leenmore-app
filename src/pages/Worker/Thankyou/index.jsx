import React, { useEffect } from "react";
import AppHeader from "../components/AppHeader";
import AppContent from "../components/AppContent";
import transl from "../../components/translate";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { listOfShareholdersAtom } from "../../../helpers/atom";

function Thankyou() {
    const { id } = useParams();
    const queryClient = useQueryClient();

    useEffect(() => {
        return () => {
            queryClient.invalidateQueries();
        };
    }, []);
    return (
        <div>
            <AppHeader>
                <p className="text-xs mb-3">{transl("Submission")}</p>
                <h1 className="text-3xl">{transl("Completed")}</h1>
            </AppHeader>
            <AppContent>
                <div className="text-center">
                    <p className="mb-4">
                        {transl("Submission completed with success")}!
                    </p>
                    <Link to={`/app/project/${id}`}>
                        <Button variant="contained">
                            {transl("Go Back to project")}
                        </Button>
                    </Link>
                </div>
            </AppContent>
        </div>
    );
}

export default Thankyou;
