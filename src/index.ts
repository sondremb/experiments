import { createChild, removeAllChildren } from "./dom-utils";
import { AppFunction } from "./main";

export const mainPage: AppFunction = (mainDiv) => {
	removeAllChildren(mainDiv);
	const h2 = createChild(mainDiv, "h2", {});
	h2.innerHTML = "Dette er hovedsiden";
};
