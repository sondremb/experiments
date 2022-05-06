import { createChild } from "../dom-utils";
import { Manager } from "./game-manager";

export function setup() {
	const container = document.getElementById("app");
	assertIsDefined(container, "Hovedddiv #app ikke definert i dokument");
	const div = createChild(container, "div", {
		class: "flex justify-center",
	});
	const div2 = createChild(div, "div", {
		class: "max-w-5xl w-full mt-40",
	});
	const manager = new Manager(1280, 720);
	div2.appendChild(manager.svg);
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

setup();
