import {
	GameState,
	getLegalMoves,
	getWinner,
	nextState,
	otherPlayer,
	Player,
	Result,
} from "./game";

export function negamax(
	node: GameState,
	depth: number,
	alpha: number,
	beta: number
): number {
	const winner = getWinner(node);
	if (depth <= 0 || winner !== Result.NotFinished) {
		return getHeuristicValue(node);
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

function getHeuristicValue(node: GameState): number {
	const winner = getWinner(node);
	if (winner === Player.One) return -50;
	if (winner === Player.Two) return 50;
	if (winner === Result.Draw) return 0;
	return node.points[Player.Two] - node.points[Player.One];
}
