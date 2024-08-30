export default function findMidpoint(times, targets, objectiveFunction) {
    let minWeight = 1e9;
    let winningStation = "";

    if (targets.length === 0) {
        return "No station selected";
    }

    if (targets.length === 1) {
        return "Select more than one station";
    }

    for (let station in times) {
        let weights = [];

        for (let target of targets) {
            if (!(target in times[station])) {
                weights.push(0);
                continue;
            }
            weights.push(times[station][target]);
        }

        if (objectiveFunction(weights) < minWeight) {
            minWeight = objectiveFunction(weights);
            winningStation = station;
        }
    }

    return winningStation;
}
