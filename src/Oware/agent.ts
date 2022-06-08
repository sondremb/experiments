import { GameState, Move, nextState } from "./game";
import { negamax } from "./minimax";

export type AgentFunction = (state: GameState, legalMoves: Move[]) => Move;

export const MinimaxAgent: AgentFunction = (state, legalMoves) => {
	let bestMove: Move | null = null;
	let bestValue = -Infinity;
	for (const move of legalMoves) {
		const value = negamax(nextState(state, move), 10, -Infinity, Infinity);
		if (value > bestValue) {
			bestValue = value;
			bestMove = move;
		}
	}
	if (bestMove === null) {
		throw Error("Fant ingen trekk - dette skal ikke være mulig");
	}
	return bestMove;
};

export const RandomAgent: AgentFunction = (_, legalMoves) => {
	return legalMoves[Math.floor(Math.random() * legalMoves.length)];
};
