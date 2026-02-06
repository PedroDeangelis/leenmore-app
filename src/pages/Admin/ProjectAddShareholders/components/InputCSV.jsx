import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import transl from "../../../components/translate";
import {
	parseShareholderFile,
} from "../../components/shareholderSheet";
import getFormatedShareholders from "../../AddNewProject/components/getFormatedShareholders";

function InputCSV({ setShareholderList }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleOnChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setIsLoading(true);

		try {
			const rows = await parseShareholderFile(file);
			const formatedShareholders = getFormatedShareholders(rows);

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
				setShareholderList(formatedShareholders);
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
		}
		setIsLoading(false);
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

export default InputCSV;
