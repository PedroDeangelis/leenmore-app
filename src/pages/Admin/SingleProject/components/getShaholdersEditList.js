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
            element.contact_info_2,
            element.database,
            element.contact_worker,
            element.user.join("/"),
            element.prev_comment,
            element.prev_result,
            element.prev_note,
            element.api_recipient_contact,
            element.api_recipient_completion_date,
        ]);
    });

    return csvBody;
}
