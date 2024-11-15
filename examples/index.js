const { range, inf, ninf } = require('../dist/all');

for (const num of range(5)) {
    console.log(num); // Output: 0, 1, 2, 3, 4
}

const indices = [...range(10)];
console.log(indices.map(x => x * 2)); // Output: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

const values = [];
for (const v of range(10, inf)) {
    values.push(v);
    if (v > 20) break;
}
console.log(values); // Output: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

for (const num of range(5, -1, -1)) {
    console.log(num); // Output: 5, 4, 3, 2, 1, 0
}

const negativeValues = [];
for (const v of range(-10, '-oo', -1)) {
    negativeValues.push(v);
    if (v < -20) break;
}
console.log(negativeValues); // Output: [-10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21]
