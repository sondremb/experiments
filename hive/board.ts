import { Coord } from "./hex.js";

interface Hex extends Coord {
	pieces: Piece[];
}

type PieceType = "Queen" | "Grasshopper" | "Beetle" | "Ant" | "Spider";

type Player = "Black" | "White";

class Board {
	_board: Record<number, Record<number, Hex>>;
	constructor() {
		this._board = {};
	}

	add(q: number, r: number): void;
	add(coord: Coord): void;
	add(first: number | Coord, second?: number): void {
		let q, r;
		if (typeof first === "number") {
			if (second === undefined) throw Error("i fucking hate this");
			q = first;
			r = second;
		} else {
			q = first.q;
			r = first.r;
		}
		if (!(q in this._board)) {
			this._board[q] = {};
		}
		if (!(r in this._board)) {
			this._board[q][r]; // TODO add
		}
	}

	has(q: number, r: number): boolean;
	has(coord: Coord): boolean;
	has(first: number | Coord, second?: number): boolean {
		return this._get(first, second) === undefined;
	}

	get(q: number, r: number): Hex | undefined;
	get(coord: Coord): Hex | undefined;
	get(first: number | Coord, second?: number): Hex | undefined {
		return this._get(first, second);
	}

	private _get(first: number | Coord, second?: number): Hex | undefined {
		let q, r;
		if (typeof first === "number") {
			if (second === undefined) throw Error("i fucking hate this");
			q = first;
			r = second;
		} else {
			q = first.q;
			r = first.r;
		}
		return this._board[q]?.[r];
	}
}
const board = new Board();

interface Piece {
	id: number;
	player: Player;
	type: PieceType;
	hex: Hex;
}

function canLeave(piece: Piece): boolean {
	const hex = piece.hex;
	if (hex.pieces.length > 1 && hex.pieces[0].id === piece.id) return true;
	// find first neighbor
	// flood fill from there
	// are all pieces hit?
	return true;
}

function canSlide(from: Coord, to: Coord): boolean {
	const dir = to.sub(from);
	const cwDir = dir.rotateCW();
	const ccwDir = dir.rotateCCW();
	return board.has(from.add(cwDir)) || board.has(from.add(ccwDir));
}
