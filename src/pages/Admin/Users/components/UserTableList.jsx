import React, { useState } from "react";
import { useUserList } from "../../../../hooks/useUser";
import transl from "../../../components/translate";
import UserTableItem from "./UserTableItem";
import SearchUserBar from "./SearchUserBar";
import FilterUserBar from "./FilterUserBar";

const hasPhone = (value) => Boolean(String(value.phone_number ?? "").trim());

const matchesSearch = (value, search) => {
    if (search === "") {
        return true;
    }

    const term = search.toLowerCase();

    return (
        String(value.first_name ?? "")
            .toLowerCase()
            .includes(term) ||
        String(value.email ?? "")
            .toLowerCase()
            .includes(term)
    );
};

function UserTableList() {
    const { data, isLoading } = useUserList();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [roleFilter, setRoleFilter] = useState("all");
    const [phoneFilter, setPhoneFilter] = useState("all");
    const [nameSort, setNameSort] = useState("asc");

    // .filter() always returns a new array, so the .sort() below never
    // mutates the array react-query holds in its cache.
    const filteredUsers = (data ?? [])
        .filter(
            (value) => statusFilter === "all" || value.status === statusFilter,
        )
        .filter((value) => roleFilter === "all" || value.role === roleFilter)
        .filter((value) => {
            if (phoneFilter === "all") {
                return true;
            }

            return phoneFilter === "has phone number"
                ? hasPhone(value)
                : !hasPhone(value);
        })
        .filter((value) => matchesSearch(value, search))
        .sort((a, b) => {
            const comparison = String(a.first_name ?? "").localeCompare(
                String(b.first_name ?? ""),
            );

            return nameSort === "asc" ? comparison : -comparison;
        });

    return (
        <div className="max-w-3xl">
            <SearchUserBar search={search} setSearch={setSearch} />

            <FilterUserBar
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                phoneFilter={phoneFilter}
                setPhoneFilter={setPhoneFilter}
                nameSort={nameSort}
                setNameSort={setNameSort}
            />

            {isLoading ? (
                <p>{transl("Loading")}</p>
            ) : filteredUsers.length === 0 ? (
                <p className="text-slate-500">{transl("No users found")}</p>
            ) : (
                filteredUsers.map((value) => (
                    <UserTableItem
                        key={value.id}
                        id={value.id}
                        first_name={value.first_name}
                        role={value.role}
                        email={value.email}
                        status={value.status}
                    />
                ))
            )}
        </div>
    );
}

export default UserTableList;
