import { createChild } from "../dom-utils";
import { AppFunction } from "../main";
import { OctavePerlinGenerator } from "./perlin";

export const perlinLine: AppFunction = (mainDiv) => {
	const canvas: HTMLCanvasElement = createChild(mainDiv, "canvas", {
		width: "800",
		height: "800",
		class: "border",
	}) as HTMLCanvasElement;
	const ctx = canvas.getContext("2d");
	if (ctx === null) {
		console.error("Canvas context er null");
	}

	const amplitude = 300;
	const minY = (canvas.height - amplitude) / 2;
	const maxY = minY + amplitude;
	const noise = OctavePerlinGenerator(7, 0.5);

	function draw(timestamp: number) {
		if (ctx === null) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.moveTo(0, minY);
		ctx.lineTo(canvas.width, minY);
		ctx.moveTo(0, maxY);
		ctx.lineTo(canvas.width, maxY);
		ctx.strokeStyle = "red";
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "black";
		const y = minY + noise(timestamp * 0.001, 0.5) * amplitude;
		ctx.moveTo(0, y);
		for (let x = 1; x < canvas.width; x++) {
			const y = minY + noise(x * 0.001 + timestamp * 0.001, 0.5) * amplitude;
			ctx.lineTo(x, y);
		}
		ctx.stroke();
		window.requestAnimationFrame(draw);
	}

	window.requestAnimationFrame(draw);
};
