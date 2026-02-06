import { Button } from "@mui/material";
import React from "react";
import transl from "../../../components/translate";

function ReceiptAttachmentPreview({
    attachmentPreview,
    isEditing,
    setAttachmentPreview,
}) {
    return attachmentPreview && !isEditing ? (
        <div >
        <div className="sticky top-8">
            <div className="flex items-end justify-between mb-4 ">
                <p className="text-center text-slate-600">
                    {transl("Receipt Attachment")}
                </p>
                <Button
                    variant="outlined"
                    size={"small"}
                    onClick={() => {
                        setAttachmentPreview(false);
                    }}
                >
                    {transl("close preview")}
                </Button>
            </div>
            <div className="flex flex-col items-center w-96 flex-shrink-0" >
                <img
                    src={`${process.env.REACT_APP_STORAGE_PATH}${attachmentPreview}`}
                    alt="attachment preview"
                    className="max-w-96 object-contain "
                    style={{maxHeight: '88vh'}}
                />
            </div>
        </div>
        </div>
    ) : null;
}

export default ReceiptAttachmentPreview;
