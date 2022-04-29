import { ViewBox } from "./viewbox.js";
import { Coord } from "./hex.js";

const svg = document.getElementById("svg");

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
	if (value === undefined || value === null) {
		throw Error("Men for faen da");
	}
}

const SIZE = 10;
const [W, H] = [2 * SIZE, Math.sqrt(3) * SIZE];
const BASECOORDS = [
	[-W / 2, 0],
	[-W / 4, H / 2],
	[W / 4, H / 2],
	[W / 2, 0],
	[W / 4, -H / 2],
	[-W / 4, -H / 2],
];

let VB = new ViewBox("-10 -10 20 20");
let FUTUREVB = VB.clone();

function addHex(hex: Coord) {
	assertIsDefined(svg);
	const element = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"polygon"
	);
	const [x, y] = hex.toPixels(SIZE);
	const points = BASECOORDS.map(([dx, dy]) => `${x + dx},${y + dy}`).join(" ");
	element.setAttribute("points", points);
	element.setAttribute("stroke", "black");
	element.setAttribute("fill", "white");
	element.onclick = () => addNeighbors(hex);
	element.classList.add("hex");
	svg.appendChild(element);
	updateViewbox(x, y);
	return element;
}

let _timeOut: number;
function updateViewbox(x: number, y: number) {
	if (VB.isOutside(x, y)) {
		FUTUREVB.assign(x, y);
		clearTimeout(_timeOut);
		_timeOut = setTimeout(animateViewbox, 50);
	}
}

function lerp(a: number, b: number, t: number) {
	return (1 - t) * a + b * t;
}

export function addNeighbors(hex: Coord) {
	hex.neighbors().forEach(addHex);
}

function easeInOutCubic(x: number): number {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function animateViewbox() {
	const duration = 1000;
	let start: number | undefined;
	function step(timestamp: number) {
		assertIsDefined(svg);
		if (start === undefined) start = timestamp;
		let t = Math.min((timestamp - start) / duration, 1);
		t = easeInOutCubic(t);
		const minX = lerp(VB.minX, FUTUREVB.minX, t) - 10;
		const minY = lerp(VB.minY, FUTUREVB.minY, t) - 10;
		const width = lerp(VB.width, FUTUREVB.width, t) + 20;
		const height = lerp(VB.height, FUTUREVB.height, t) + 20;
		svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
		if (t < 1) {
			window.requestAnimationFrame(step);
		} else {
			VB = FUTUREVB;
			FUTUREVB = VB.clone();
		}
	}
	window.requestAnimationFrame(step);
}

//let hex = addHex(new Coord(0, 0));
