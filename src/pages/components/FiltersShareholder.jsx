import {
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import transl from "../components/translate";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { listOfShareholdersAtom } from "../../helpers/atom";
import { useAtom } from "jotai";
import SearchIcon from "@mui/icons-material/Search";

function FiltersShareholder({ listOfResults, originalShareholdesList }) {
    const [listOfShareholders, setListOfShareholders] = useAtom(
        listOfShareholdersAtom,
    );
    const [sortBy, setsSortBy] = useState("name");
    const [sortDirection, setsSortDirection] = useState(true);
    const [searchField, setSearchField] = useState("");

    const [selectResult, setSelectResult] = useState("all");

    const sortList = (sortValue) => {
        var sortedList = originalShareholdesList.sort((a, b) => {
            if (sortValue === "shares_total") {
                return (
                    parseInt(a[sortValue]?.replaceAll(",", "")) -
                    parseInt(b[sortValue]?.replaceAll(",", ""))
                );
            } else if (sortValue === "result") {
                let rA =
                    a[sortValue] === null
                        ? 0
                        : parseInt(a[sortValue]?.replaceAll(",", "")) + 1;
                let rB =
                    b[sortValue] === null
                        ? 0
                        : parseInt(b[sortValue]?.replaceAll(",", "")) + 1;

                return rA - rB;
            }
            return a[sortValue] > b[sortValue] ? 1 : -1;
        });

        if (sortDirection) {
            sortedList = [...sortedList].reverse();
        } else {
            sortedList = [...sortedList];
        }

        if (selectResult !== "all") {
            sortedList = [...sortedList].filter((item) => {
                if (selectResult === "null") {
                    return item.result == null;
                } else {
                    return item.result == selectResult;
                }
            });
        }

        if (searchField !== "") {
            sortedList = [...sortedList].filter((item) => {
                return `${item.name}${item.date_of_birth_code}${item.contact_info}${item.contact_info}${item.contact_worker}${item.database}`
                    .toLowerCase()
                    .includes(searchField.toLowerCase());
            });
        }

        setListOfShareholders([...sortedList]);
    };

    const handleSelectChange = (event) => {
        setsSortBy(event.target.value);

        sortList(event.target.value);
    };

    const handleChangeDirection = () => {
        setsSortDirection(!sortDirection);
    };

    const handleSelectResultChange = (event) => {
        setSelectResult(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchField(event.target.value);
    };

    useEffect(() => {
        sortList(sortBy);
    }, [sortDirection, selectResult, searchField]);

    return (
        <>
            <Paper className="p-2 mb-6" elevation={0}>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-adornment-seacrh">
                        {transl("Search for shareholders")}...
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-seacrh"
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        aria-describedby="outlined-seacrh-helper-text"
                        label={`${transl("Search for shareholders")}...`}
                        value={searchField}
                        onChange={handleSearchChange}
                    />
                </FormControl>
            </Paper>
            <Paper className="px-2 py-4 mb-6" elevation={0}>
                <div className="flex items-center justify-center">
                    <p className="mr-2">{transl("Sort By")}</p>
                    <FormControl
                        sx={{
                            width: "30%",
                            minWidth: "100px",
                            marginRight: "0",
                        }}
                    >
                        <InputLabel id="demo-simple-select-label">
                            {transl("Sort By")}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sortBy}
                            label={transl("Sort By")}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={"name"}>{transl("Name")}</MenuItem>
                            <MenuItem value={"shares_total"}>
                                {transl("Total Of Shares")}
                            </MenuItem>
                            <MenuItem value={"address"}>
                                {transl("Address")}
                            </MenuItem>
                            <MenuItem value={"result"}>
                                {transl("Results")}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant=""
                        onClick={handleChangeDirection}
                        sx={{ marginRight: "16px" }}
                    >
                        {sortDirection ? (
                            <ArrowDownwardIcon />
                        ) : (
                            <ArrowUpwardIcon />
                        )}
                    </Button>
                    <FormControl sx={{ width: "30%", minWidth: "100px" }}>
                        <InputLabel id="specific-result">
                            {transl("Show only Result")}
                        </InputLabel>
                        <Select
                            labelId="specific-result"
                            value={selectResult}
                            label={transl("Show only Result")}
                            onChange={handleSelectResultChange}
                        >
                            <MenuItem value={"all"}>{transl("All")}</MenuItem>
                            {listOfResults?.map((result, index) => {
                                const resultName = JSON.parse(result)?.name;

                                return (
                                    <MenuItem key={resultName} value={index}>
                                        {resultName}
                                    </MenuItem>
                                );
                            })}
                            <MenuItem value={"null"}>
                                {transl("With no results")}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </Paper>
        </>
    );
}

export default FiltersShareholder;

//without results rephrase
