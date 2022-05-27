import { mainPage } from ".";
import { createChild, removeAllChildren } from "./dom-utils";
import { LinkFactory } from "./navigation";
import { oware } from "./Oware/draw";
import { perlinCircle } from "./perlin/circle";

function main() {
	const pages: Record<string, AppFunction> = {
		"/": mainPage,
		"/oware": oware,
		"/circle": perlinCircle,
	};
	const appDiv = document.getElementById("app") as HTMLDivElement;

	const linkFactory = new LinkFactory((pathname) => {
		if (pathname in pages) {
			removeAllChildren(appDiv);
			pages[pathname](appDiv);
		}
	});
	const header = document.getElementById("header");
	header?.appendChild(headerLink("/", "Home"));
	header?.appendChild(headerLink("/oware", "Oware"));
	header?.appendChild(headerLink("/circle", "Circle"));

	linkFactory.onNavigation();

	function headerLink(url: string, text: string): HTMLAnchorElement {
		const anchor = linkFactory.createLink(url);
		anchor.classList.add(
			"text-white",
			"align-middle",
			"hover:bg-emerald-600",
			"px-2",
			"text-lg",
			"flex",
			"items-center"
		);
		createChild(anchor, "span", {}, text);
		return anchor;
	}
}

export type AppFunction = (appDiv: HTMLDivElement) => void;

main();
