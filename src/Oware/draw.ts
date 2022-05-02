import { Manager } from "./game-manager";

export function setup() {
	const container = document.getElementById("app");
	assertIsDefined(container, "Hovedddiv #app ikke definert i dokument");
	const manager = new Manager(1280, 720);
	container.appendChild(manager.svg);
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
