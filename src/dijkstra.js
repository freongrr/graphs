import PriorityQueue from "./priorityQueue";
import * as Constants from "./constants";

export default class Dijkstra {

    constructor(graph, startNodeId, endNodeId) {
        this.graph = graph;
        this.startNodeId = startNodeId;
        this.endNodeId = endNodeId;

        this.distances = new Map();
        this.visitedNodeIds = new Set();
        this.closestNodeIds = new PriorityQueue();
        this.previousNodeId = new Map();

        graph.getNodes().forEach(node => {
            const nodeId = node.id;
            if (nodeId === startNodeId) {
                this.distances.set(nodeId, 0);
                this.closestNodeIds.offer(nodeId, 0);
            } else {
                this.distances.set(nodeId, Number.POSITIVE_INFINITY);
                this.closestNodeIds.offer(nodeId, Number.POSITIVE_INFINITY);
            }
        });
    }

    isDone() {
        return this.closestNodeIds.empty() || this.lastVisitedNodeId === this.endNodeId;
    }

    init() {
        this.colorStartAndEndNodes();
    }

    step() {
        const nodeId = this.closestNodeIds.poll();
        const distanceToNode = this.distances.get(nodeId);
        console.log(`Visiting ${nodeId} (distance from start: ${distanceToNode})`);

        // If the current node is reachable
        if (distanceToNode !== Number.POSITIVE_INFINITY) {
            this.graph.getEdgesFrom(nodeId).forEach(edge => {
                const nextNodeId = edge.target.id;
                // And the next node has not already been visited
                if (!this.visitedNodeIds.has(nextNodeId)) {
                    this.graph.updateEdge(nodeId, nextNodeId, {class: Constants.VISITED_EDGE_CLASS});
                    const oldDistanceToNext = this.distances.get(nextNodeId);
                    const distanceToNext = distanceToNode + edge.weight;
                    if (distanceToNext < oldDistanceToNext) {
                        this.distances.set(nextNodeId, distanceToNext);
                        console.log(`Updating distance to ${nextNodeId} with ${distanceToNext}`);
                        this.closestNodeIds.update(nextNodeId, distanceToNext);
                        this.previousNodeId.set(nextNodeId, nodeId);
                    }
                }
            });
        }

        this.markAsVisited(nodeId);
    }

    colorStartAndEndNodes() {
        if (this.visitedNodeIds.size === 0) {
            this.graph.updateNode(this.startNodeId, {class: Constants.START_NODE_CLASS});
            this.graph.updateNode(this.endNodeId, {class: Constants.END_NODE_CLASS});
        }
    }

    markAsVisited(nodeId) {
        this.visitedNodeIds.add(nodeId);
        this.lastVisitedNodeId = nodeId;

        if (nodeId !== this.startNodeId && nodeId !== this.endNodeId) {
            this.graph.updateNode(nodeId, {class: Constants.VISITED_NODE_CLASS});
        }

        if (nodeId === this.endNodeId) {
            const distance = this.distances.get(this.endNodeId);
            console.log(`Finished: distance from ${this.startNodeId} to ${this.endNodeId} is ${distance}`);
            this.markShortestPath();
        } else if (this.closestNodeIds.empty()) {
            console.log(`Finished: can't reach ${this.endNodeId} from ${this.startNodeId}`);
        }
    }

    markShortestPath() {
        let id = this.endNodeId;
        while (id !== this.startNodeId) {
            const previousId = this.previousNodeId.get(id);
            this.graph.updateEdge(id, previousId, {class: Constants.HIGHLIGHTED_EDGE_CLASS});
            id = previousId;
        }
    }

    static run(graph, renderer, startNodeId, endNodeId, stepDelay) {
        function advanceDijkstra() {
            dijkstra.step();
            renderer.update();
            if (!dijkstra.isDone()) {
                setTimeout(advanceDijkstra, stepDelay);
            }
        }

        const dijkstra = new Dijkstra(graph, startNodeId, endNodeId);
        dijkstra.init();
        renderer.update();

        setTimeout(advanceDijkstra, stepDelay);
    }
}
