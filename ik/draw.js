import { Vector2 } from "../math.js";
import { Bone } from "./ik.js";
function main() {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const baseBone = new Bone(new Vector2(400, 400), 100);
	baseBone.addChild(100);
	// https://stackoverflow.com/a/17130415
	function getMousePos(evt) {
		const rect = canvas.getBoundingClientRect(); // abs. size of element
		const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for x
		const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for y
		return new Vector2(
			(evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
			(evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
		);
	}
	function onMouseMove(evt) {
		const mousePos = getMousePos(evt);
		console.log(mousePos);
		baseBone.pointTo(mousePos);
		baseBone.pointTo(mousePos);
		baseBone.pointTo(mousePos);
		baseBone.pointTo(mousePos);
		baseBone.pointTo(mousePos);
	}
	canvas.addEventListener("mousemove", onMouseMove);
	function draw() {
		if (ctx === null) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		let bone = baseBone;
		ctx.beginPath();
		ctx.moveTo(bone.base.x, bone.base.y);
		while (bone !== null) {
			ctx.lineTo(bone.end.x, bone.end.y);
			bone = bone.child;
		}
		ctx.stroke();
		window.requestAnimationFrame(draw);
	}
	window.requestAnimationFrame(draw);
}
main();