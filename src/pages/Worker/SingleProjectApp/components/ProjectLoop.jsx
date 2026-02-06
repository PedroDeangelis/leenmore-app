import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { listOfShareholdersAtom } from "../../../../helpers/atom";
import ProjectLoopItem from "./ProjectLoopItem";

function ProjectLoop({ listOfResults }) {
	const [listOfShareholders] = useAtom(listOfShareholdersAtom);

	if (!listOfShareholders) {
		return <p></p>;
	}

	return (
		<div>
			{listOfShareholders.map((value) => (
				<ProjectLoopItem
					key={value.id}
					id={value.id}
					project_id={value.project_id}
					name={value.name}
					sex={value.sex}
					shares={value.shares}
					shares_total={value.shares_total}
					contact_info={value.contact_info}
					eletronic_voting={value?.eletronic_voting}
					contact_worker={value.contact_worker}
					address={value.address}
					date_of_birth_code={value.date_of_birth_code}
					result={value.result}
					projectResult={listOfResults}
				/>
			))}
		</div>
	);
}

export default ProjectLoop;
