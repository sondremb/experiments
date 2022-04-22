import { removeAllChildren } from "../dom-utils";
import { GameState } from "./game";

function setup(initialState: GameState) {
	const svg = document.getElementById("svg");
	assertIsDefined(svg, 'Fant ingen element med ID "svg"!');
	removeAllChildren(svg);
}

function assertIsDefined<T>(
	value: T,
	errorMessage: string
): asserts value is NonNullable<T> {
	if (value === null || value === undefined) {
		throw Error(errorMessage);
	}
}

function valueOrError<T>(value: T, errorMessage: string): NonNullable<T> {
	assertIsDefined(value, errorMessage);
	return value;
}
