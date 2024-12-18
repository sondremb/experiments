import { createSvgElement, setAttributes } from "../dom-utils";
import { Vector2 } from "../math";
import { Events } from "./events";
import { Move } from "./game";
import { Manager } from "./game-manager";

export class Cell {
	manager: Manager;
	move: Move;
	position: Vector2;
	group: SVGGElement;
	circle: SVGCircleElement;
	text: SVGTextElement;

	seedGroup: SVGGElement;

	constructor(manager: Manager, move: Move) {
		this.manager = manager;
		this.move = move;
		this.position = this.getPosition();
		this.group = this.createGroup();
		this.circle = this.createCircle();
		this.seedGroup = this.createSeeds();
		this.text = this.createText();

		this.manager.queue.subscribe(Events.SetState, () => this.updateState());
		this.manager.queue.subscribe(Events.SetPreviewState, () => {
			this.updateSeeds();
			this.updateText();
		});
	}

	updateState() {
		if (this.manager.getLegalMoves().includes(this.move)) {
			this.circle.onmouseenter = () => {
				this.manager.previewMove(this.move);
			};
			this.circle.onclick = () => this.manager.doMove(this.move);
			this.circle.classList.add(
				"hover:fill-slate-200",
				"cursor-pointer",
				"active:scale-110"
			);
		} else {
			this.circle.onmouseenter = null;
			this.circle.onclick = null;
			this.circle.classList.remove(
				"hover:fill-slate-200",
				"cursor-pointer",
				"active:scale-110"
			);
		}
		this.updateSeeds();
		this.updateText();
	}

	updateText() {
		let text = "";
		if (
			this.manager.previewState === null ||
			this.previewValue === this.stateValue
		) {
			if (this.stateValue >= 9) {
				text = String(this.stateValue);
			}
		} else {
			text = `${this.stateValue} ⟶  ${this.previewValue}`;
		}
		this.text.innerHTML = text;
	}

	get stateValue(): number {
		return this.manager.state.board[this.move];
	}

	get previewValue(): number | undefined {
		return this.manager.previewState?.board[this.move];
	}

	get seedCount(): number {
		return this.seedGroup.children.length;
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

	private createGroup(): SVGGElement {
		return createSvgElement("g") as SVGGElement;
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
		this.group.appendChild(element);
		return element as SVGCircleElement;
	}

	private createText(): SVGTextElement {
		const element = createSvgElement("text", {
			x: String(this.position.x),
			y: String(this.position.y),
			"text-anchor": "middle",
			"stroke-width": "1.5",
			class:
				"pointer-events-none text-3xl translate-y-1/4 font-bold fill-white stroke-black",
		}) as SVGTextElement;
		element.innerHTML = String(this.manager.state.board[this.move]);
		this.group.appendChild(element);
		return element;
	}

	private createSeeds(): SVGGElement {
		const group = createSvgElement("g") as SVGGElement;
		this.group.appendChild(group);
		return group;
	}

	private updateSeeds(): void {
		const target = Math.max(
			0,
			Math.min(Math.max(this.stateValue, this.previewValue ?? 0), 9)
		);
		while (this.seedCount > target && this.seedGroup.lastChild) {
			this.seedGroup.removeChild(this.seedGroup.lastChild);
		}
		while (this.seedCount < target) {
			this.seedGroup.appendChild(this.createSeed());
		}
		for (let i = 0; i < this.seedCount; i++) {
			const isPreview = i >= this.stateValue || this.previewValue === 0;
			const seed: SVGCircleElement = this.seedGroup.children.item(
				i
			) as SVGCircleElement;
			const offset = this.getSeedOffsetPosition(this.seedCount, i);
			setAttributes(seed, {
				transform: `translate(${offset.x}, ${offset.y})`,
				fill: isPreview ? "none" : "black",
				"stroke-dasharray": isPreview ? "10" : "",
			});
		}
	}

	private createSeed(): SVGCircleElement {
		return createSvgElement("circle", {
			r: String(this.manager.radius / 4),
			fill: "black",
			stroke: "black",
			cx: String(this.position.x),
			cy: String(this.position.y),
			class: "transition-transform pointer-events-none",
		}) as SVGCircleElement;
	}

	private getSeedOffsetPosition(count: number, index: number): Vector2 {
		const circle = (_count: number, _index: number) =>
			Vector2.fromAngle((_index * Math.PI * 2) / _count).mul(
				this.manager.radius / 1.5
			);
		const circleWithCenter = () => {
			if (index === 0) return new Vector2(0, 0);
			return circle(count - 1, index - 1);
		};

		switch (count) {
			case 1:
			case 6:
			case 7:
			case 8:
			case 9:
				return circleWithCenter();
			default:
				return circle(count, index);
		}
	}
}
