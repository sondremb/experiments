export class EventQueue {
	private subscribers: Record<string, Function[]>;

	constructor() {
		this.subscribers = {};
	}

	subscribe<T>(event: EventConstructor<T>, callback: (value: T) => void) {
		if (!(event.kind in this.subscribers)) {
			this.subscribers[event.kind] = [];
		}
		this.subscribers[event.kind].push(callback);
	}

	publish<T>(event: Event<T>) {
		if (event.kind in this.subscribers) {
			this.subscribers[event.kind].forEach((f) => f(event.value));
		}
	}
}

interface EventConstructor<T> {
	kind: string;
	with: (value: T) => Event<T>;
	without: () => Event<never>;
}

interface Event<T> {
	kind: string;
	value?: T;
}

export function createEvent<T>(kind: string): EventConstructor<T> {
	return {
		kind,
		with: (value: T) => ({ kind, value }),
		without: () => ({ kind }),
	};
}
