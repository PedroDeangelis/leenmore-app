import React, { useState } from "react";
import transl from "../../components/translate";
import AppContent from "../components/AppContent";
import AppHeader from "../components/AppHeader";
import SearchIcon from "@mui/icons-material/Search";

import {
    Card,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import { useUserisLoggendIn } from "../../../hooks/useUser";

function SearchShareholdersApp() {
    const [searchField, setSearchField] = useState("");
    const { data: currentUser } = useUserisLoggendIn();
    const { data: shareholders, isLoading } = useAllShareholdersByUser(
        currentUser?.id,
    );

    return (
        <div>
            <AppHeader>
                <div>
                    <p className="text-xs mb-3">{transl("page")}</p>
                    <h1 className="text-3xl">주주 검색하기</h1>
                </div>
            </AppHeader>
            <AppContent>
                <Card sx={{ padding: 1 }}>
                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                        <InputLabel htmlFor="outlined-adornment-search">
                            {transl("Search for shareholders")}...
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-search"
                            endAdornment={
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            }
                            aria-describedby="outlined-search-helper-text"
                            label={`${transl("Search for shareholders")}...`}
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                        />
                    </FormControl>
                </Card>
            </AppContent>
        </div>
    );
}

export default SearchShareholdersApp;
