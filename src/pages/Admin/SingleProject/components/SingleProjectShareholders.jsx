import { Button, CircularProgress, Paper } from "@mui/material";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useShareholderUpdate,
    useProjectShareholderPage,
    useShareholdersFromProject,
    SHAREHOLDER_TABLE_COLUMNS,
} from "../../../../hooks/useShareholder";
import useDebouncedValue from "../../../../hooks/useDebouncedValue";
import transl from "../../../components/translate";
import ShareholderTable from "../../components/ShareholderTable";
import EditShareholderResultDialog from "./EditShareholderResultDialog";
import EditShareholdersListDialog from "./EditShareholdersListDialog";
import getShaholdersEditList from "./getShaholdersEditList";
import ShareholderSearchTable from "./ShareholderSearchTable";

const PAGE_SIZE = 40;

const toastOptions = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

function SingleProjectShareholders({ project, shareholderCount }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editDialogShareholder, setEditDialogShareholder] = useState(false);
    const updateShaholdersMutation = useShareholderUpdate();
    const [searchField, setSearchField] = useState("");

    // Stack of cursors, one per page visited, so Back is exact.
    const [cursors, setCursors] = useState([null]);
    const [pageIndex, setPageIndex] = useState(0);

    const debouncedSearch = useDebouncedValue(searchField, 300);

    // Search and paging happen on the server: the previous implementation
    // downloaded every shareholder and re-filtered the whole array on each
    // keystroke, which is what made 30k+ projects unusable.
    const { data, isFetching } = useProjectShareholderPage({
        projectId: project?.id,
        search: debouncedSearch,
        cursor: cursors[pageIndex] ?? null,
        limit: PAGE_SIZE,
    });

    const rows = data?.rows ?? [];
    const hasNextPage = !!data?.nextCursor;

    const handleSearchChange = (event) => {
        setSearchField(event.target.value);
        // A new search invalidates the cursor stack.
        setCursors([null]);
        setPageIndex(0);
    };

    const handleNextPage = () => {
        if (!data?.nextCursor) return;
        setCursors((prev) => {
            const next = prev.slice(0, pageIndex + 1);
            next.push(data.nextCursor);
            return next;
        });
        setPageIndex((i) => i + 1);
    };

    const handlePrevPage = () => setPageIndex((i) => Math.max(0, i - 1));

    // Fetched only once the dialog opens. This is the one place that still
    // needs every row, and it is the only thing the user waits on -- the page
    // itself no longer downloads them. React Query caches the result, so
    // reopening the dialog is instant.
    const { data: fullShareholders, isFetching: isFullShareholdersFetching } =
        useShareholdersFromProject(openDialog ? project?.id : null, {
            columns: SHAREHOLDER_TABLE_COLUMNS,
        });

    // Built on demand: this is a ~19-column row per shareholder and was
    // previously computed on mount for a dialog that may never be opened.
    const csvBody = useMemo(
        () =>
            openDialog && fullShareholders
                ? getShaholdersEditList(fullShareholders)
                : false,
        [openDialog, fullShareholders],
    );

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleEditing = (shareholder) => {
        setOpenEditDialog(true);
        setEditDialogShareholder(shareholder);
    };

    const handleCloseEditing = () => {
        setOpenEditDialog(false);
        setEditDialogShareholder(false);
    };

    const handleResultUpdate = (shareholder, result) => {
        const formatedShareholders = [{ id: shareholder.id, result: result }];

        updateShaholdersMutation.mutate(
            { formatedShareholders, project_id: project?.id },
            {
                onSuccess: () => {
                    toast.success(
                        transl("The Shareholder result is updated"),
                        toastOptions,
                    );
                    handleCloseEditing();
                },
                onError: () => {
                    toast.error(
                        "Something went wrong! Check your excel please.",
                        toastOptions,
                    );
                    handleCloseEditing();
                },
            },
        );
    };

    return (
        <div>
            <Paper className="mb-8">
                <div className="flex justify-between p-4 pb-0 items-center">
                    <div className="flex items-center">
                        <p className="text-xl mr-4 flex-shrink-0">
                            {transl("Shareholders")}{" "}
                            <span className="text-sm text-slate-400">
                                ({shareholderCount ?? "..."})
                            </span>
                        </p>
                        <ShareholderSearchTable
                            searchField={searchField}
                            handleSearchChange={handleSearchChange}
                        />
                        {isFetching && (
                            <CircularProgress size={18} className="ml-3" />
                        )}
                    </div>
                    <div className="flex items-start">
                        <p className="mr-4">
                            <Button onClick={handleOpenDialog}>
                                {transl("Edit Shareholders List")}
                            </Button>
                        </p>
                        <Link
                            to={`/dashboard/project/${project.id}/add-more-shareholders`}
                        >
                            <Button variant="outlined" className="">
                                {transl("Add more shareholders")}
                            </Button>
                        </Link>
                    </div>
                </div>
                <ShareholderTable
                    list={rows}
                    isEditble={true}
                    projectResult={project.results}
                    handleEditing={handleEditing}
                />
                <div className="flex items-center justify-end gap-2 p-4">
                    <Button
                        size="small"
                        disabled={pageIndex === 0 || isFetching}
                        onClick={handlePrevPage}
                    >
                        {transl("Previous")}
                    </Button>
                    <span className="text-sm text-slate-400">
                        {transl("Page")} {pageIndex + 1}
                    </span>
                    <Button
                        size="small"
                        disabled={!hasNextPage || isFetching}
                        onClick={handleNextPage}
                    >
                        {transl("Next")}
                    </Button>
                </div>
            </Paper>
            <EditShareholdersListDialog
                open={openDialog}
                csvBody={csvBody}
                isLoading={isFullShareholdersFetching}
                handleClose={handleCloseDialog}
            />
            <EditShareholderResultDialog
                shareholder={editDialogShareholder}
                handleCloseEditing={handleCloseEditing}
                open={openEditDialog}
                results={project.results}
                handleResultUpdate={handleResultUpdate}
            />
        </div>
    );
}

export default SingleProjectShareholders;
