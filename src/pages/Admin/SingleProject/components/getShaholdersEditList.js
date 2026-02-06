import transl from "../../../components/translate";

export default function getShaholdersEditList(shareholders) {
	const csvBody = [];

	shareholders.forEach((element, key) => {
		csvBody.push([
			element.id,
			element?.no,
			element.registration,
			element.sex,
			element.name,
			element.shares,
			element.shares_total,
			element.eletronic_voting,
			element.address,
			element.contact_info,
			element.database,
			element.contact_worker,
			element.user.join("/"),
		]);
	});

	return csvBody;
}
