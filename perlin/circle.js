import { OctavePerlinGenerator } from "./perlin.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
if (ctx === null) {
	console.error("Canvas context er null");
}
function main() {
	if (ctx === null) return;
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;
	const radius = 250;
	const stepSize = 0.001;
	const frequency = 50 / (2 * Math.PI);
	const circumference = 2 * Math.PI * frequency;
	const amplitude = 100;
	const timeFrequency = 0.001;
	const noise = OctavePerlinGenerator(8, 0.5, circumference);
	const draw = (timestamp) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		for (let angle = 0; angle <= 2 * Math.PI; angle += stepSize) {
			let dist =
				radius +
				amplitude *
					noise(
						angle * frequency + timestamp * timeFrequency,
						timestamp * timeFrequency
					);
			ctx.lineTo(
				centerX + dist * Math.cos(angle),
				centerY + dist * Math.sin(angle)
			);
		}
		ctx.closePath();
		ctx.stroke();
		window.requestAnimationFrame(draw);
	};
	window.requestAnimationFrame(draw);
}
main();
