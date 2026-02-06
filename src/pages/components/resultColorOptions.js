export const resultColorOptions = [
	{
		name: "red",
		color: "rgb(153 27 27)",
		background: "rgb(254 202 202)",
	},
	{
		name: "pink",
		color: "rgb(157 23 77)",
		background: "rgb(251 207 232)",
	},
	{
		name: "rose",
		color: "rgb(136 19 55)",
		background: "rgb(253 164 175)",
	},
	{
		name: "purple",
		color: "rgb(107 33 168)",
		background: "rgb(233 213 255)",
	},
	{
		name: "fuchsia", //fuchsia
		color: "rgb(134 25 143)",
		background: "rgb(245 208 254)",
	},
	{
		name: "violet",
		color: "rgb(76 29 149)",
		background: "rgb(196 181 253)",
	},
	{
		name: "blue",
		color: "rgb(30 64 175)",
		background: "rgb(191 219 254)",
	},
	{
		name: "green", // https://tailwindcss.com/docs/background-color
		color: "rgb(22 101 52)", //800
		background: "rgb(187 247 208)", //200
	},
	{
		name: "lime",
		color: "rgb(63 98 18)",
		background: "rgb(217 249 157)",
	},
	{
		name: "yellow",
		color: "rgb(133 77 14)",
		background: "rgb(254 240 138)",
	},
	{
		name: "amber",
		color: "rgb(120 53 15)",
		background: "rgb(252 211 77)",
	},
	{
		name: "orange",
		color: "rgb(154 52 18)",
		background: "rgb(254 215 170)",
	},
	{
		name: "default",
		color: "rgb(30 41 59)",
		background: "rgb(226 232 240)",
	},
	{
		name: "b&w",
		color: "rgb(0 0 0)",
		background: "rgb(255 255 255)",
	},
];

export const getTheResultColorOption = (color) => {
	let colorOBJ = false;
	resultColorOptions.forEach((value) => {
		if (value.name == color) {
			colorOBJ = value;
		}
	});
	return colorOBJ;
};
