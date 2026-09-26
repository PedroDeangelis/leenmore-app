import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { listOfShareholdersAtom } from "../../../../helpers/atom";
import transl from "../../../components/translate";
import ProjectLoopItem from "./ProjectLoopItem";

const PAGE_STEP = 50;

function ProjectLoop({ listOfResults }) {
    const [listOfShareholders] = useAtom(listOfShareholdersAtom);
    // Reveal incrementally: rendering every assigned shareholder at once
    // froze or crashed the browser on a phone for large projects.
    const [visibleCount, setVisibleCount] = useState(PAGE_STEP);

    useEffect(() => {
        setVisibleCount(PAGE_STEP);
    }, [listOfShareholders]);

    if (!listOfShareholders) {
        return <p></p>;
    }

    const remaining = listOfShareholders.length - visibleCount;

    return (
        <div>
            {listOfShareholders.slice(0, visibleCount).map((value) => (
                <ProjectLoopItem
                    key={value.id}
                    id={value.id}
                    project_id={value.project_id}
                    name={value.name}
                    sex={value.sex}
                    shares={value.shares}
                    shares_total={value.shares_total}
                    contact_info={value.contact_info}
                    eletronic_voting={value?.eletronic_voting}
                    contact_worker={value.contact_worker}
                    address={value.address}
                    date_of_birth_code={value.date_of_birth_code}
                    result={value.result}
                    projectResult={listOfResults}
                    api_recipient_contact={value.api_recipient_contact}
                    api_recipient_completion_date={
                        value.api_recipient_completion_date
                    }
                />
            ))}
            {remaining > 0 && (
                <Button
                    fullWidth
                    onClick={() =>
                        setVisibleCount((count) => count + PAGE_STEP)
                    }
                >
                    {transl("Load more")} ({remaining})
                </Button>
            )}
        </div>
    );
}

export default ProjectLoop;
