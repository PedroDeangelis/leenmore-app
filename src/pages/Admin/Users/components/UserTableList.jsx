import React, { useState } from "react";
import { useUserList } from "../../../../hooks/useUser";
import transl from "../../../components/translate";
import UserTableItem from "./UserTableItem";
import SearchUserBar from "./SearchUserBar";

function UserTableList() {
    const { data, isLoading } = useUserList();
    const [search, setSearch] = useState("");

    return (
        <div className="max-w-3xl">
            <SearchUserBar search={search} setSearch={setSearch} />

            {isLoading ? (
                <p>{transl("Loading")}</p>
            ) : (
                data
                    .filter((value) => value.status !== "deactivated")
                    .filter((value) => {
                        if (search === "") {
                            return value;
                        } else if (
                            value.first_name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        ) {
                            return value;
                        } else if (
                            value.email
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        ) {
                            return value;
                        }
                    })
                    .map((value) => (
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
