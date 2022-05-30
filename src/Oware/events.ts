import { createEvent } from "./event-queue";
import { GameState, Move } from "./game";

export const Events = {
	SetState: createEvent<GameState>("SET_STATE"),
	SetPreviewState: createEvent<GameState | null>("SET_PREVIEW_STATE"),
	PreviewMove: createEvent<Move>("PREVIEW_MOVE"),
	ResetPreviewMove: createEvent("RESET_PREVIEW_MOVE"),
	DoMove: createEvent("DO_MOVE"),
	ResetGame: createEvent("RESET_GAME"),
};
