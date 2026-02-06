import React, { useEffect, useState } from "react";
import transl from "../../../components/translate";
import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import moment from "moment";
import ReceiptAttachForm from "./ReceiptAttachForm";
import formatNumber from "../../../components/formatNumber";
import { useUser, useUserisLoggendIn } from "../../../../hooks/useUser";
import {
    useReceiptCreate,
    useReceiptUpdate,
} from "../../../../hooks/useReceipt";
import { useOption } from "../../../../hooks/useOptions";
import { toast } from "react-toastify";
import supabase from "../../../../utils/supabaseClient";
import { useQueryClient } from "react-query";

function ReceiptSubmitForm({
    savedNote,
    savedAttachments,
    savedAmount,
    savedDate,
    savedUsageHistory,
    savedWhereWereUsed,
    savedReceiptId,
    setIsEditing,
    isAdmin,
}) {
    const { data: currentUser } = useUserisLoggendIn();
    const { data: usermeta } = useUser(currentUser?.id);
    const { data: usageHistoryOptions, isLoading } = useOption(
        "usage_history_schema",
        "multivalue"
    );
    const createReceipt = useReceiptCreate();
    const updateReceipt = useReceiptUpdate();
    const queryClient = useQueryClient();

    const {
        data: receiptSubmissionStatus,
        isLoading: isLoadingReceiptSubmissionStatus,
    } = useOption("receipt_submission_status", "value");
    const [locked, setLocked] = useState(false);

    const koreanToday = moment().utcOffset(9).format("YYYY-MM-DD");
    const [date, setDate] = useState(koreanToday);
    const [usageHistory, setUsageHistory] = useState("");
    const [whereWereUsed, setWhereWereUsed] = useState("");
    const [amount, setAmount] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState({});
    const [isDateFocused, setIsDateFocused] = useState(false);

    const handleAmountChange = (value) => {
        if (value === "") {
            setAmount("");
            return;
        }

        const parsed = parseInt(value.replace(/,/g, ""));

        setAmount(formatNumber(parsed));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        var pass = true;

        setErrors({});

        if (!date) {
            setErrors((prev) => ({
                ...prev,
                date: transl("Date is required"),
            }));
            pass = false;
        } else {
            const selectedDate = moment(date, "YYYY-MM-DD");
            const todayKST = moment(koreanToday, "YYYY-MM-DD");

            if (selectedDate.isAfter(todayKST)) {
                setErrors((prev) => ({
                    ...prev,
                    date: transl("Date cannot be in the future (KST)"),
                }));
                pass = false;
            }
        }

        if (!usageHistory) {
            setErrors((prev) => ({
                ...prev,
                usageHistory: transl("Usage history is required"),
            }));
            pass = false;
        }

        if (!whereWereUsed) {
            setErrors((prev) => ({
                ...prev,
                whereWereUsed: transl("Where were used is required"),
            }));
            pass = false;
        }

        if (!amount) {
            setErrors((prev) => ({
                ...prev,
                amount: transl("Amount is required"),
            }));
            pass = false;
        }

        if (!attachments || attachments.length == 0) {
            setErrors((prev) => ({
                ...prev,
                attachments: transl("Attachments are required"),
            }));
            pass = false;
        }

        if (!pass) {
            return;
        }

        if (savedReceiptId) {
            updateReceipt.mutate(
                {
                    receipt_id: savedReceiptId,
                    meta: {
                        date: date,
                        usage_history: usageHistory,
                        where_used: whereWereUsed,
                        amount: amount,
                        attachments: [attachments[0]],
                        note: note,
                    },
                },
                {
                    onSuccess: () => {
                        setDate(koreanToday);
                        setUsageHistory("");
                        setWhereWereUsed("");
                        setAmount("");
                        setNote("");
                        setAttachments([]);

                        toast.success(transl("updated with success"), {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        setIsEditing(false);
                    },
                }
            );
        } else {
            createReceipt.mutate(
                {
                    date: date,
                    usageHistory: usageHistory,
                    whereWereUsed: whereWereUsed,
                    amount: amount,
                    user: usermeta.id,
                    attachments: [attachments[0]],
                    user_name: usermeta.first_name,
                    note: note,
                },
                {
                    onSuccess: () => {
                        setDate(koreanToday);
                        setUsageHistory("");
                        setWhereWereUsed("");
                        setAmount("");
                        setNote("");
                        setAttachments([]);

                        toast.success(transl("updated with success"), {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    },
                }
            );
        }
    };

    useEffect(() => {
        if (savedNote) {
            setNote(savedNote);
        }

        if (savedAttachments) {
            setAttachments(savedAttachments);
        }

        if (savedAmount) {
            setAmount(savedAmount);
        }

        if (savedDate) {
            setDate(moment(savedDate).format("YYYY-MM-DD"));
        }

        if (savedUsageHistory) {
            setUsageHistory(savedUsageHistory);
        }

        if (savedWhereWereUsed) {
            setWhereWereUsed(savedWhereWereUsed);
        }
    }, [savedNote]);

    useEffect(() => {
        const channel = supabase
            .channel("receipt_submission_status")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "options" },
                (payload) => {
                    if (payload.new.name == "receipt_submission_status") {
                        setLocked(payload.new.value);

                        // clean cache
                        queryClient.invalidateQueries("OptionItem");
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    useEffect(() => {
        console.log("receiptSubmissionStatus", receiptSubmissionStatus);
        if (receiptSubmissionStatus == "open") {
            setLocked(receiptSubmissionStatus);
        }
    }, [receiptSubmissionStatus]);

    if (isLoadingReceiptSubmissionStatus) {
        return <CircularProgress />;
    }

    if (!locked && !isAdmin) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit} className="pt-7">
            {/* DATE */}
            <p className="text-red-500 text-sm">{errors.date && errors.date}</p>
            <div className="relative"
                onClick={() => setIsDateFocused(true)}
            >
                <p className="absolute top-0 left-0 border border-slate-300 pl-3  pt-1 bg-white w-full rounded flex items-center" style={{
                    height: '56px', 
                    backgroundColor: '#f3f5f9',
                    opacity: isDateFocused ? 0 : 1
                    }}>실제 사용한 영수증 날짜를 기입해주세요.</p>
                <FormControl
                    variant="outlined"
                    className="w-full "
                    sx={{ mb: "20px", opacity: isDateFocused ? 1 : 0 }}
                >
                    <InputLabel htmlFor="date-input" shrink>실제 사용한 영수증 날짜를 기입해주세요</InputLabel>
                    <OutlinedInput
                        id="date-input"
                        value={date}
                        type={`date`}
                        required={true}
                        onChange={(e) => setDate(e.target.value)}
                        label={"실제 사용한 영수증 날짜를 기입해주세요"}
                        inputProps={{ max: koreanToday }}
                        sx={{
                            "& input::-webkit-clear-button": {
                            display: "none",
                            },
                            "& input::-webkit-inner-spin-button": {
                            display: "none",
                            },
                            "::-webkit-clear-button": {
                                display: "none",
                            }
                        }}
                    />
                </FormControl>                
            </div>

            {/* USAGE HISTORY */}
            {isLoading ? (
                <CircularProgress />
            ) : (
                <>
                    <p className="text-red-500 text-sm">
                        {errors.usageHistory && errors.usageHistory}
                    </p>
                    <FormControl
                        fullWidth
                        className="w-full "
                        sx={{ mb: "20px" }}
                    >
                        <InputLabel id="usage-history-input">
                            {transl("Usage history")} *
                        </InputLabel>
                        <Select
                            labelId="usage-history-input"
                            label={`${transl("Usage history")} *`}
                            value={usageHistory}
                            onChange={(e) => setUsageHistory(e.target.value)}
                        >
                            {usageHistoryOptions &&
                                usageHistoryOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </>
            )}

            {/* WHERE WERE USED */}
            <p className="text-red-500 text-sm">
                {errors.whereWereUsed && errors.whereWereUsed}
            </p>
            <FormControl
                variant="outlined"
                className="w-full "
                sx={{ mb: "20px" }}
            >
                <InputLabel htmlFor="where-used-input">
                    {transl("Where were used")} *
                </InputLabel>
                <OutlinedInput
                    id="where-used-input"
                    value={whereWereUsed}
                    onChange={(e) => setWhereWereUsed(e.target.value)}
                    label={transl("Where were used")}
                />
            </FormControl>

            {/* AMOUNT */}
            <p className="text-red-500 text-sm">
                {errors.amount && errors.amount}
            </p>
            <FormControl
                variant="outlined"
                className="w-full "
                sx={{ mb: "20px" }}
            >
                <InputLabel htmlFor="amount-input">
                    {transl("Amount")} *
                </InputLabel>
                <OutlinedInput
                    id="amount-input"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    label={transl("Amount")}
                />
            </FormControl>

            {/* TEXTAREA NOTE */}
            <FormControl
                variant="outlined"
                className="w-full "
                sx={{ mb: "20px" }}
            >
                <TextField
                    id="outlined-multiline-static"
                    label={transl("Note")}
                    multiline
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    variant="outlined"
                />
            </FormControl>

            {/* ATTACHMENTS */}
            <p className="text-red-500 text-sm">
                {errors.attachments && errors.attachments}
            </p>
            {date && usageHistory && whereWereUsed && amount ? (
                <>
                    <ReceiptAttachForm
                        maxFileQuantity={1}
                        user={usermeta.first_name}
                        date={date}
                        usageHistory={usageHistory}
                        attachments={attachments}
                        setAttachments={setAttachments}
                    />
                    <p>한 장의 영수증만 첨부할 수 있습니다.</p>
                </>
            ) : (
                <p className="text-center text-red-900 font-bold">
                    {transl("Please fill all the fields, to be able to upload")}
                </p>
            )}


            <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                sx={{ width: "100%", mt: 2 }}
            >
                {transl("Submit")}
            </Button>
        </form>
    );
}

export default ReceiptSubmitForm;
