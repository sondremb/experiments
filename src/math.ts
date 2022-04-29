export class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Vector2): Vector2;
	add(num: number): Vector2;
	add(rhs: Vector2 | number): Vector2 {
		if (typeof rhs === "number") {
			return new Vector2(this.x + rhs, this.y + rhs);
		}
		return new Vector2(this.x + rhs.x, this.y + rhs.y);
	}

	sub(other: Vector2): Vector2;
	sub(num: number): Vector2;
	sub(rhs: Vector2 | number): Vector2 {
		if (typeof rhs === "number") {
			return new Vector2(this.x - rhs, this.y - rhs);
		}
		return new Vector2(this.x - rhs.x, this.y - rhs.y);
	}

	mul(num: number): Vector2 {
		return new Vector2(this.x * num, this.y * num);
	}

	div(num: number): Vector2 {
		return new Vector2(this.x / num, this.y / num);
	}

	dot(other: Vector2): number {
		return this.x * other.x + this.y * other.y;
	}

	length(): number {
		return Math.hypot(this.x, this.y);
	}

	normalize(): Vector2 {
		return this.div(this.length());
	}

	distance(other: Vector2): number {
		return Math.hypot(other.x - this.x, other.y - this.y);
	}

	rotate(angle: number): Vector2 {
		return new Vector2(
			this.x * Math.cos(angle) - this.y * Math.sin(angle),
			this.x * Math.sin(angle) + this.y * Math.cos(angle)
		);
	}

	rotateDeg(angle: number): Vector2 {
		return this.rotate(degToRad(angle));
	}

	angle(): number {
		return Math.atan(this.y / this.x);
	}

	static fromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle));
	}
}

export function radToDeg(rad: number) {
	return (rad * 180) / Math.PI;
}

export function degToRad(deg: number) {
	return (deg * Math.PI) / 180;
}

export function lerp(t: number, from: Vector2, to: Vector2): Vector2;
export function lerp(t: number, from: number, to: number): number;
export function lerp(t: number, from: Vector2 | number, to: Vector2 | number) {
	if (typeof from === "number" && typeof to === "number") {
		return from + t * (to - from);
	} else if (typeof from === "object" && typeof to === "object") {
		return new Vector2(lerp(t, from.x, to.x), lerp(t, from.y, to.y));
	}
	throw Error(
		`Unabled to lerp between values of type ${typeof from} and ${typeof to}`
	);
}

export function mod(num: number, modulus: number) {
	return ((num % modulus) + modulus) % modulus;
}
