import { mod, Vector2 } from "../math.js";
export class Bone {
	constructor(base, length, angle) {
		this.base = base;
		this.length = length;
		this.angle = mod(
			angle !== null && angle !== void 0 ? angle : 0,
			Math.PI * 2
		);
		this.child = null;
	}
	addChild(length, angle) {
		this.child = new Bone(this.end, length, angle);
		return this.child;
	}
	get end() {
		return this.base.add(Vector2.fromAngle(this.angle).mul(this.length));
	}
	pointTo(target) {
		const localTarget = target.sub(this.base).rotate(-this.angle);
		const endPoint =
			this.child === null
				? new Vector2(this.length, 0)
				: this.child.pointTo(localTarget);
		this.rotate(localTarget.angle() - endPoint.angle());
		return endPoint.rotate(this.angle).add(this.base);
	}
	moveTo(base) {
		var _a;
		this.base = base;
		(_a = this.child) === null || _a === void 0 ? void 0 : _a.moveTo(this.end);
	}
	rotate(angleDelta) {
		this.setRotation(this.angle + angleDelta);
	}
	setRotation(angle) {
		var _a;
		this.angle = angle;
		(_a = this.child) === null || _a === void 0 ? void 0 : _a.moveTo(this.end);
	}
}
