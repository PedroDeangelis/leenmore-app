import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useShareholderUpdate } from "../../../../hooks/useShareholder";
import transl from "../../../components/translate";
import setShareholderUpdateList from "./setShareholderUpdateList";
import { parseShareholderFile } from "../../components/shareholderSheet";

function EditShareholdersUploader({ handleClose }) {
	const [isLoading, setIsloading] = useState(false);
	const updateShaholdersMutation = useShareholderUpdate();

	const handleOnChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setIsloading(true);

		try {
			const rows = await parseShareholderFile(file);
			const formatedShareholders = setShareholderUpdateList(rows);

			if (!formatedShareholders?.length) {
				toast.error("Something went wrong! Check your excel please.", {
					position: "top-right",
					autoClose: 4000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			} else {
				updateShaholdersMutation.mutate(
					{ formatedShareholders },
					{
						onSuccess: (error) => {
							if (error) {
								toast.error(
									"Something went wrong! Check your excel please.",
									{
										position: "top-right",
										autoClose: 4000,
										hideProgressBar: false,
										closeOnClick: true,
										pauseOnHover: true,
										draggable: true,
										progress: undefined,
									}
								);
							} else {
								toast.success(
									transl("The Shareholder list is updated"),
									{
										position: "top-right",
										autoClose: 4000,
										hideProgressBar: false,
										closeOnClick: true,
										pauseOnHover: true,
										draggable: true,
										progress: undefined,
									}
								);
							}
							handleClose();
							setIsloading(false);
						},
					}
				);
			}
		} catch (error) {
			toast.error("Something went wrong! Check your excel please.", {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			setIsloading(false);
		}
		e.target.value = null;
	};

	return (
		<div className="border-2 border-slate-300 border-dashed rounded-xl relative py-6 cursor-pointer">
			{isLoading ? (
				<CircularProgress />
			) : (
				<>
					<p className="text-slate-500 text-center text-sm mb-2">
						{transl("Click here or Drag your file")}
					</p>
					<p className="text-center font-bold text-slate-500">
						{transl("Upload the Shareholders .CSV / .XLSX")}
					</p>
				</>
			)}
			<input
				type="file"
				accept=".csv, text/csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				onChange={handleOnChange}
				className="absolute left-0 top-0 w-full h-full opacity-0 z-10"
			/>
		</div>
	);
}

export default EditShareholdersUploader;
