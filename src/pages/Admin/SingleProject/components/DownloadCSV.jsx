import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import getDownloadCSV from "./getDownloadCSV";
import { useCSVDownloader } from "react-papaparse";
import transl from "../../../components/translate";

function DownloadCSV(project) {
    const [csvDownload, setCsvDownload] = useState("loading");
    const { CSVDownloader } = useCSVDownloader();

    useEffect(() => {
        setCsvDownload(getDownloadCSV(project));
    }, []);

    return (
        <>
            {csvDownload == "loading" ? (
                <CircularProgress />
            ) : (
                <CSVDownloader
                    filename={transl("Download CSV Data")}
                    bom={true}
                    quotes={true}
                    config={{
                        quotes: true,
                    }}
                    data={{
                        fields: csvDownload.header,
                        data: csvDownload.body,
                    }}
                >
                    <Button>
                        <FileDownloadIcon />
                        {transl("Download CSV Data")}
                    </Button>
                </CSVDownloader>
            )}
        </>
    );
}

export default DownloadCSV;
