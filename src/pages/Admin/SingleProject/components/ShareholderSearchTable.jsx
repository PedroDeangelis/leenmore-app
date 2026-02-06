import {
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import SearchIcon from "@mui/icons-material/Search";

function ShareholderSearchTable({ searchField, handleSearchChange }) {
    return (
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
    );
}

export default ShareholderSearchTable;
