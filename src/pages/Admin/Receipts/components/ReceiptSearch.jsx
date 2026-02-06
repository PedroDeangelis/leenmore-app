import {
    Card,
    CardContent,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import transl from "../../../components/translate";
import SearchIcon from "@mui/icons-material/Search";

function ReceiptSearch({ receipts, setFilteredReceipts }) {
    const [search, setSearch] = useState("");

    const handleSearchChange = (value) => {
        setSearch(value);
        if (value === "") {
            setFilteredReceipts(receipts);
        } else {
            const filtered = receipts.filter((receipt) => {
                return receipt.user_name
                    .toLowerCase()
                    .includes(value.toLowerCase());
            });
            setFilteredReceipts(filtered);
        }
    };

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
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </FormControl>
            </CardContent>
        </Card>
    );
}

export default ReceiptSearch;
