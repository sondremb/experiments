class Board {
    constructor() {
        this._board = {};
    }
    add(first, second) {
        let q, r;
        if (typeof first === "number") {
            if (second === undefined)
                throw Error("i fucking hate this");
            q = first;
            r = second;
        }
        else {
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
    has(first, second) {
        return this._get(first, second) === undefined;
    }
    get(first, second) {
        return this._get(first, second);
    }
    _get(first, second) {
        var _a;
        let q, r;
        if (typeof first === "number") {
            if (second === undefined)
                throw Error("i fucking hate this");
            q = first;
            r = second;
        }
        else {
            q = first.q;
            r = first.r;
        }
        return (_a = this._board[q]) === null || _a === void 0 ? void 0 : _a[r];
    }
}
const board = new Board();
function canLeave(piece) {
    const hex = piece.hex;
    if (hex.pieces.length > 1 && hex.pieces[0].id === piece.id)
        return true;
    // find first neighbor
    // flood fill from there
    // are all pieces hit?
    return true;
}
function canSlide(from, to) {
    const dir = to.sub(from);
    const cwDir = dir.rotateCW();
    const ccwDir = dir.rotateCCW();
    return board.has(from.add(cwDir)) || board.has(from.add(ccwDir));
}
export {};
