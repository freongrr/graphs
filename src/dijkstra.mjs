import PriorityQueue from "./priorityQueue";

export function shortestDistance(graph, start, end) {
    const distances = new Map();
    const visitedNodes = new Set();
    const closestNodes = new PriorityQueue();

    graph.getNodes().forEach(n => {
        if (n === start) {
            distances.set(n, 0);
            closestNodes.offer(n, 0);
        } else {
            distances.set(n, Number.POSITIVE_INFINITY);
            closestNodes.offer(n, Number.POSITIVE_INFINITY);
        }
    });

    while (!closestNodes.empty()) {
        const current = closestNodes.extract();
        console.log(`Visiting ${current}...`);
        const distanceToCurrent = distances.get(current);
        // If the current node is reachable
        if (distanceToCurrent !== Number.POSITIVE_INFINITY) {
            graph.getEdges(current).forEach(edge => {
                const next = edge.node;
                const weight = edge.weight;
                // And the next node has not already been visited
                if (!visitedNodes.has(next)) {
                    const oldDistanceToNext = distances.get(next);
                    const distanceToNext = distanceToCurrent + weight;
                    if (distanceToNext < oldDistanceToNext) {
                        distances.set(next, distanceToNext);
                        console.log(`Updating distance to ${next} with ${distanceToNext}`);
                        closestNodes.update(next, distanceToNext);
                    }
                }
            });
        }

        visitedNodes.add(current);
        if (current === end) {
            break;
        }
    }

    return distances.get(end);
}
