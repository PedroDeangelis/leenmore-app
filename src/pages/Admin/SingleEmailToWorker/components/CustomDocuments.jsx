import React, { useRef } from "react";
import {
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    FormControlLabel,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import transl from "../../../components/translate";
import {
    useCustomDocumentDelete,
    useCustomDocumentUpload,
    useCustomDocuments,
} from "../../../../hooks/useCustomDocuments";

const SUPPORTED_SHORTCODES = [
    { code: "[worker_name]", label: "Worker name" },
    { code: "[worker_email]", label: "Email" },
    { code: "[worker_phonenumber]", label: "Phone number" },
    { code: '[worker_name space="3"]', label: "3 spaces between letters" },
];

function CustomDocuments({ projectId, selectedIds, onSelectedIdsChange }) {
    const { data: documents, isLoading } = useCustomDocuments(projectId);
    const uploadDocument = useCustomDocumentUpload();
    const deleteDocument = useCustomDocumentDelete();
    const fileInput = useRef(null);
    const documentList = Array.isArray(documents) ? documents : [];

    const handleUpload = (event) => {
        const file = event.target.files?.[0];
        event.target.value = ""; // so the same file can be picked again
        if (!file) {
            return;
        }

        uploadDocument.mutate(
            {
                project_id: projectId,
                file,
                title: file.name.replace(/\.docx$/i, ""),
            },
            {
                onSuccess: (doc) => {
                    toast.success(transl("Document uploaded"));
                    if (doc?.unknown_shortcodes?.length) {
                        toast.warning(
                            `${transl("Unknown shortcode")}: ${doc.unknown_shortcodes.join(", ")}`,
                        );
                    }
                },
                onError: (error) => toast.error(error.message),
            },
        );
    };

    const handleToggle = (documentId) => (event) => {
        const { checked } = event.target;
        onSelectedIdsChange((prev) => {
            if (checked) {
                return prev.includes(documentId) ? prev : [...prev, documentId];
            }
            return prev.filter((id) => id !== documentId);
        });
    };

    const handleDelete = (doc) => {
        if (!window.confirm(`${transl("Delete this document?")}\n${doc.title}`)) {
            return;
        }

        deleteDocument.mutate(
            { project_id: projectId, document_id: doc.id },
            {
                onSuccess: () => {
                    onSelectedIdsChange((prev) =>
                        prev.filter((id) => id !== doc.id),
                    );
                    toast.success(transl("Document deleted"));
                },
                onError: (error) => toast.error(error.message),
            },
        );
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{transl("Custom documents")}</p>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ whiteSpace: "nowrap" }}
                    disabled={uploadDocument.isLoading}
                    onClick={() => fileInput.current?.click()}
                >
                    {uploadDocument.isLoading ? (
                        <CircularProgress size={18} />
                    ) : (
                        transl("Upload document")
                    )}
                </Button>
                <input
                    ref={fileInput}
                    type="file"
                    hidden
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleUpload}
                />
            </div>
            <div className="grid grid-cols-1 gap-2">
                {isLoading ? (
                    <CircularProgress size={20} />
                ) : documentList.length > 0 ? (
                    documentList.map((doc) => {
                        const shortcodes = doc.shortcodes || [];
                        const unknownShortcodes = doc.unknown_shortcodes || [];

                        return (
                            <div
                                key={doc.id}
                                className="bg-white rounded shadow flex items-center"
                            >
                                <FormControlLabel
                                    className="pl-2 w-full"
                                    control={
                                        <Checkbox
                                            checked={selectedIds.includes(doc.id)}
                                            onChange={handleToggle(doc.id)}
                                        />
                                    }
                                    label={
                                        <div className="py-1">
                                            <div>{doc.title}</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {shortcodes.length ? (
                                                    shortcodes.map((code) => {
                                                        const isUnknown =
                                                            unknownShortcodes.includes(
                                                                code,
                                                            );
                                                        return (
                                                            <Chip
                                                                key={code}
                                                                size="small"
                                                                variant="outlined"
                                                                color={
                                                                    isUnknown
                                                                        ? "warning"
                                                                        : "default"
                                                                }
                                                                label={`[${code}]`}
                                                                title={
                                                                    isUnknown
                                                                        ? transl(
                                                                              "Unknown shortcode",
                                                                          )
                                                                        : undefined
                                                                }
                                                            />
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-xs text-gray-500">
                                                        {transl(
                                                            "No shortcodes found",
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    }
                                />
                                <IconButton
                                    aria-label={transl("Delete")}
                                    sx={{ mr: 1 }}
                                    disabled={deleteDocument.isLoading}
                                    onClick={() => handleDelete(doc)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500">
                        {transl("No custom documents")}
                    </p>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
                {transl(
                    "Word (.docx) only. Each worker gets the checked documents as a PDF filled with their info. Check a document to preview it per worker.",
                )}
            </p>
            <ul className="text-xs text-gray-500 mt-1">
                {SUPPORTED_SHORTCODES.map(({ code, label }) => (
                    <li key={code}>
                        <code>{code}</code> {transl(label)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CustomDocuments;
