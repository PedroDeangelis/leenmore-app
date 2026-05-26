import React, { useEffect, useRef, useState } from "react";
import transl from "../../../components/translate";
import SubmissionLoopEsignonItem from "./SubmissionLoopEsignonItem";
import SubmissionLoopItem from "./SubmissionLoopItem";
import SubmissionInfo from "./SubmissionInfo";
import ReceiptAttachmentPreview from "../../ReceiptsByProjectAndUser/components/ReceiptAttachmentPreview";

const headerTH = "py-6 text-sm tracking-wider text-gray-500";

function SubmissionLoop({ data, projectResults }) {
    const [limitDisplay, setLimitDisplay] = useState(20);
    const lastSubmissionRef = useRef();
    const [attachmentPreview, setAttachmentPreview] = useState(null);

    useEffect(() => {
        if (!lastSubmissionRef.current) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setLimitDisplay((prev) => prev + 20);
                }
            },
            { threshold: 1 },
        );

        observer.observe(lastSubmissionRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <div className="mb-10 flex itemms-stretch gap-6">
                <div className="w-full">
                    <div className="mb-3 rounded-lg bg-white shadow-card flex ">
                        <span className={`${headerTH} w-2/12 pl-6`}>
                            {transl("Shareholder")}
                        </span>
                        <span className={`${headerTH} w-2/12`}>
                            {transl("Number of shares")}
                        </span>
                        <span className={`${headerTH} w-2/12`}>
                            {transl("Total shares")}
                        </span>
                        <span className={`${headerTH} w-1/12`}>
                            {transl("Worker")}
                        </span>
                        <span className={`${headerTH} w-1/12`}>
                            {transl("Submission Date")}
                        </span>
                        <span className={`${headerTH} w-2/12 `}>
                            {transl("Project")}
                        </span>
                        <span className={`${headerTH} w-2/12`}>
                            {transl("Result")}
                        </span>
                    </div>
                    <SubmissionInfo data={data} />
                    {data?.length ? (
                        data.slice(0, limitDisplay).map((value) => {
                            let result = value.result;

                            if (value?.source === "esignon") {
                                return (
                                    <SubmissionLoopEsignonItem
                                        key={value.id}
                                        project={value.project?.title}
                                        created_at={value.created_at}
                                        shareholderValue={value.shareholder}
                                    />
                                );
                            }

                            return (
                                <SubmissionLoopItem
                                    key={value.id}
                                    submissionID={value.id}
                                    project={value.project.title}
                                    shareholder={`${value.shareholder.name}`}
                                    date_of_birth_code={`${value.shareholder.date_of_birth_code}`}
                                    shares={value.shareholder.shares}
                                    sharesTotal={value.shareholder.shares_total}
                                    address={value.shareholder.address}
                                    sex={value.shareholder.sex}
                                    database={value.shareholder.database}
                                    contact_info={
                                        value.shareholder.contact_info
                                    }
                                    contact_worker={
                                        value.shareholder.contact_worker
                                    }
                                    user={value.user_name}
                                    date={value.date}
                                    created_at={value.created_at}
                                    result={result}
                                    note={value.note}
                                    files={value.files}
                                    privacyConsentFile={
                                        value.privacy_consent_file
                                    }
                                    projectResult={value.project.results}
                                    shareholderValue={value.shareholder}
                                    setAttachmentPreview={setAttachmentPreview}
                                />
                            );
                        })
                    ) : (
                        <p>{transl("No Submissions")}</p>
                    )}
                </div>
                <ReceiptAttachmentPreview
                    isEditing={false}
                    attachmentPreview={attachmentPreview}
                    setAttachmentPreview={setAttachmentPreview}
                />
            </div>
            <div ref={lastSubmissionRef}></div>
        </>
    );
}

export default SubmissionLoop;
