export class ViewBox {
    constructor(first, second, third, fourth) {
        if (typeof first === "number") {
            if (typeof second === "number" &&
                typeof third === "number" &&
                typeof fourth === "number") {
                this.minX = first;
                this.minY = second;
                this.maxX = third;
                this.maxY = fourth;
            }
            else {
                throw Error("wtf happened");
            }
        }
        else if (typeof first === "string") {
            const [minX, minY, width, height] = first
                .split(" ")
                .map((n) => parseFloat(n));
            this.minX = minX;
            this.minY = minY;
            this.maxX = minX + width;
            this.maxY = minY + height;
        }
        else {
            this.minX = first.minX;
            this.minY = first.minY;
            this.maxX = first.maxX;
            this.maxY = first.maxY;
        }
    }
    get width() {
        return this.maxX - this.minX;
    }
    get height() {
        return this.maxY - this.minY;
    }
    clone() {
        return new ViewBox(this);
    }
    isOutside(x, y) {
        return x < this.minX || x > this.maxX || y < this.minY || y > this.maxY;
    }
    assign(x, y) {
        this.minX = Math.min(this.minX, x);
        this.maxX = Math.max(this.maxX, x);
        this.minY = Math.min(this.minY, y);
        this.maxY = Math.max(this.maxY, y);
    }
}
