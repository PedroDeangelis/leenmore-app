import { Button, Card, CardContent } from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import DownloadIcon from "@mui/icons-material/Download";

function ActivityDataProjectInfo({ totalDaysWorked, handleDownload }) {
    return (
        <Card>
            <CardContent>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {transl("Days of activity")}
                        </p>
                        <p className="text-lg">{totalDaysWorked}일</p>
                    </div>
                    <Button variant="contained" onClick={handleDownload}>
                        <DownloadIcon sx={{ mr: 1 }} />
                        {transl("download activity data")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default ActivityDataProjectInfo;
