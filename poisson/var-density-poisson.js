const Point = (x, y) => ({ x, y });
const random = (min, max) => (max - min) * Math.random() + min;
const distanceBetween = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
export function variableDensityPoisson(minX, maxX, minY, maxY, minDensity, maxDensity, densityFunction, maxNumSamples, k) {
    const width = maxX - minX;
    const height = maxY - minY;
    const gridSize = minDensity / Math.sqrt(2);
    const backgroundGrid = [];
    for (let i = 0; i <= Math.ceil(width / gridSize); i++) {
        backgroundGrid.push(Array(Math.ceil(height / gridSize) + 1));
    }
    const samples = [];
    const activeList = [];
    function addSample(sample) {
        samples.push(sample);
        const sampleIndex = samples.length - 1;
        activeList.push(sampleIndex);
        backgroundGrid[Math.floor((sample.x - minX) / gridSize)][Math.floor((sample.y - minY) / gridSize)] = sampleIndex;
    }
    function isLegalSample(sample) {
        if (sample.x < minX ||
            sample.x > maxX ||
            sample.y < minY ||
            sample.y > maxY) {
            return false;
        }
        const density = densityFunction(sample);
        const gridX = Math.floor((sample.x - minX) / gridSize);
        const gridY = Math.floor((sample.y - minY) / gridSize);
        const maxGridDistance = Math.ceil(density / gridSize);
        // TODO optimiser? sjekker mange ruter som ikke er nødvendige
        for (let x = Math.max(gridX - maxGridDistance, 0); x <= Math.min(gridX + maxGridDistance, backgroundGrid.length - 1); x++) {
            for (let y = Math.max(gridY - maxGridDistance, 0); y <= Math.min(gridY + maxGridDistance, backgroundGrid[0].length); y++) {
                const index = backgroundGrid[x][y];
                if (index !== undefined) {
                    const neighbor = samples[index];
                    if (distanceBetween(neighbor, sample) < density) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    const x0 = Point(random(minX, maxX), random(minY, maxY));
    addSample(x0);
    while (activeList.length > 0 &&
        (maxNumSamples <= 0 || samples.length < maxNumSamples)) {
        const index = Math.floor(Math.random() * activeList.length);
        const sample = samples[activeList[index]];
        const density = densityFunction(sample);
        let succeded = false;
        for (let i = 0; i < k; i++) {
            const angle = random(0, 2 * Math.PI);
            const dist = random(density, 2 * maxDensity);
            const newSample = Point(sample.x + dist * Math.cos(angle), sample.y + dist * Math.sin(angle));
            if (isLegalSample(newSample)) {
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
