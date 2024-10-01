const fs = require('fs');

// Helper function to decode the value based on the base
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Lagrange interpolation to find the constant term (secret)
function lagrangeInterpolation(points) {
    let secret = 0;
    let k = points.length;

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        // Calculate the Lagrange basis polynomial L_i(0)
        let Li = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;
                Li *= xj / (xj - xi);
            }
        }

        // Add the contribution of this term to the secret
        secret += yi * Li;
    }

    return secret;
}

// Function to process the input and solve for the constant term
function solveSecret(testCase) {
    const n = testCase.keys.n;
    const k = testCase.keys.k;

    let points = [];

    // Extract and decode points from the test case
    for (let i = 1; i <= n; i++) {
        if (testCase[i]) {
            let base = parseInt(testCase[i].base);
            let value = testCase[i].value;
            let decodedY = decodeValue(value, base);
            points.push({ x: i, y: decodedY });
        }
    }

    // Perform Lagrange interpolation to find the secret (constant term)
    if (points.length >= k) {
        return lagrangeInterpolation(points.slice(0, k));
    } else {
        throw new Error('Not enough points to solve for the polynomial.');
    }
}

// Function to solve both test cases and print results
function solveTestCases() {
    try {
        const testCase1 = JSON.parse(fs.readFileSync('testCase1.json', 'utf8'));
        const testCase2 = JSON.parse(fs.readFileSync('testCase2.json', 'utf8'));

        // Solve the first test case
        let secret1 = solveSecret(testCase1);
        console.log(`Secret for test case 1: ${secret1}`);

        // Solve the second test case
        let secret2 = solveSecret(testCase2);
        console.log(`Secret for test case 2: ${secret2}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the function to solve the test cases
solveTestCases();
