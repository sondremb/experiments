// Ken Perlins originale permutasjonstabell - alle tallene fra 0 til 255 i tilfeldig rekkefølge,
// gjentatt to ganger
const P = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
    75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
    149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
    27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
    92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
    209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
    164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
    147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
    28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
    155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
    178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
    191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
    181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
    61, 156, 180,
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
    75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
    149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
    27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
    92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
    209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
    164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
    147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
    28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
    155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
    178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
    191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
    181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
    61, 156, 180,
];
export function octavePerlin(x, y, octaves, persistance, repeat) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        total += perlin2d(x * frequency, y * frequency, repeat) * amplitude;
        maxValue += amplitude;
        amplitude *= persistance;
        frequency *= 2;
    }
    return total / maxValue;
}
export function OctavePerlinGenerator(octaves, persistance, repeat) {
    return (x, y) => octavePerlin(x, y, octaves, persistance, repeat);
}
const mod = (num, mod) => ((num % mod) + mod) % mod;
export function perlin2d(x, y, repeat) {
    if (repeat !== undefined) {
        x = mod(x, repeat);
        y = mod(y, repeat);
    }
    // finner nærmeste heltall under x og y
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    // finer x % 1 og y % 1
    const xf = x - xi;
    const yf = y - yi;
    const inc = (num) => {
        return repeat === undefined ? num + 1 : mod(num + 1, repeat);
    };
    // hash-verdier, basert på permutasjonstabellen
    const aa = P[xi + P[yi]];
    const ab = P[xi + P[inc(yi)]];
    const ba = P[inc(xi) + P[yi]];
    const bb = P[inc(xi) + P[inc(yi)]];
    // hentet fra https://stackoverflow.com/a/17351156
    // tar imot en hashverdig og to tall x og y
    // basert på hash-verdien, velg en vektor fra følgende:
    // [-1, -1], [-1, 1], [1, -1] og [1, 1]
    // returner prikkproduktet (a.x * b.x + a.y * b.y) mellom den valgte vektoren og [x, y]
    const grad = (hash, x, y) => {
        return (hash & 1 ? x : -x) + (hash & 2 ? y : -y);
    };
    // finner prikkproduktet mellom tilfeldig vektor og distansevektor for alle fire hjørner
    const x0y0 = grad(aa, xf, yf);
    const x0y1 = grad(ab, xf, yf - 1);
    const x1y0 = grad(ba, xf - 1, yf);
    const x1y1 = grad(bb, xf - 1, yf - 1);
    // smoothing-funksjon, også fra Ken Perlin
    // tilsvarer 6t^5 - 15t^4 + 10t^3
    const fade = (t) => t * t * t * (10 + t * (6 * t - 15));
    // smoother xf og yf til bruk som interpoleringsfaktor
    const u = fade(xf);
    const v = fade(yf);
    // interpoler en verdi midt mellom de fire hjørneverdiene
    const y0 = lerp(x0y0, x1y0, u);
    const y1 = lerp(x0y1, x1y1, u);
    const val = lerp(y0, y1, v);
    // verdi er nå i domene [-1, -1], normaliser til [0, 1]
    return (val + 1) / 2;
}
const lerp = (a, b, t) => {
    return a + t * (b - a);
};
