import { mainPage } from ".";
import { removeAllChildren } from "./dom-utils";
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
	header?.appendChild(linkFactory.createLink("/", "Home"));
	header?.appendChild(linkFactory.createLink("/oware", "Oware"));
	header?.appendChild(linkFactory.createLink("/circle", "Circle"));

	linkFactory.onNavigation();
}

export type AppFunction = (appDiv: HTMLDivElement) => void;

main();
