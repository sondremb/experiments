import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { Cell } from "./cell";
import { EndOverlay } from "./end-overlay";
import { EventQueue } from "./event-queue";
import { Events } from "./events";
import {
	GameState,
	getLegalMoves,
	getWinner,
	initialState,
	Move,
	nextState,
	Player,
	Winner,
} from "./game";
import { negamax } from "./minimax";
import { PreviewArrow } from "./preview-arrow";
import { ScoreLabel } from "./score-label";

export class Manager {
	size: Vector2;
	state: GameState;
	previewState: GameState | null;
	cells: Cell[];
	svg: SVGSVGElement;
	gap: number = 30;
	radius: number = 80;
	queue: EventQueue;
	winner: Winner;

	constructor(width: number, height: number) {
		this.queue = new EventQueue();
		this.size = new Vector2(width, height);
		this.state = initialState;
		this.winner = getWinner(this.state);
		this.previewState = null;
		this.svg = this.createSvg();
		this.cells = this.createCells();
		this.createPreviewArrow();
		this.createScoreLabels();
		this.createEndOverlay();

		this.queue.subscribe(Events.SetState, () =>
			setTimeout(() => this.aiMove(), 1000)
		);

		this.queue.subscribe(Events.ResetGame, () => {
			this.state = initialState;
			this.winner = getWinner(this.state);
			this.previewState = null;
			this.queue.publish(Events.SetState.with(this.state));
		});

		this.queue.publish(Events.SetState.with(this.state));
	}

	aiMove() {
		if (this.state.player === Player.One) return;
		const legalMoves = this.getLegalMoves();
		let bestMove: Move | null = null;
		let bestValue = -Infinity;
		for (const move of legalMoves) {
			const value = negamax(
				nextState(this.state, move),
				10,
				-Infinity,
				Infinity
			);
			if (value > bestValue) {
				bestValue = value;
				bestMove = move;
			}
		}
		if (bestMove !== null) {
			this.previewMove(bestMove);
			setTimeout(() => this.doMove(bestMove as Move), 500);
		}
	}

	getLegalMoves() {
		return getLegalMoves(this.state);
	}

	resetPreview() {
		this.queue.publish(Events.ResetPreviewMove);
		this.previewState = null;
		this.queue.publish(Events.SetPreviewState.with(this.previewState));
	}

	previewMove(move: Move) {
		this.queue.publish(Events.PreviewMove.with(move));
		this.previewState = nextState(this.state, move);
		this.queue.publish(Events.SetPreviewState.with(this.previewState));
	}

	doMove(move: Move) {
		this.resetPreview();
		this.queue.publish(Events.DoMove.with(move));
		this.state = nextState(this.state, move);
		this.winner = getWinner(this.state);
		this.queue.publish(Events.SetState.with(this.state));
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

	private createPreviewArrow() {
		const arrow = new PreviewArrow(this);
		this.svg.appendChild(arrow.element);
	}

	private createScoreLabels(): void {
		for (const player of [Player.One, Player.Two]) {
			const label = new ScoreLabel(this, player);
			this.svg.appendChild(label.element);
		}
	}

	private createEndOverlay() {
		const overlay = new EndOverlay(this);
		this.svg.appendChild(overlay.group);
	}
}
