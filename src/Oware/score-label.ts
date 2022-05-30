import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { Events } from "./events";
import { Player } from "./game";
import { Manager } from "./game-manager";

export class ScoreLabel {
	manager: Manager;
	player: Player;
	position: Vector2;
	element: SVGTextElement;

	constructor(manager: Manager, player: Player) {
		this.manager = manager;
		this.player = player;
		this.position = this.manager.center.add(
			new Vector2(0, this.manager.radius * 3 + this.manager.gap).mul(
				this.player === Player.One ? 1 : -1
			)
		);
		this.element = this.createElement();

		this.manager.queue.subscribe(Events.SetState, () => this.updateState());
		this.manager.queue.subscribe(Events.SetPreviewState, () =>
			this.updateState()
		);
	}

	private createElement(): SVGTextElement {
		return createSvgElement("text", {
			x: String(this.position.x),
			y: String(this.position.y),
			"text-anchor": "middle",
			stroke: "black",
		}) as SVGTextElement;
	}

	updateState() {
		const statePoints = this.manager.state.points[this.player];
		const previewPoints = this.manager.previewState?.points[this.player];
		const text =
			previewPoints === statePoints || previewPoints === undefined
				? String(statePoints)
				: `${statePoints} ⟶  ${previewPoints}`;
		this.element.innerHTML = text;
	}
}
