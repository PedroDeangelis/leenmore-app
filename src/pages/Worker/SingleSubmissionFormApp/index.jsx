import { CircularProgress } from "@mui/material";
import moment from "moment";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useShareholderFromWorker } from "../../../hooks/useShareholder";
import { useUser, useUserisLoggendIn } from "../../../hooks/useUser";
import AppContent from "../components/AppContent";
import AppHeader from "../components/AppHeader";
import SubmissionForm from "../SingleShareholderApp/SubmissionForm/SubmissionForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import transl from "../../components/translate";

function SingleSubmissionFormApp() {
	const { id } = useParams();
	const { data: currentUser } = useUserisLoggendIn();
	const { data: usermeta } = useUser(currentUser?.id);
	const { data: shareholder, isLoading } = useShareholderFromWorker(
		id,
		usermeta.first_name
	);
	return (
		<div>
			<AppHeader>
				{isLoading ? (
					<CircularProgress />
				) : (
					<div className="flex items-center">
						<Link
							to={`/app/project/${shareholder.project_id}/shareholder/${shareholder.id}`}
							className="mr-4"
						>
							<ArrowBackIcon />
						</Link>
						<div>
							<p className="text-xs mb-3">
								{transl("Submission")}
							</p>
							<h1 className="text-3xl">
								<span>
									{shareholder.name}
									<span className=" ml-4">
										({shareholder.date_of_birth_code})
									</span>
									{shareholder.sex && (
										<span
											className=" py-2 px-3 rounded-full text-xl ml-4"
											style={{
												background:
													"rgba(0, 0, 0, 0.2)",
											}}
										>
											{shareholder.sex}
										</span>
									)}
								</span>
							</h1>
						</div>
					</div>
				)}
			</AppHeader>
			<AppContent>
				{isLoading ? (
					<CircularProgress />
				) : (
					<SubmissionForm
						project_id={shareholder.project_id}
						filename={`${shareholder.name}${shareholder.date_of_birth_code}`}
						user={usermeta.first_name}
						user_id={usermeta.id}
						shareholder={shareholder}
						date={moment().format("YYYYMMDD")}
					/>
				)}
			</AppContent>
		</div>
	);
}

export default SingleSubmissionFormApp;
