import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { Events } from "./events";
import { Move } from "./game";
import { Manager } from "./game-manager";

export class PreviewArrow {
	manager: Manager;
	element: SVGPathElement;

	constructor(manager: Manager) {
		this.manager = manager;
		this.element = this.createPath();
		this.manager.queue.subscribe(Events.PreviewMove, (move) =>
			this.previewMove(move)
		);
		this.manager.queue.subscribe(Events.ResetPreviewMove, () =>
			this.element.setAttribute("d", "")
		);
	}

	previewMove(move: Move) {
		const offset = this.manager.radius * 1.5;
		const off2 = this.manager.radius * 0.1;
		const steps = this.manager.state.board[move];
		const queue: Vector2[] = [this.positionBy(move)];
		const visits = { top: 0, bottom: 0 };
		let current = move;
		for (let i = 1; i <= steps; i++) {
			current = ((move + i) % 12) as Move;
			if (current === 6) {
				queue.push(
					this.positionBy(5)
						.add(new Vector2(offset, 0))
						.add(new Vector2(visits.bottom, visits.bottom).mul(off2))
				);
				queue.push(
					this.positionBy(6)
						.add(new Vector2(offset, 0))
						.add(new Vector2(visits.bottom, -visits.top).mul(off2))
				);
				visits.bottom += 1;
			}
			if (current === 0) {
				queue.push(
					this.positionBy(11)
						.add(new Vector2(-offset, 0))
						.add(new Vector2(-visits.top, -visits.top).mul(off2))
				);
				queue.push(
					this.positionBy(0)
						.add(new Vector2(-offset, 0))
						.add(new Vector2(-visits.top, visits.bottom).mul(off2))
				);
				visits.top += 1;
			}
		}
		const target = ((move + steps) % 12) as Move;
		queue.push(
			this.positionBy(target).add(
				new Vector2(0, target < 6 ? visits.bottom : -visits.top).mul(off2)
			)
		);
		let length = 0;
		for (let i = 0; i < queue.length - 1; i++) {
			length += queue[i].distance(queue[i + 1]);
		}
		this.element.setAttribute(
			"d",
			`M ${queue.map((vec) => `${vec.x} ${vec.y}`).join(" L ")}`
		);
		this.element.style.strokeDasharray = String(length);
		this.element.animate(
			[{ strokeDashoffset: String(length) }, { strokeDashoffset: 0 }],
			{
				duration: Math.sqrt(length) * 10,
				fill: "forwards",
				iterations: 1,
				easing: "ease",
			}
		);
	}

	private positionBy(move: Move): Vector2 {
		const cellPosition = this.manager.cells[move].position;
		return cellPosition.add(
			new Vector2(
				0,
				move < 6 ? this.manager.radius * 1.5 : -this.manager.radius * 1.5
			)
		);
	}

	private createPath(): SVGPathElement {
		return createSvgElement("path", {
			stroke: "black",
			fill: "none",
		}) as SVGPathElement;
	}
}
