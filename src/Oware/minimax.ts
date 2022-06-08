import {
	GameState,
	getLegalMoves,
	getWinner,
	nextState,
	otherPlayer,
	Player,
	Result,
} from "./game";

type Heuristic = (node: GameState) => number;

// implementasjon av negamax med alpha-beta-pruning
// https://en.wikipedia.org/wiki/Negamax#Negamax_with_alpha_beta_pruning
export function negamax(
	node: GameState,
	depth: number,
	alpha: number,
	beta: number
): number {
	const winner = getWinner(node);
	if (depth <= 0 || winner !== Result.NotFinished) {
		return heuristic(node);
	}

	const legalMoves = getLegalMoves(node);
	let value = -Infinity;
	for (const move of legalMoves) {
		value = Math.max(
			value,
			-negamax(nextState(node, move), depth - 1, -beta, -alpha)
		);
		alpha = Math.max(alpha, value);
		if (alpha >= beta) break;
	}
	return value;
}

const heuristic: Heuristic = (node: GameState): number => {
	const player = node.player;
	const opponent = otherPlayer(player);
	const winner = getWinner(node);
	if (winner === player) return -50;
	if (winner === opponent) return 50;
	if (winner === Result.Draw) return 0;
	return node.points[opponent] - node.points[player];
};
