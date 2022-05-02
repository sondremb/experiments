import { createSvgElement } from "../dom-utils";
import { GameState, initialState, Move } from "./game";

const WIDTH = 1280;
const HEIGHT = 720;
const RADIUS = 50;
const GAP = 50;

export function setup(initialState: GameState) {
	const container = document.getElementById("app");
	assertIsDefined(container, "Hovedddiv #app ikke definert i dokument");
	const svg = createSvgElement("svg", {
		viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
		width: "800",
		height: "800",
		class: "border",
	});
	for (let move = 0; move < 12; move++) {
		svg.appendChild(createCell(move as Move));
	}
	container.appendChild(svg);
	console.log(initialState);
}

function createCell(move: Move) {
	const row = move < 6 ? 1 : 0;
	const col = move % 6;
	const element = createSvgElement("circle", {
		r: "50",
		cx: String(
			WIDTH / 2 +
				(row === 0 ? 5 - col : col) * (2 * RADIUS + GAP) -
				(2.5 * GAP + 5 * RADIUS)
		),
		cy: String(HEIGHT / 2 + row * (2 * RADIUS + GAP) - (RADIUS + GAP / 2)),
		stroke: "black",
		class:
			"fill-transparent hover:fill-emerald-300 cursor-pointer active:-translate-y-5 transition-transform",
	});
	element.onclick = () => console.log(move);
	return element;
}

export function assertIsDefined<T>(
	value: T,
	errorMessage: string
): asserts value is NonNullable<T> {
	if (value === null || value === undefined) {
		throw Error(errorMessage);
	}
}

export function valueOrError<T>(
	value: T,
	errorMessage: string
): NonNullable<T> {
	assertIsDefined(value, errorMessage);
	return value;
}

setup(initialState);
