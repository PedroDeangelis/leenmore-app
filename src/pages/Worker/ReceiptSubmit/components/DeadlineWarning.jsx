import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useOption } from "../../../../hooks/useOptions";
import supabase from "../../../../utils/supabaseClient";
import { useQueryClient } from "react-query";

function DeadlineWarning() {
    const { data: deadline, isLoading } = useOption(
        "submission_deadline",
        "value"
    );

    const queryClient = useQueryClient();
    const [deadlineMessage, setDeadlineMessage] = useState("");

    useEffect(() => {
        const channel = supabase
            .channel("submission_deadline")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "options" },
                (payload) => {
                    if (payload.new.name == "submission_deadline") {
                        setDeadlineMessage(payload.new.value);
                        // clean cache
                        queryClient.invalidateQueries("OptionItem");
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!isLoading) {
            setDeadlineMessage(deadline);
        }
    }, [deadline]);

    if (!deadlineMessage) {
        return null;
    }

    return (
        <div>
            <p className="text-center text-red-900 font-bold flex items-center justify-center">
                <CampaignIcon sx={{ mr: 1 }} />
                <span>{deadlineMessage}</span>
            </p>
        </div>
    );
}

export default DeadlineWarning;
