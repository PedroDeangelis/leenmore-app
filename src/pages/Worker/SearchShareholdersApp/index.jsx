import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import { useShareholderSearchByUser } from "../../../hooks/useShareholder";
import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";
import transl from "../../components/translate";
import AppContent from "../components/AppContent";
import AppHeader from "../components/AppHeader";
import getShareholderSex from "../components/getShareholderSex";
import OChip from "../../components/OChip";

function ShareholderSearchResult({ shareholder }) {
    let resultJson =
        shareholder.project_results?.[shareholder.result] ?? null;

    if (typeof resultJson === "string") {
        try {
            resultJson = JSON.parse(resultJson);
        } catch (error) {
            resultJson = null;
        }
    } else if (resultJson && typeof resultJson !== "object") {
        resultJson = null;
    }

    return (
        <Card sx={{ marginBottom: "14px" }}>
            <CardContent className="relative">
                <div className="md:absolute md:top-5 left-0 w-full mb-1 text-center text-base flex items-center gap-2 justify-center">
                    {shareholder.eletronic_voting && (
                        <p className="text-blue-700">
                            ({transl("eletronic vote")} {transl("completed")})
                        </p>
                    )}
                    {shareholder.api_recipient_contact &&
                        shareholder.api_recipient_completion_date && (
                            <p className="text-green-700">
                                ({transl("Eproxy completed")})
                            </p>
                        )}
                </div>
                <div className="flex items-center justify-between">
                    <p className="font-bold">
                        {shareholder.name}
                        <span className="text-slate-500 font-normal mx-2">
                            {shareholder.date_of_birth_code}
                        </span>
                        {getShareholderSex(shareholder.sex)}
                    </p>
                    <div>
                        {resultJson && (
                            <OChip color={resultJson.color}>
                                {resultJson.name}
                            </OChip>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-center">
                        <span className="text-xs block text-slate-500">
                            {transl("Shares")}
                        </span>
                        {shareholder.shares}
                    </p>
                    <p className="text-center">
                        <span className="text-xs block text-slate-500">
                            {transl("Total Shares")}
                        </span>
                        {shareholder.shares_total}
                    </p>
                </div>
                {shareholder.contact_info && (
                    <p className="mt-4">
                        <span className="text-xs block text-slate-500">
                            {transl("Contact info")}
                        </span>
                        {shareholder.contact_info}
                    </p>
                )}
                <div className="grid grid-cols-2 gap-10 mt-4">
                    <div>
                        {shareholder.contact_worker && (
                            <p>
                                <span className="text-xs block text-slate-500">
                                    {transl("Contact for worker")}
                                </span>
                                {shareholder.contact_worker}
                            </p>
                        )}
                        {shareholder.address && (
                            <p className="mt-4">
                                <span className="text-xs block text-slate-500">
                                    {transl("Address")}
                                </span>
                                {shareholder.address}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <p>
                            <span className="text-xs block text-slate-500">
                                {transl("Company")}
                            </span>
                            {shareholder.project_title}
                        </p>
                        <p className="mt-2">
                            <span className="text-xs block text-slate-500">
                                {transl("Worker(s)")}
                            </span>
                            {shareholder.user?.[0]?.length
                                ? shareholder.user.join(" / ")
                                : transl("vacant")}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SearchShareholdersApp() {
    const [searchField, setSearchField] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");

    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);

    const userFirstName = usermeta?.first_name;
    const trimmedSearchField = searchField.trim();

    const {
        data: shareholders = [],
        isLoading,
        refetch,
    } = useShareholderSearchByUser(userFirstName, submittedSearch);

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        if (!trimmedSearchField) {
            setSubmittedSearch("");
            return;
        }

        if (trimmedSearchField === submittedSearch) {
            refetch();
            return;
        }

        setSubmittedSearch(trimmedSearchField);
    };

    const hasSubmittedSearch = submittedSearch.length > 0;
    const showTypingHint = !hasSubmittedSearch;
    const showNoResults =
        hasSubmittedSearch && !isLoading && shareholders.length === 0;
    const showResults =
        hasSubmittedSearch && !isLoading && shareholders.length > 0;

    return (
        <div>
            <AppHeader>
                <div>
                    <p className="text-xs mb-3">{transl("page")}</p>
                    <h1 className="text-3xl">
                        {transl("search shareholders")}
                    </h1>
                </div>
            </AppHeader>

            <AppContent>
                <div>
                    <Card sx={{ padding: 1 }}>
                        <form onSubmit={handleSearchSubmit}>
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
                                    label={`${transl("Search for shareholders")}...`}
                                    value={searchField}
                                    onChange={(event) =>
                                        setSearchField(event.target.value)
                                    }
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ marginTop: 2 }}
                                disabled={!trimmedSearchField || !userFirstName}
                            >
                                {transl("Search")}
                            </Button>
                        </form>
                    </Card>

                    {showTypingHint && (
                        <div className="text-center text-gray-500 mt-4">
                            {transl("Type to search")}
                        </div>
                    )}

                    {isLoading && (
                        <div className="text-center mt-4">
                            <CircularProgress />
                        </div>
                    )}

                    {showNoResults && (
                        <div className="text-center text-gray-500 mt-4">
                            {transl("No shareholders found")}
                        </div>
                    )}

                    {showResults && (
                        <div className="mt-2">
                            {shareholders.map((shareholder) => (
                                <ShareholderSearchResult
                                    key={shareholder.id}
                                    shareholder={shareholder}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </AppContent>
        </div>
    );
}

export default SearchShareholdersApp;
