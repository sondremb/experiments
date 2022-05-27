import { createEvent, EventQueue } from "./event-queue";

const NumberEvent = createEvent<number>("NUMBER");
const StringEvent = createEvent<string>("STRING");
const EmptyEvent = createEvent("EMPTY");

test("testnavn er vanskelig", () => {
	const queue = new EventQueue();

	const numberCallback = jest.fn((_: number) => {});
	const stringCallback = jest.fn((_: string) => {});
	const emptyCallback = jest.fn(() => {});

	queue.subscribe(NumberEvent, numberCallback);
	queue.subscribe(StringEvent, stringCallback);
	queue.subscribe(EmptyEvent, emptyCallback);

	queue.publish(NumberEvent.with(42));
	queue.publish(StringEvent.with("Test"));
	queue.publish(EmptyEvent);

	expect(numberCallback.mock.calls.length).toBe(1);
	expect(numberCallback.mock.calls[0][0]).toBe(42);
	expect(stringCallback.mock.calls.length).toBe(1);
	expect(stringCallback.mock.calls[0][0]).toBe("Test");
});
