import moment from "moment/moment";
import transl from "../../../components/translate";

export default function getDownloadCSV({ project }) {
	let headers = [
		transl("No"),
		transl("Company"),
		transl("Resident Registration Number"),
		transl("Name+First 6 Digits of Resident Registration Number"),
		transl("Sex"),
		transl("Name"),
		transl("Number of Shares"),
		transl("Total Number of Shares"),
		transl("Eletronic Voting"),
		transl("Address"),
		transl("Contact"),
		transl("Database"),
		'연락처',
		transl("Worker(s)"),
		transl("Submission Date"),
		transl("Result"),
	];

	const resultTable = project?.results?.map((value) => JSON.parse(value));

	//Organize Dates form Header
	let headerDates = [];

	project?.submission
		.sort((a, b) => {
			return a.date > b.date ? 1 : -1;
		})
		.forEach((sub) => {
			headerDates.push(moment(sub.date).format("YYYY-MM-DD"));
		});

	//create the dates to feel the gaps on headerDates
	let dates = [];
	let start = moment(headerDates[0]);
	let end = moment(headerDates[headerDates.length - 1]);
	while (start <= end) {
		dates.push(start.format("MMDD"));
		start.add(1, "days");
	}

	headerDates = dates;

	headerDates.forEach((date) => {
		headers.push(`담당자${date}`);
		headers.push(`멘트${date}`);
		headers.push(`${transl("contact for worker")}${date}`);
	});

	//Organize Shareholders Info
	let csvData = project.shareholder.map((customer, mainKey) => {
		let shareholderSubmissions = project?.submission
			?.filter((sub) => {
				return sub.shareholder_id == customer.id;
			})
			.map((sub) => sub);
		let latestSubmissionDate = "";
		if (shareholderSubmissions?.length) {
			latestSubmissionDate = shareholderSubmissions
				.slice()
				.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
				.map((s) => moment(s.created_at).format("YYYY-MM-DD"))[0];
		}
		let shareholderRow = [
			customer?.no,
			project.title,
			customer.registration,
			`${customer.name}${customer.date_of_birth_code}`,
			customer.sex,
			customer.name,
			customer.shares,
			customer.shares_total,
			customer.eletronic_voting,
			customer.address,
			customer.contact_info,
			customer.database,
			customer.contact_worker,
			customer.user.join("/"),
			latestSubmissionDate,
			resultTable[customer.result]?.name,
		];

		headerDates?.forEach((date) => {
			let u = ""; //user
			let n = []; //note
			let c = []; //note
			shareholderSubmissions
				.sort((a, b) => {
					// sort by date if date is the same sort by id DESC
					if (a.date == b.date) {
						return a.id > b.id ? 1 : -1;
					} else {
						return a.date > b.date ? -1 : 1;
					}
				})
				.forEach((i) => {
					if (moment(i.date).format("MMDD") == date) {
						u = i.user_name; //user
						n.push(i.note);
						c.push(i.contact_worker);
					}
				});
			if (n.length) {
				n = n.join(" / ");
			} else {
				n = "";
			}
			shareholderRow.push(u);
			shareholderRow.push(n);
			shareholderRow.push(c);
		});
		return shareholderRow;
	});

	return {
		header: headers,
		body: csvData,
	};
}
