export default function findTravelTimes(times, targets, midpoint){

    if (!(midpoint in times )){
        return []
    }

    let travelTimes = []

    for (let target of targets){
        travelTimes.push(times[midpoint][target])
    }

    return travelTimes
}