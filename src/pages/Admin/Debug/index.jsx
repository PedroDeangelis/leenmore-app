import React, { useEffect, useState } from "react";
import supabase from "../../../utils/supabaseClient";
import { Button } from "@mui/material";
import moment from "moment";

async function updateShareholders(shareholders) {
    try {
        const updatePromises = shareholders.map(async (shareholder) => {
            const { data, error } = await supabase
                .from("shareholder")
                .update({
                    registration: shareholder.registration,
                    person_type: shareholder.person_type,
                    code: shareholder.code,
                    date_of_birth: shareholder.date_of_birth,
                    date_of_birth_code: shareholder.date_of_birth_code,
                })
                .eq("id", shareholder.id);
            if (error) {
                console.log("Error updating shareholder:", error);
                return null;
            }
            return data;
        });

        const updatedShareholders = await Promise.all(updatePromises);
    } catch (error) {
        console.error("Error updating shareholders:", error.message);
    }
}

function Debug() {
    const [shareholders, setShareholders] = useState([]);
    const [updateStatus, setUpdateStatus] = useState("");

    useEffect(() => {
        const test = async () => {
            let { data: shareholder, error } = await supabase
                .from("shareholder")
                .select("*")
                .eq("project_id", 42);

            if (error) console.log("error", error);

            setShareholders(shareholder);
        };

        test();
    }, []);

    const checkForTrim = () => {
        let newShareholders = shareholders.map((shareholder) => {
            if (shareholder.registration.includes(" ")) {
                let registration = shareholder.registration.trim();

                let personType = "person";
                let dob = registration.substr(0, 6);
                let dobA = registration;
                let code = registration.substr(6);

                if (registration?.length != 13) {
                    personType = "business";
                    code = registration;
                    dob = registration;
                } else {
                    dobA = {
                        year: registration.substring(0, 2),
                        month: registration.substring(2, 4),
                        day: registration.substring(4, 6),
                    };
                    dobA = `${dobA.year}/${dobA.month}/${dobA.day}`;

                    dobA = moment(dob, "YY/MM/DD").valueOf();
                }

                return {
                    ...shareholder,
                    registration: registration,
                    person_type: personType,
                    code: code,
                    date_of_birth: dobA,
                    date_of_birth_code: dob,
                };
            }
            return false;
        });

        newShareholders = newShareholders.filter((el) => {
            return el != false;
        });

        if (!newShareholders) {
            console.log("No new shareholders");
        } else {
            console.log("newShareholders", newShareholders);

            setShareholders(newShareholders);
        }
    };

    const updateTrim = async () => {
        setUpdateStatus("Updating...");

        try {
            await updateShareholders(shareholders);
            setUpdateStatus("Successfully updated shareholders.");
        } catch (error) {
            setUpdateStatus("Error updating shareholders: " + error.message);
        }
    };

    return (
        <div>
            <h1>Debug: {updateStatus}</h1>
            <div className="mb-10">
                <Button onClick={checkForTrim} variant="contained">
                    Check
                </Button>
                <Button onClick={updateTrim} variant="contained">
                    Update Trim
                </Button>
            </div>
            {shareholders.map((shareholder) => (
                <div key={shareholder.id}>
                    <p>{shareholder.id}</p>
                    <p>{shareholder.registration}</p>
                </div>
            ))}
        </div>
    );
}

export default Debug;
