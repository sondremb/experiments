type TagName = keyof HTMLElementTagNameMap;

type AttributeMap = Record<string, string>;

export function removeAllChildren(element: HTMLElement): void {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

export function setAttributes(
	element: HTMLElement | SVGElement,
	attributes: AttributeMap
): void {
	for (const [attribute, value] of Object.entries(attributes)) {
		element.setAttribute(attribute, value);
	}
}

export function createElement(
	tag: TagName,
	attributes?: AttributeMap,
	innerHtml?: string
): HTMLElement {
	const element = document.createElement(tag);
	if (attributes) setAttributes(element, attributes);
	if (innerHtml) element.innerHTML = innerHtml;
	return element;
}

export function createSvgElement(
	tag: string,
	attributes?: AttributeMap
): SVGElement {
	const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
	if (attributes) setAttributes(element, attributes);
	return element;
}

export function createChild(
	parent: HTMLElement,
	tag: TagName,
	attributes?: AttributeMap,
	innerHtml?: string
): HTMLElement {
	const element = createElement(tag, attributes, innerHtml);
	parent.appendChild(element);
	return element;
}
