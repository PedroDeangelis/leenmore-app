import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import transl from "../../components/translate";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import SelectShareholdersLoop from "./components/SelectShareholdersLoop";
import { useShareholdersFromProject } from "../../../hooks/useShareholder";
import SearchProjectBar from "../components/SearchProjectBar";

function SubmissionNewSelectShareholder() {
    const { project_id } = useParams();
    const { data: shareholders, isLoading } =
        useShareholdersFromProject(project_id);

    const [searchShareholder, setSearchShareholder] = useState("");
    const [searchShareholderFilter, setSearchShareholderFilter] = useState([]);

    useEffect(() => {
        var shareholdersList = [];

        if (searchShareholder) {
            shareholdersList = shareholders.filter((shareholder) => {
                let search = `${shareholder.name} ${shareholder.registration}`;
                search = search.toLocaleLowerCase();

                return search.includes(searchShareholder.toLocaleLowerCase());
            });
        } else {
            shareholdersList = shareholders;
        }

        if (shareholdersList?.length > 42) {
            shareholdersList = shareholdersList.slice(0, 42);
        }

        setSearchShareholderFilter(shareholdersList);
    }, [searchShareholder, shareholders]);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Header title={`${transl("Select a shareholder")} `}></Header>

            <SearchProjectBar
                searchProject={searchShareholder}
                setSearchProject={setSearchShareholder}
            />
            <SelectShareholdersLoop
                shareholders={searchShareholderFilter}
                project_id={project_id}
            />
        </>
    );
}

export default SubmissionNewSelectShareholder;
