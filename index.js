// Required libraries for file handling and large number arithmetic
const fs = require("fs");
const bigInt = require("big-integer");


function findSecretWithLagrange(points, k, atX) {
  let secret = bigInt.zero;

  // We only need 'k' points to define the polynomial uniquely.
  for (let i = 0; i < k; i++) {
    const xi = points[i].x;
    const yi = points[i].y;

    let numerator = bigInt.one;
    let denominator = bigInt.one;

    for (let j = 0; j < k; j++) {
      // The basis polynomial construction requires skipping the case where i === j
      if (i === j) {
        continue;
      }

      const xj = points[j].x;
      
      // Numerator term: (atX - xj)
      numerator = numerator.multiply(atX.subtract(xj));
      
      // Denominator term: (xi - xj)
      denominator = denominator.multiply(xi.subtract(xj));
    }

    // Calculate the i-th basis polynomial evaluated at 'atX'
    const basisPolynomial = numerator.divide(denominator);

    // Add this point's contribution to the final secret
    secret = secret.add(yi.multiply(basisPolynomial));
  }

  return secret;
}

// --- Main Execution Logic ---
function solve() {
  try {
    // 1. Read the Test Case (Input) from a separate JSON file
    console.log("Reading input from 'input.json'...");
    const rawData = fs.readFileSync("input.json", "utf8");
    const data = JSON.parse(rawData);

    // Get the minimum number of points (k) required from the keys
    const k = data.keys.k;
    console.log(`Minimum points (k) required: ${k}`);

    // 2. Decode the Y Values
    const points = [];
    for (const key in data) {
      // We only care about the keys that represent points, not the 'keys' object itself
      if (key === "keys") {
        continue;
      }

      const x = bigInt(key);
      const yEncoded = data[key];
      const base = parseInt(yEncoded.base, 10);

      // Use bigInt to convert the y-value from its given base to a standard base-10 BigInteger
      const y = bigInt(yEncoded.value, base);

      points.push({ x, y });
    }
    console.log(`Successfully decoded ${points.length} points.`);

    // 3. Find the Secret (C)
    // The secret 'c' is the constant term of the polynomial, which is found by evaluating the polynomial at x=0.
    const secretC = findSecretWithLagrange(points, k, bigInt.zero);

    console.log("\n-------------------------------------------");
    console.log("The secret value 'c' has been found:");
    console.log(secretC.toString());
    console.log("-------------------------------------------");

  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Run the solver
solve();
