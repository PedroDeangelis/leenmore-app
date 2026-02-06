import moment from "moment/moment";

const koreanNumberFormatter = new Intl.NumberFormat("ko-KR");

const normalizeKey = (value) =>
	value
		?.toString()
		.toLowerCase()
		.replace(/\s+/g, "")
		.replace(/[^a-z0-9ㄱ-힣]/g, "");

export default function getFormatedShareholders(csv) {
	let shareholders = [];
	if (!csv?.length) return shareholders;

	const headerRow = csv[0] || [];
	const headerIndex = {};

	headerRow.forEach((col, idx) => {
		const norm = normalizeKey(col);
		if (norm) {
			headerIndex[norm] = idx;
		}
	});

	const getIndex = (...keys) => {
		for (const key of keys) {
			if (headerIndex[key] !== undefined) {
				return headerIndex[key];
			}
		}
		return null;
	};

	const indexes = {
		no: getIndex("연번") ?? 0,
		registration: getIndex("실명번호") ?? 1,
		sex: getIndex("성별") ?? 2,
		name: getIndex("주주명") ?? 3,
		shares: getIndex("주식수") ?? 4,
		shares_total: getIndex("총소유주식수") ?? 5,
		eletronic_voting: getIndex("전자투표") ?? 6,
		address: getIndex("주소") ?? 7,
		contact_info: getIndex("주소서치") ?? 8,
		database: getIndex("구연락처") ?? 9,
		contact_worker: getIndex("연락처") ?? 10,
		worker: getIndex("활동가") ?? 11,
	};

	csv?.forEach((row, key) => {
		if (key === 0 || !row || row.length <= 1) return;

		const registration = row[indexes.registration] ?? "";
		const name = row[indexes.name] ?? "";
		const numberOfShares = row[indexes.shares] ?? "";
		const totalNumberOfShares = row[indexes.shares_total] ?? "";

		const registrationClean = registration
			?.toString()
			.replace(/\D/g, "")
			.trim();
		const sharesClean = numberOfShares?.toString().replace(/,/g, "").trim();
		const totalSharesClean = totalNumberOfShares
			?.toString()
			.replace(/,/g, "")
			.trim();
		const sharesValue = Number(sharesClean);
		const totalSharesValue = Number(totalSharesClean);
		const formattedShares = koreanNumberFormatter.format(sharesValue);
		const formattedTotalShares = koreanNumberFormatter.format(totalSharesValue);

		if (
			!(
				name &&
				registrationClean &&
				sharesClean &&
				totalSharesClean &&
				!isNaN(sharesValue) &&
				!isNaN(totalSharesValue)
			)
		) {
			return;
		}

		const no = row[indexes.no] ?? "";
		const sex = row[indexes.sex] ?? "";
		const eletronicVoting = row[indexes.eletronic_voting] ?? "";
		const address = row[indexes.address] ?? "";
		const contactInfo = row[indexes.contact_info] ?? "";
		const database = row[indexes.database] ?? "";
		const contactForWorker = row[indexes.contact_worker] ?? "";
		const worker = row[indexes.worker] ?? "";

		let personType = "person";
		let dob = registrationClean.substr(0, 6);
		let dobA = registrationClean;
		let code = registrationClean.substr(6);

		if (registrationClean?.length != 13) {
			personType = "business";
			code = registrationClean;
			dob = registrationClean;
		} else {
			dobA = {
				year: registrationClean.substring(0, 2),
				month: registrationClean.substring(2, 4),
				day: registrationClean.substring(4, 6),
			};
			dobA = `${dobA.year}/${dobA.month}/${dobA.day}`;

			dobA = moment(dob, "YY/MM/DD").valueOf();
		}

		shareholders.push({
			no: no,
			name: name,
			registration: registrationClean,
			sex: sex,
			shares: formattedShares,
			shares_total: formattedTotalShares,
			contact_info: contactInfo,
			database: database,
			contact_worker: contactForWorker,
			eletronic_voting: eletronicVoting,
			address: address,
			user:
				typeof worker === "string"
					? worker.split("/").map((i) => i.trim()).filter(Boolean)
					: worker,
			person_type: personType,
			code: code,
			date_of_birth: dobA,
			date_of_birth_code: dob,
		});

        // console.log('shareholders[0]', shareholders)
	});

	shareholders = shareholders.filter(
		(shareholder, index, self) =>
			index ===
			self.findIndex(
				(t) =>
					t.no === shareholder.no &&
					t.registration === shareholder.registration &&
					t.name === shareholder.name &&
					t.shares === shareholder.shares &&
					t.shares_total === shareholder.shares_total
			)
	);

	return shareholders;
}
