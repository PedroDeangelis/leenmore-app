import React, { useEffect, useMemo, useState } from "react";
import transl from "../../components/translate";
import AppContent from "../components/AppContent";
import AppHeader from "../components/AppHeader";
import SearchIcon from "@mui/icons-material/Search";

import {
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";

import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";
import { useAllShareholdersByUser } from "../../../hooks/useShareholder";
import ShareholderInfo from "../SingleShareholderApp/components/ShareholderInfo";
import getShareholderSex from "../components/getShareholderSex";
import OChip from "../../components/OChip";

function SearchShareholdersApp() {
    const [searchField, setSearchField] = useState("");

    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);

    // important: usermeta may be undefined on first render
    const userFirstName = usermeta?.first_name;

    // default shareholders to [] so filtering never breaks
    const { data: shareholders = [], isLoading } =
        useAllShareholdersByUser(userFirstName);

    const query = searchField.trim().toLowerCase();

    // filter by registration, name, contact_worker
    const filteredShareholders = useMemo(() => {
        if (!query) return [];

        return shareholders
            .filter((s) => {
                const registration = String(s.registration ?? "").toLowerCase();
                const name = String(s.name ?? "").toLowerCase();
                const contactWorker = String(
                    s.contact_worker ?? "",
                ).toLowerCase();

                return (
                    registration.includes(query) ||
                    name.includes(query) ||
                    contactWorker.includes(query)
                );
            })
            .slice(0, 10);
    }, [shareholders, query]);

    const showTypingHint = !query;
    const showNoResults = query && filteredShareholders.length === 0;
    const showResults = query && filteredShareholders.length > 0;

    useEffect(() => {
        console.log("Shareholders data:", filteredShareholders);
    }, [filteredShareholders]);

    return (
        <div>
            <AppHeader>
                <div>
                    <p className="text-xs mb-3">{transl("page")}</p>
                    <h1 className="text-3xl">주주 검색하기</h1>
                </div>
            </AppHeader>

            <AppContent>
                {isLoading ? (
                    <div className="text-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div>
                        <Card sx={{ padding: 1 }}>
                            <FormControl
                                variant="outlined"
                                sx={{ width: "100%" }}
                            >
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
                                    onChange={(e) =>
                                        setSearchField(e.target.value)
                                    }
                                />
                            </FormControl>
                        </Card>

                        {/* Hint / Empty / Results */}
                        {showTypingHint && (
                            <div className="text-center text-gray-500 mt-4">
                                {transl("Type to search")}
                            </div>
                        )}

                        {showNoResults && (
                            <div className="text-center text-gray-500 mt-4">
                                {transl("No shareholders found")}
                            </div>
                        )}

                        {showResults && (
                            <div className="mt-2">
                                {filteredShareholders.map((shareholder) => {
                                    let resultJson =
                                        shareholder.project_results[
                                            shareholder.result
                                        ] || {};

                                    if (resultJson) {
                                        // conver string to json
                                        resultJson = JSON.parse(resultJson);
                                    } else {
                                        resultJson = false;
                                    }

                                    return (
                                        <Card
                                            key={shareholder.id}
                                            sx={{ marginBottom: "14px" }}
                                        >
                                            <CardContent>
                                                {shareholder.eletronic_voting && (
                                                    <p className="text-center mb-1 font-extrabold text-lg text-blue-700 md:absolute md:top-5 left-0 w-full">
                                                        (전자투표 완료)
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold">
                                                        {shareholder.name}
                                                        <span className="text-slate-500 font-normal mx-2">
                                                            {
                                                                shareholder.date_of_birth_code
                                                            }
                                                        </span>
                                                        {getShareholderSex(
                                                            shareholder.sex,
                                                        )}
                                                    </p>
                                                    <div>
                                                        {resultJson && (
                                                            <OChip
                                                                color={
                                                                    resultJson.color
                                                                }
                                                            >
                                                                {
                                                                    resultJson.name
                                                                }
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
                                                            {transl(
                                                                "Total Shares",
                                                            )}
                                                        </span>
                                                        {
                                                            shareholder.shares_total
                                                        }
                                                    </p>
                                                </div>
                                                {shareholder.contact_info && (
                                                    <p className=" mt-4">
                                                        <span className="text-xs block text-slate-500">
                                                            {transl(
                                                                "Contact info",
                                                            )}
                                                        </span>
                                                        {
                                                            shareholder.contact_info
                                                        }
                                                    </p>
                                                )}
                                                <div className="grid grid-cols-2 gap-10 mt-4">
                                                    <div>
                                                        {shareholder.contact_worker && (
                                                            <p className="">
                                                                <span className="text-xs block text-slate-500">
                                                                    {transl(
                                                                        "Contact for worker",
                                                                    )}
                                                                </span>
                                                                {
                                                                    shareholder.contact_worker
                                                                }
                                                            </p>
                                                        )}
                                                        {shareholder.address && (
                                                            <>
                                                                <p className=" mt-4">
                                                                    <span className="text-xs block text-slate-500">
                                                                        {transl(
                                                                            "Address",
                                                                        )}
                                                                    </span>
                                                                    {
                                                                        shareholder.address
                                                                    }
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p>
                                                            <span className="text-xs block text-slate-500">
                                                                해당 회사
                                                            </span>
                                                            {
                                                                shareholder.project_title
                                                            }
                                                        </p>
                                                        <p className="mt-2">
                                                            <span className="text-xs block text-slate-500">
                                                                배정 담당자
                                                            </span>
                                                            {shareholder.user}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </AppContent>
        </div>
    );
}

export default SearchShareholdersApp;
