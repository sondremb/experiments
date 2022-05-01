import { createElement } from "./dom-utils";

console.table(window.location.pathname);

export {};

const realLink = createElement("a", { href: "/real" }, "Real");
const fakeLink = createElement("a", { href: "/fake" }, "Fake");
fakeLink.onclick = navigateTo("/fake");

const div = document.getElementById("app");
div?.appendChild(realLink);
div?.appendChild(fakeLink);

const onUrlChanged = () => {
	console.log(window.location.pathname);
};

export function navigateTo(url: string) {
	return (e: MouseEvent) => {
		e.preventDefault();
		window.history.pushState({}, "", url);
		onUrlChanged();
	};
}
