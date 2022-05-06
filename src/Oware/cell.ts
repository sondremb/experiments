import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { Move } from "./game";
import { Manager } from "./game-manager";

export class Cell {
	manager: Manager;
	move: Move;
	position: Vector2;
	circle: SVGCircleElement;
	text: SVGTextElement;

	constructor(manager: Manager, move: Move) {
		this.manager = manager;
		this.move = move;
		this.position = this.getPosition();
		this.circle = this.createCircle();
		this.text = this.createText();
		this.updateState();
	}

	updateState() {
		if (this.manager.getLegalMoves().includes(this.move)) {
			this.circle.onmouseenter = () => {
				this.manager.previewMove(this.move);
			};
			this.circle.onclick = () => this.manager.doMove(this.move);
			this.circle.classList.add(
				"hover:fill-emerald-300",
				"cursor-pointer",
				"active:scale-110"
			);
		} else {
			this.circle.onmouseenter = null;
			this.circle.onclick = null;
			this.circle.classList.remove(
				"hover:fill-emerald-300",
				"cursor-pointer",
				"active:scale-110"
			);
		}
		this.text.innerHTML = String(this.manager.state.board[this.move]);
	}

	updatePreview() {
		if (
			this.manager.previewState === null ||
			this.previewValue === this.stateValue
		) {
			this.text.innerHTML = String(this.stateValue);
		} else {
			this.text.innerHTML = `${this.stateValue} ⟶  ${this.previewValue}`;
		}
	}

	get stateValue(): number {
		return this.manager.state.board[this.move];
	}

	get previewValue(): number | undefined {
		return this.manager.previewState?.board[this.move];
	}

	private getPosition(): Vector2 {
		const radius = this.manager.radius;
		const gap = this.manager.gap;
		const row = this.move < 6 ? 1 : 0;
		const col = this.move % 6;
		return new Vector2(
			this.manager.center.x +
				(row === 0 ? 5 - col : col) * (2 * radius + gap) -
				(2.5 * gap + 5 * radius),
			this.manager.center.y + row * (2 * radius + gap) - (radius + gap / 2)
		);
	}

	private createCircle(): SVGCircleElement {
		const element = createSvgElement("circle", {
			r: String(this.manager.radius),
			cx: String(this.position.x),
			cy: String(this.position.y),
			stroke: "black",
			class: "fill-transparent transition-transform origin-center",
		});
		element.onmouseleave = () => this.manager.resetPreview();
		return element as SVGCircleElement;
	}

	private createText(): SVGTextElement {
		const element = createSvgElement("text", {
			x: String(this.position.x),
			y: String(this.position.y),
			"text-anchor": "middle",
			stroke: "black",
		}) as SVGTextElement;
		element.innerHTML = String(this.manager.state.board[this.move]);
		return element;
	}
}
