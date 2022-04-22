interface Point {
	x: number;
	y: number;
}

const Point = (x: number, y: number): Point => ({ x, y });

const random = (min: number, max: number) => (max - min) * Math.random() + min;

const distanceBetween = (a: Point, b: Point) =>
	Math.hypot(b.x - a.x, b.y - a.y);

const NEIGHBORS = [
	[-2, -1],
	[-2, 0],
	[-2, 1],

	[-1, -2],
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[-1, 2],

	[0, -2],
	[0, -1],
	[0, 0],
	[0, 1],
	[0, 2],

	[1, -2],
	[1, -1],
	[1, 0],
	[1, 1],
	[1, 2],

	[2, -1],
	[2, 0],
	[2, 1],
];

export function poissonSamples(minX, maxX, minY, maxY, r, maxNumSamples, k) {
	const width = maxX - minX;
	const height = maxY - minY;
	const d = r / Math.sqrt(2);
	const backgroundGrid: number[][] = [];
	for (let i = 0; i <= Math.ceil(width / d); i++) {
		backgroundGrid.push(Array(Math.ceil(height / d) + 1));
	}
	const samples: Point[] = [];
	const activeList: number[] = [];

	function addSample(sample: Point) {
		samples.push(sample);
		const sampleIndex = samples.length - 1;
		activeList.push(sampleIndex);
		try {
			backgroundGrid[Math.floor((sample.x - minX) / d)][
				Math.floor((sample.y - minY) / d)
			] = sampleIndex;
		} catch {
			debugger;
		}
	}

	const x0 = Point(random(minX, maxX), random(minY, maxY));
	addSample(x0);
	while (
		activeList.length > 0 &&
		(maxNumSamples <= 0 || samples.length < maxNumSamples)
	) {
		const index = Math.floor(Math.random() * activeList.length);
		const sample = samples[activeList[index]];
		let succeded = false;
		console.log(samples.length);
		for (let i = 0; i < k; i++) {
			const angle = random(0, 2 * Math.PI);
			const dist = random(r, 2 * r);
			const newSample = Point(
				sample.x + dist * Math.cos(angle),
				sample.y + dist * Math.sin(angle)
			);
			if (
				newSample.x < minX ||
				newSample.x > maxX ||
				newSample.y < minY ||
				newSample.y > maxY
			) {
				continue;
			}
			const x = Math.floor((newSample.x - minX) / d);
			const y = Math.floor((newSample.y - minY) / d);
			let hasNeighbor = false;
			for (const [dx, dy] of NEIGHBORS) {
				const x1 = x + dx;
				const y1 = y + dy;
				if (
					x1 < 0 ||
					x1 >= backgroundGrid.length ||
					y1 < 0 ||
					y1 >= backgroundGrid[0].length
				) {
					continue;
				}
				const neighborIndex = backgroundGrid[x1][y1];
				if (neighborIndex !== undefined) {
					const neighbor = samples[neighborIndex];
					if (distanceBetween(newSample, neighbor) < r) {
						hasNeighbor = true;
						break;
					}
				}
			}
			if (!hasNeighbor) {
				addSample(newSample);
				succeded = true;
			}
		}
		if (!succeded) {
			activeList.splice(index, 1);
		}
	}
	return samples;
}
