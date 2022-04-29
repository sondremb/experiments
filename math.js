export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(rhs) {
        if (typeof rhs === "number") {
            return new Vector2(this.x + rhs, this.y + rhs);
        }
        return new Vector2(this.x + rhs.x, this.y + rhs.y);
    }
    sub(rhs) {
        if (typeof rhs === "number") {
            return new Vector2(this.x - rhs, this.y - rhs);
        }
        return new Vector2(this.x - rhs.x, this.y - rhs.y);
    }
    mul(num) {
        return new Vector2(this.x * num, this.y * num);
    }
    div(num) {
        return new Vector2(this.x / num, this.y / num);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    length() {
        return Math.hypot(this.x, this.y);
    }
    normalize() {
        return this.div(this.length());
    }
    distance(other) {
        return Math.hypot(other.x - this.x, other.y - this.y);
    }
    rotate(angle) {
        return new Vector2(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
    }
    rotateDeg(angle) {
        return this.rotate(degToRad(angle));
    }
    angle() {
        return Math.atan(this.y / this.x);
    }
    static fromAngle(angle) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }
}
export function radToDeg(rad) {
    return (rad * 180) / Math.PI;
}
export function degToRad(deg) {
    return (deg * Math.PI) / 180;
}
export function lerp(t, from, to) {
    if (typeof from === "number" && typeof to === "number") {
        return from + t * (to - from);
    }
    else if (typeof from === "object" && typeof to === "object") {
        return new Vector2(lerp(t, from.x, to.x), lerp(t, from.y, to.y));
    }
}
export function mod(num, modulus) {
    return ((num % modulus) + modulus) % modulus;
}
