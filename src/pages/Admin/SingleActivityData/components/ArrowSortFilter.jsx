import React from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import transl from "../../../components/translate";

function ArrowSortFilter({ sortFilter, currentItem, setSortFilter }) {
    const handleSortFilter = () => {
        if (sortFilter?.sortBy === currentItem) {
            if (sortFilter?.sortDirection === "asc") {
                setSortFilter({
                    sortBy: currentItem,
                    sortDirection: "desc",
                });
            } else {
                setSortFilter({
                    sortBy: currentItem,
                    sortDirection: "asc",
                });
            }
        } else {
            setSortFilter({
                sortBy: currentItem,
                sortDirection: "asc",
            });
        }
    };

    return (
        <button
            className="flex items-center cursor-pointer hover:underline"
            onClick={handleSortFilter}
        >
            {transl(currentItem)}
            {sortFilter?.sortBy === currentItem && (
                <>
                    {sortFilter?.sortDirection === "asc" ? (
                        <ArrowDropUpIcon className="text-red-500" />
                    ) : (
                        <ArrowDropDownIcon className="text-red-500" />
                    )}
                </>
            )}
        </button>
    );
}

export default ArrowSortFilter;
