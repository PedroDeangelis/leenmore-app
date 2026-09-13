import {
    Card,
    CardContent,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import React from "react";
import transl from "../../../components/translate";
import SearchIcon from "@mui/icons-material/Search";

// Controlled input only. The page owns the search term so that it can be
// combined with the other filters in one place instead of each control
// overwriting the filtered list.
function ReceiptSearch({ search, setSearch }) {
    return (
        <Card className="max-w-2xl mx-auto mb-8">
            <CardContent>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-adornment-seacrh">
                        {transl("Search for receipt")}...
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-seacrh"
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        aria-describedby="outlined-seacrh-helper-text"
                        label={`${transl("Search for receipt")}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </FormControl>
            </CardContent>
        </Card>
    );
}

export default ReceiptSearch;
