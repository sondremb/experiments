type ViewBoxString = `${number} ${number} ${number} ${number}`;

export class ViewBox {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;

	constructor(minX: number, minY: number, maxX: number, maxY: number);
	constructor(str: ViewBoxString);
	constructor(other: ViewBox);
	constructor(
		first: number | ViewBoxString | ViewBox,
		second?: number,
		third?: number,
		fourth?: number
	) {
		if (typeof first === "number") {
			if (
				typeof second === "number" &&
				typeof third === "number" &&
				typeof fourth === "number"
			) {
				this.minX = first;
				this.minY = second;
				this.maxX = third;
				this.maxY = fourth;
			} else {
				throw Error("wtf happened");
			}
		} else if (typeof first === "string") {
			const [minX, minY, width, height] = first
				.split(" ")
				.map((n) => parseFloat(n));
			this.minX = minX;
			this.minY = minY;
			this.maxX = minX + width;
			this.maxY = minY + height;
		} else {
			this.minX = first.minX;
			this.minY = first.minY;
			this.maxX = first.maxX;
			this.maxY = first.maxY;
		}
	}

	get width(): number {
		return this.maxX - this.minX;
	}

	get height(): number {
		return this.maxY - this.minY;
	}

	clone(): ViewBox {
		return new ViewBox(this);
	}

	isOutside(x: number, y: number): boolean {
		return x < this.minX || x > this.maxX || y < this.minY || y > this.maxY;
	}

	assign(x: number, y: number) {
		this.minX = Math.min(this.minX, x);
		this.maxX = Math.max(this.maxX, x);
		this.minY = Math.min(this.minY, y);
		this.maxY = Math.max(this.maxY, y);
	}
}
