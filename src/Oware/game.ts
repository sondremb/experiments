export enum Player {
	One = 1,
	Two = 2,
}

export enum Result {
	NotFinished = 3,
	Draw = 4,
}

export type Winner = Player | Result;

export const otherPlayer = (player: Player): Player =>
	player === Player.One ? Player.Two : Player.One;

const cellBelongsToPlayer = (player: Player, move: Move): boolean =>
	player === Player.One ? move < 6 : move >= 6;

const cellsForPlayer = (player: Player): Move[] =>
	player === Player.One ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];

export interface GameState {
	board: number[];
	points: Record<Player, number>;
	player: Player;
}
export const initialState: GameState = {
	board: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	points: {
		[Player.One]: 0,
		[Player.Two]: 0,
	},
	player: Player.One,
};

export type Move = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

enum Legality {
	Yes,
	Maybe,
	No,
}

const isLegalMove = (state: GameState, move: Move): Legality => {
	if (!cellBelongsToPlayer(state.player, move)) return Legality.No;
	if (state.board[move] === 0) return Legality.No;
	const newState = nextState(state, move);
	if (
		cellsForPlayer(newState.player).every((move) => newState.board[move] === 0)
	) {
		return Legality.Maybe;
	}
	return Legality.Yes;
};

export const nextState = (state: GameState, move: Move): GameState => {
	const { player } = state;
	const opponent = otherPlayer(player);
	const newBoard = [...state.board];
	newBoard[move] = 0;
	for (let i = 1; i <= state.board[move]; i++) {
		newBoard[(move + i) % 12] += 1;
	}
	let cell = ((move + state.board[move]) % 12) as Move;
	let newPoints = 0;
	while (
		cellBelongsToPlayer(opponent, cell) &&
		(newBoard[cell] === 2 || newBoard[cell] === 3)
	) {
		newPoints += newBoard[cell];
		newBoard[cell] = 0;
		cell = ((cell - 1) % 12) as Move;
	}
	return {
		player: opponent,
		board: newBoard,
		// @ts-ignore ts skjønner ikke at player og opponent er et fullstendig sett av Player
		points: {
			[opponent]: state.points[opponent],
			[player]: state.points[player] + newPoints,
		},
	};
};

export const getLegalMoves = (state: GameState): Move[] => {
	const moves = cellsForPlayer(state.player).map((move) => ({
		move,
		legality: isLegalMove(state, move),
	}));
	if (moves.some((m) => m.legality === Legality.Yes)) {
		return moves.filter((m) => m.legality === Legality.Yes).map((m) => m.move);
	}
	return moves.filter((m) => m.legality === Legality.Maybe).map((m) => m.move);
};

export const getWinner = (state: GameState): Player | Result => {
	const p1Points = state.points[Player.One];
	const p2Points = state.points[Player.Two];
	if (p1Points > 24 || p2Points > 24) {
		if (p1Points > p2Points) return Player.One;
		if (p1Points < p2Points) return Player.Two;
		// det skal ikke være mulig at begge to kommer seg over 24, men for sikkerhets skyld:
		return Result.Draw;
	}
	if (p1Points === 24 && p2Points === 24) return Result.Draw;
	if (getLegalMoves(state).length === 0) return otherPlayer(state.player);
	return Result.NotFinished;
};

export const isValidState = (state: GameState): boolean => {
	return (
		state.points[Player.One] +
			state.points[Player.Two] +
			state.board.reduce((prev, curr) => prev + curr, 0) ===
		48
	);
};
