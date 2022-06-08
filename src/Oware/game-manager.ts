import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { AgentFunction, MinimaxAgent, RandomAgent } from "./agent";
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
	Result,
} from "./game";
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

	constructor(width: number, height: number) {
		this.queue = new EventQueue();
		this.size = new Vector2(width, height);
		this.state = initialState;
		this.previewState = null;
		this.svg = this.createSvg();
		this.cells = this.createCells();
		this.createPreviewArrow();
		this.createScoreLabels();
		this.createEndOverlay();

		// fjern kommentaren på linja under for å se om Minimax-agenten er bedre enn ren tilfeldighet!
		// this.setAgent(Player.One, RandomAgent);
		this.setAgent(Player.Two, MinimaxAgent);

		this.queue.subscribe(Events.ResetGame, () => {
			this.state = initialState;
			this.previewState = null;
			this.queue.publish(Events.SetState.with(this.state));
		});

		this.queue.publish(Events.SetState.with(this.state));
	}

	setAgent(player: Player, agent: AgentFunction) {
		this.queue.subscribe(Events.SetState, () => {
			const legalMoves = this.getLegalMoves();
			// agent aktiveres kun på sin tur hvis spillet ikke er ferdig og det finnes gyldige trekk
			if (
				this.getWinner() !== Result.NotFinished ||
				this.state.player !== player ||
				legalMoves.length === 0
			)
				return;
			// vi venter litt før vi gjør noe, det oppleves hyggeligere for menneskelig motspiller
			setTimeout(() => {
				const move = agent(this.state, getLegalMoves(this.state));
				// vi previewer move i et halvt sekund
				this.previewMove(move);
				setTimeout(() => {
					// sjekker at move fortsatt er gyldig før vi gjør det
					if (getLegalMoves(this.state).includes(move)) this.doMove(move);
				}, 500); // preview-tid i millisekunder
			}, 1000); // ventetid i millisekunder
		});
	}

	getLegalMoves() {
		return getLegalMoves(this.state);
	}

	getWinner() {
		return getWinner(this.state);
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
