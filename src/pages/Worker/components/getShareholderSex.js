import React from "react";

export default function getShareholderSex(sex) {
	if (sex == "남") {
		return <span className="text-blue-500">(남)</span>;
	}
	if (sex == "여") {
		return <span className="text-red-500">(여)</span>;
	}
	return "";
}
