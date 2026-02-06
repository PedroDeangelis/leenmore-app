import {
    Card,
    CardContent,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import React from "react";
import transl from "../../components/translate";
import SearchIcon from "@mui/icons-material/Search";

function SearchProjectBar({ searchProject, setSearchProject }) {
    const handleSearchChange = (event) => {
        setSearchProject(event.target.value);
    };

    return (
        <Card className="max-w-2xl mx-auto mb-8">
            <CardContent>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-adornment-seacrh">
                        {transl("Search")}...
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-seacrh"
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        aria-describedby="outlined-seacrh-helper-text"
                        label={`${transl("Search")}...`}
                        value={searchProject}
                        onChange={handleSearchChange}
                    />
                </FormControl>
            </CardContent>
        </Card>
    );
}

export default SearchProjectBar;
