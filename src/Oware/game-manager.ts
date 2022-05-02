import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { Cell } from "./cell";
import {
	GameState,
	getLegalMoves,
	initialState,
	Move,
	nextState,
} from "./game";

export class Manager {
	size: Vector2;
	state: GameState;
	previewState: GameState | null;
	cells: Cell[];
	svg: SVGSVGElement;
	gap: number = 50;
	radius: number = 50;

	constructor(width: number, height: number) {
		this.size = new Vector2(width, height);
		this.state = initialState;
		this.previewState = null;
		this.svg = this.createSvg();
		this.cells = this.createCells();
	}

	getLegalMoves() {
		return getLegalMoves(this.state);
	}

	resetPreview() {
		this.previewState = null;
		this.cells.forEach((cell) => cell.updatePreview());
	}

	previewMove(move: Move) {
		this.previewState = nextState(this.state, move);
		this.cells.forEach((cell) => cell.updatePreview());
	}

	doMove(move: Move) {
		this.state = nextState(this.state, move);
		this.cells.forEach((cell) => cell.updateState());
	}

	get center(): Vector2 {
		return this.size.div(2);
	}

	private createSvg(): SVGSVGElement {
		return createSvgElement("svg", {
			viewBox: `0 0 ${this.size.x} ${this.size.y}`,
			width: "800",
			height: "800",
			class: "border",
		}) as SVGSVGElement;
	}

	private createCells(): Cell[] {
		const cells = [];
		for (let move: Move = 0; move < 12; move++) {
			const cell = new Cell(this, move as Move);
			this.svg.appendChild(cell.circle);
			this.svg.appendChild(cell.text);
			cells.push(cell);
		}
		return cells;
	}
}
