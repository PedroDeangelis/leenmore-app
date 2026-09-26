import React, { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    Button,
    Card,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import {
    normalizeShareholderSearch,
    SHAREHOLDER_SEARCH_ADMIN_LIMIT,
    useShareholderSearchAdmin,
} from "../../../hooks/useShareholder";
import transl from "../../components/translate";
import Header from "../components/Header";
import { groupShareholdersByPerson } from "./groupShareholdersByPerson";
import PersonList from "./PersonList";
import ShareholderReport from "./ShareholderReport";

function ShareholderSearch() {
    const [searchField, setSearchField] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [selectedKey, setSelectedKey] = useState(null);

    const {
        data: shareholders,
        isLoading,
        isError,
        refetch,
    } = useShareholderSearchAdmin(submittedSearch);

    const people = useMemo(
        () => groupShareholdersByPerson(shareholders ?? []),
        [shareholders],
    );

    const canSearch = normalizeShareholderSearch(searchField).length > 0;

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (!canSearch) return;

        const trimmedSearchField = searchField.trim();
        setSelectedKey(null);

        if (
            normalizeShareholderSearch(trimmedSearchField) ===
            normalizeShareholderSearch(submittedSearch)
        ) {
            refetch();
            return;
        }

        setSubmittedSearch(trimmedSearchField);
    };

    const hasSubmittedSearch =
        normalizeShareholderSearch(submittedSearch).length > 0;
    const isDone = hasSubmittedSearch && !isLoading && !isError;
    const showNoResults = isDone && people.length === 0;
    const showResults = isDone && people.length > 0;
    const isTruncated =
        (shareholders?.length ?? 0) >= SHAREHOLDER_SEARCH_ADMIN_LIMIT;

    // A registration search usually finds one person: open the report directly.
    const selectedPerson =
        people.length === 1
            ? people[0]
            : people.find((person) => person.key === selectedKey);

    return (
        <div>
            <Header title={transl("Shareholder Search")} />

            <Card sx={{ padding: 2, marginBottom: 3 }}>
                <form onSubmit={handleSearchSubmit} className="flex gap-3">
                    <FormControl variant="outlined" sx={{ flex: 1 }}>
                        <InputLabel htmlFor="admin-shareholder-search">
                            {transl("Date of birth code or registration number")}
                        </InputLabel>
                        <OutlinedInput
                            id="admin-shareholder-search"
                            endAdornment={
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            }
                            label={transl(
                                "Date of birth code or registration number",
                            )}
                            value={searchField}
                            onChange={(event) =>
                                setSearchField(event.target.value)
                            }
                        />
                        <FormHelperText>
                            {transl(
                                "If a registration number is not found, try the 6-digit date of birth code",
                            )}
                        </FormHelperText>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!canSearch}
                        sx={{ height: 56, minWidth: 120 }}
                    >
                        {transl("Search")}
                    </Button>
                </form>
            </Card>

            {!hasSubmittedSearch && (
                <div className="text-center text-gray-500 mt-4">
                    {transl("Enter a date of birth code or registration number")}
                </div>
            )}

            {isLoading && (
                <div className="text-center mt-4">
                    <CircularProgress />
                </div>
            )}

            {isError && (
                <div className="text-center text-red-700 mt-4">
                    {transl("Error loading shareholders")}
                </div>
            )}

            {showNoResults && (
                <div className="text-center text-gray-500 mt-4">
                    {transl("No shareholders found")}
                </div>
            )}

            {showResults && isTruncated && (
                <p className="text-sm text-amber-700 mb-3">
                    {transl(
                        "Only the first 1000 rows are shown. Search by registration number to narrow the results.",
                    )}
                </p>
            )}

            {showResults &&
                (selectedPerson ? (
                    <div>
                        {people.length > 1 && (
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setSelectedKey(null)}
                                sx={{ marginBottom: 2 }}
                            >
                                {transl("Back to results")}
                            </Button>
                        )}
                        <ShareholderReport person={selectedPerson} />
                    </div>
                ) : (
                    <PersonList people={people} onSelect={setSelectedKey} />
                ))}
        </div>
    );
}

export default ShareholderSearch;
