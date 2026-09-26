import React from "react";
import formatNumber from "../../components/formatNumber";
import transl from "../../components/translate";
import getShareholderSex from "../../Worker/components/getShareholderSex";

function PersonList({ people, onSelect }) {
    return (
        <div>
            <p className="text-sm text-slate-500 mb-3">
                {transl("Search results")} ({people.length})
            </p>
            {people.map((person) => (
                <button
                    type="button"
                    key={person.key}
                    onClick={() => onSelect(person.key)}
                    className="w-full text-left flex items-center justify-between p-4 mb-3 rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
                >
                    <p className="w-4/12 font-bold">
                        {person.name}
                        <span className="text-slate-500 font-normal mx-2">
                            {person.dobCode}
                        </span>
                        {getShareholderSex(person.sex)}
                    </p>
                    <p className="w-3/12 text-sm text-slate-600">
                        {person.registration}
                    </p>
                    <p className="w-2/12 text-center">
                        <span className="text-xs block text-slate-500">
                            {transl("Number of projects")}
                        </span>
                        {person.projectCount}
                    </p>
                    <p className="w-3/12 text-right">
                        <span className="text-xs block text-slate-500">
                            {transl("Shares across all projects")}
                        </span>
                        {formatNumber(person.totalShares)}
                    </p>
                </button>
            ))}
        </div>
    );
}

export default PersonList;
