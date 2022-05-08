import { createElement } from "./dom-utils";

export type NavigationCallback = (pathname: string) => void;
export class LinkFactory {
	callback: NavigationCallback;
	constructor(callback: NavigationCallback) {
		this.callback = callback;
	}

	createLink(url: string, text: string) {
		const element = createElement("a", { href: url }, text);
		element.onclick = (e: MouseEvent) => {
			e.preventDefault();
			window.history.pushState({}, "", url);
			this.onNavigation();
		};
		return element;
	}

	onNavigation() {
		this.callback(window.location.pathname);
	}
}
