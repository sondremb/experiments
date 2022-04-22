export class Coord {
    constructor(q, r) {
        this.q = q;
        this.r = r;
    }
    get s() {
        return -this.q - this.r;
    }
    add(first, second) {
        if (typeof first === "number") {
            if (second === undefined)
                throw Error("lasdk");
            return new Coord(this.q + first, this.r + second);
        }
        return new Coord(this.q + first.q, this.r + first.r);
    }
    sub(first, second) {
        if (typeof first === "number") {
            if (second === undefined)
                throw Error("lasdk");
            return new Coord(this.q - first, this.r - second);
        }
        return new Coord(this.q - first.q, this.r - first.r);
    }
    rotateCW() {
        return new Coord(-this.r, -this.s);
    }
    rotateCCW() {
        return new Coord(-this.s, -this.q);
    }
    neighbors() {
        const directions = [
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
        ];
        return directions.map(([dq, dr]) => this.add(dq, dr));
    }
    toPixels(size) {
        return [
            (size * 3 * this.q) / 2,
            size * ((Math.sqrt(3) * this.q) / 2 + Math.sqrt(3) * this.r),
        ];
    }
}
