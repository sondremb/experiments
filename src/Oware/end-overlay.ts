import { createSvgElement } from "../dom-utils";
import { Vector2 } from "../math";
import { Events } from "./events";
import { Player, Result, Winner } from "./game";
import { Manager } from "./game-manager";

export class EndOverlay {
	manager: Manager;
	group: SVGGElement;
	text: SVGTextElement;

	constructor(manager: Manager) {
		this.manager = manager;
		this.group = this.createGroup();
		this.text = this.createText();
		this.group.appendChild(this.text);
		this.group.appendChild(this.createButton());
		this.group.classList.add("hidden");

		this.manager.queue.subscribe(Events.SetState, () => {
			if (this.manager.winner === Result.NotFinished) {
				this.group.classList.add("hidden");
			} else {
				this.text.innerHTML = this.getTextForWinner(this.manager.winner);
				this.group.classList.remove("hidden");
			}
		});
	}

	private getTextForWinner(winner: Winner): string {
		switch (winner) {
			case Result.Draw:
				return "Det ble uavgjort!";
			case Player.One:
			case Player.Two:
				return `Spiller ${winner} vant!`;
			default:
				return "";
		}
	}

	private createGroup() {
		const group = createSvgElement("g") as SVGGElement;
		const overlay = createSvgElement("rect", {
			width: "100%",
			height: "100%",
			fill: "black",
			"fill-opacity": "0.7",
		});
		group.appendChild(overlay);
		return group;
	}

	private createText() {
		const text = createSvgElement("text", {
			x: String(this.manager.center.x),
			y: String(this.manager.center.y),
			"text-anchor": "middle",
			fill: "white",
			class: "text-9xl cursor-events-none",
		}) as SVGTextElement;
		text.innerHTML = "";
		return text;
	}

	private createButton(): SVGGElement {
		const buttonGroup = createSvgElement("g") as SVGGElement;
		const buttonSize = new Vector2(300, 70);
		const buttonCenter = this.manager.center.add(new Vector2(0, 80));
		const topleft = buttonCenter.sub(buttonSize.div(2));
		const buttonRect = createSvgElement("rect", {
			x: String(topleft.x),
			y: String(topleft.y),
			rx: "10",
			ry: "10",
			width: String(buttonSize.x),
			height: String(buttonSize.y),
			class:
				"cursor-pointer fill-emerald-900 hover:fill-emerald-800 origin-center transition-transform active:scale-105",
		}) as SVGRectElement;
		buttonRect.onclick = () => {
			this.manager.queue.publish(Events.ResetGame);
		};
		buttonGroup.appendChild(buttonRect);

		const buttonText = createSvgElement("text", {
			x: String(buttonCenter.x),
			y: String(buttonCenter.y),
			"text-anchor": "middle",
			fill: "white",
			class: "text-4xl translate-y-1/4 pointer-events-none",
		});
		buttonText.innerHTML = "Start på nytt";
		buttonGroup.appendChild(buttonText);

		return buttonGroup;
	}
}
