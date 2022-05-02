import {
	GameState,
	getLegalMoves,
	initialState,
	nextState,
	Player,
} from "./game";

test("Initial state has all moves legal for P1", () => {
	const legalMoves = getLegalMoves(initialState);
	expect(legalMoves).toStrictEqual([0, 1, 2, 3, 4, 5]);
});

test("Captures on 2", () => {
	// arrange
	const state: GameState = {
		board: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
		points: {
			[Player.One]: 0,
			[Player.Two]: 0,
		},
		player: Player.One,
	};
	// act
	const newState = nextState(state, 5);
	// assert
	expect(newState.points[Player.One]).toBe(2);
	expect(newState.board[6]).toBe(0);
});

test("Captures on 3", () => {
	// arrange
	const state: GameState = {
		board: [0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0],
		points: {
			[Player.One]: 0,
			[Player.Two]: 0,
		},
		player: Player.One,
	};
	// act
	const newState = nextState(state, 5);
	// assert
	expect(newState.points[Player.One]).toBe(3);
	expect(newState.board[6]).toBe(0);
});

test("Chain capture", () => {
	// arrange
	const state: GameState = {
		board: [0, 0, 0, 0, 0, 4, 1, 2, 1, 2, 2, 2],
		points: {
			[Player.One]: 0,
			[Player.Two]: 0,
		},
		player: Player.One,
	};
	// act
	const newState = nextState(state, 5);
	// assert
	expect(newState.points[Player.One]).toBe(10);
	expect(newState.board).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2]);
});

test("Chain capture stop", () => {
	// arrange
	const state: GameState = {
		board: [0, 0, 0, 0, 0, 4, 3, 3, 1, 2, 2, 2],
		points: {
			[Player.One]: 0,
			[Player.Two]: 0,
		},
		player: Player.One,
	};
	// act
	const newState = nextState(state, 5);
	// assert
	expect(newState.points[Player.One]).toBe(5);
	expect(newState.board).toStrictEqual([0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 2, 2]);
});

test("Move must allow other player to move...", () => {
	// arrange
	const state: GameState = {
		board: [0, 0, 0, 0, 2, 4, 1, 1, 1, 1, 0, 0],
		points: {
			[Player.One]: 0,
			[Player.Two]: 0,
		},
		player: Player.One,
	};
	// act
	const legalMoves = getLegalMoves(state);
	// assert
	expect(legalMoves).not.toContain(5);
});

test("... unless that is not possible", () => {
	// arrange
	const state: GameState = {
		board: [0, 0, 0, 0, 5, 4, 1, 1, 1, 1, 0, 0],
		points: {
			[Player.One]: 0,
			[Player.Two]: 0,
		},
		player: Player.One,
	};
	// act
	const legalMoves = getLegalMoves(state);
	// assert
	expect(legalMoves).toContain(5);
	expect(legalMoves).toContain(4);
});

test("Does not self-capture", () => {
	// arrange
	const state: GameState = {
		board: [1, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0],
		points: {
			[Player.One]: 0,
			[Player.Two]: 0,
		},
		player: Player.One,
	};
	// act
	const newState = nextState(state, 5);
	// assert
	expect(newState.board[0]).toBe(2);
	expect(newState.points[Player.One]).toBe(0);
	expect(newState.points[Player.Two]).toBe(0);
});
