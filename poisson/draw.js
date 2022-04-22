import { variableDensityPoisson } from "./var-density-poisson.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const density = (sample) => {
	return Math.max((800 - sample.y) / 20, 5);
};
const samples = variableDensityPoisson(
	5,
	canvas.width - 5,
	5,
	canvas.height - 5,
	5,
	100,
	density,
	0,
	30
);
function main() {
	if (ctx === null) {
		console.error("Canvas context er null");
		return;
	}
	for (const sample of samples) {
		ctx.beginPath();
		ctx.arc(sample.x, sample.y, 1, 0, 2 * Math.PI);
		ctx.fill();
	}
}
main();
