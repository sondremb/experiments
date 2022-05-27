export class EventQueue {
	private subscribers: Record<string, Function[]>;

	constructor() {
		this.subscribers = {};
	}

	subscribe<T>(event: EventBuilder<T>, callback: (value: T) => void) {
		if (!(event.kind in this.subscribers)) {
			this.subscribers[event.kind] = [];
		}
		this.subscribers[event.kind].push(callback);
	}

	publish<T>(event: Event<T>): void;
	publish<T>(event: EventBuilder<T>): void;
	publish<T>(event: Event<T> | EventBuilder<T>): void {
		if (event.kind in this.subscribers) {
			this.subscribers[event.kind].forEach((f) => {
				if (isEvent(event)) {
					f(event.value);
				} else {
					f();
				}
			});
		}
	}
}

function isEvent<T>(event: Event<T> | EventBuilder<T>): event is Event<T> {
	return (event as Event<T>).value !== undefined;
}

interface EventBuilder<T> {
	kind: string;
	with: (value: T) => Event<T>;
}

interface Event<T> {
	kind: string;
	value: T;
}

export function createEvent<T>(kind: string): EventBuilder<T> {
	return {
		kind,
		with: (value: T) => ({ kind, value }),
	};
}
