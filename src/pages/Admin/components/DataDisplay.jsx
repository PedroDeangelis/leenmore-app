import React from "react";

function DataDisplay({ label, children, className }) {
	return (
		<div className={className}>
			<p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
				{label}
			</p>
			<p className="text-lg">{children}</p>
		</div>
	);
}

export default DataDisplay;
