import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { Cell } from "./cell";
import { GameState, getLegalMoves, Move, nextState, Player } from "./game";

export class Manager {
	size: Vector2;
	state: GameState;
	previewState: GameState | null;
	cells: Cell[];
	svg: SVGSVGElement;
	gap: number = 30;
	radius: number = 80;

	constructor(width: number, height: number) {
		this.size = new Vector2(width, height);
		//this.state = initialState;
		this.state = {
			player: Player.One,
			board: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			points: {
				[Player.One]: 0,
				[Player.Two]: 0,
			},
		};
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
			class: "border",
		}) as SVGSVGElement;
	}

	private createCells(): Cell[] {
		const cells = [];
		for (let move: Move = 0; move < 12; move++) {
			const cell = new Cell(this, move as Move);
			this.svg.appendChild(cell.group);
			cells.push(cell);
		}
		return cells;
	}
}
