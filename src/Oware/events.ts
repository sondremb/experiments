import { createEvent } from "./event-queue";
import { GameState, Move } from "./game";

export const SetStateEvent = createEvent<GameState>("SET_STATE");
export const SetPreviewStateEvent = createEvent<GameState>("SET_PREVIEW_STATE");
export const PreviewMoveEvent = createEvent<Move>("PREVIEW_MOVE");
export const ResetPreviewMoveEvent = createEvent("RESET_PREVIEW_MOVE");
export const DoMoveEvent = createEvent("DO_MOVE");
export const ResetGameEvent = createEvent("RESET_GAME");
