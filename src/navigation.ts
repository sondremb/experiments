import { createElement } from "./dom-utils";

export type NavigationCallback = (pathname: string) => void;
export class LinkFactory {
	callback: NavigationCallback;
	constructor(callback: NavigationCallback) {
		this.callback = callback;
	}

	createLink(
		url: string,
		text?: string,
		className?: string
	): HTMLAnchorElement {
		const element = createElement(
			"a",
			{ href: url },
			text
		) as HTMLAnchorElement;
		element.onclick = (e: MouseEvent) => {
			e.preventDefault();
			window.history.pushState({}, "", url);
			this.onNavigation();
		};
		if (className) element.className = className;
		return element;
	}

	onNavigation() {
		this.callback(window.location.pathname);
	}
}
