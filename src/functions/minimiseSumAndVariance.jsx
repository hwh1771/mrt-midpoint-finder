export default function minimiseSumAndVariance(data, l = 0.005) {
    //l is a tuning parameter for how much the variance should have an effect.

    // Calculate the sum of the data
    const sum = data.reduce((acc, value) => acc + value, 0);

    // Calculate the mean of the data
    const mean = sum / data.length;

    // Calculate the variance
    const variance = data.reduce((acc, value) => acc + (value - mean) ** 2, 0);

    // Return the objective function value
    return Math.sqrt(sum + l * variance);
}