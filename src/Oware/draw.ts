import { createChild } from "../dom-utils";
import { AppFunction } from "../main";
import { Manager } from "./game-manager";

export const oware: AppFunction = (mainDiv) => {
	document.title = "Oware";
	const flexDiv = createChild(mainDiv, "div", {
		class: "flex justify-center",
	});
	const centeredDiv = createChild(flexDiv, "div", {
		class: "max-w-5xl w-full mt-40",
	});
	const manager = new Manager(1280, 720);
	centeredDiv.appendChild(manager.svg);
};
