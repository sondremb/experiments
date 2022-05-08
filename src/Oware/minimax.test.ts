import { initialState } from "./game";
import { negamax } from "./minimax";

// detects win by points
// detects loss by points
// detects draw by points
// detects win by no moves

test("I am speed", () => {
	const start = performance.now();
	negamax(initialState, 12, -Infinity, Infinity);
	const end = performance.now();
	console.log(`Took ${end - start}ms`);
});
