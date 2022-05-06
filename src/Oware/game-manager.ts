import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { Cell } from "./cell";
import { GameState, getLegalMoves, Move, nextState, Player } from "./game";
import { PreviewArrow } from "./preview-arrow";

export class Manager {
	size: Vector2;
	state: GameState;
	previewState: GameState | null;
	cells: Cell[];
	svg: SVGSVGElement;
	arrow: PreviewArrow;
	gap: number = 30;
	radius: number = 80;

	constructor(width: number, height: number) {
		this.size = new Vector2(width, height);
		//this.state = initialState;
		this.state = {
			player: Player.One,
			board: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 47],
			points: {
				[Player.One]: 0,
				[Player.Two]: 0,
			},
		};
		this.previewState = null;
		this.svg = this.createSvg();
		this.cells = this.createCells();
		this.arrow = this.createPreviewArrow();
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
		this.arrow.previewMove(move);
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

	private createPreviewArrow(): PreviewArrow {
		const arrow = new PreviewArrow(this);
		this.svg.appendChild(arrow.element);
		return arrow;
	}
}
