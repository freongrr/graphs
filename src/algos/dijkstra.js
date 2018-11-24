import Algo from "./algo";
import PriorityQueue from "../utils/priorityQueue";
import * as Constants from "../utils/constants";

export default class Dijkstra extends Algo {

    constructor(graph, startNodeId, endNodeId) {
        super();

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
        return this.lastVisitedNodeId === this.endNodeId ||
            this.closestNodeIds.empty() ||
            this.distances.get(this.closestNodeIds.peek()) === Number.POSITIVE_INFINITY;
    }

    init() {
        this.colorStartAndEndNodes();
    }

    step() {
        if (this.isDone()) {
            return;
        }

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

            this.markAsVisited(nodeId);
        }

        this.checkDone(nodeId);
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
    }

    checkDone(nodeId) {
        if (nodeId === this.endNodeId) {
            const distance = this.distances.get(this.endNodeId);
            console.log(`Finished: distance from ${this.startNodeId} to ${this.endNodeId} is ${distance}`);
            this.markShortestPath();
        } else if (this.isDone()) {
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
}
