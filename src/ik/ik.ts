import { mod, Vector2 } from "../math";

export class Bone {
	base: Vector2;
	length: number;
	angle: number;
	child: Bone | null;
	baseRotation: number;

	constructor(base: Vector2, length: number, angle?: number) {
		this.base = base;
		this.length = length;
		this.angle = mod(angle ?? 0, Math.PI * 2);
		this.child = null;
		this.baseRotation = 0;
	}

	addChild(length: number, angle?: number): Bone {
		this.child = new Bone(this.end, length, angle);
		this.child.baseRotation = this.baseRotation + this.angle;
		return this.child;
	}

	get end(): Vector2 {
		return this.base.add(
			Vector2.fromAngle(this.baseRotation + this.angle).mul(this.length)
		);
	}

	pointTo(target: Vector2): Vector2 {
		const localTarget = target.sub(this.base).rotate(-this.angle);

		const endPoint =
			this.child === null
				? new Vector2(this.length, 0)
				: this.child.pointTo(localTarget);
		this.rotate(localTarget.angle() - endPoint.angle());

		return endPoint.rotate(this.angle).add(this.base);
	}

	moveTo(base: Vector2): void {
		this.base = base;
		this.child?.moveTo(this.end);
	}

	rotate(angleDelta: number): void {
		this.setRotation(this.angle + angleDelta);
	}

	setRotation(angle: number): void {
		this.angle = angle;
		if (this.child) {
			this.child.baseRotation = this.baseRotation + this.angle;
			this.child?.moveTo(this.end);
		}
	}
}
