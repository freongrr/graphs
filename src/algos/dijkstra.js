//@flow
import type {Algo} from "./algo";
import PriorityQueue from "../utils/priorityQueue";
import * as Constants from "../utils/constants";
import type {NodeId} from "../utils/graph";
import Graph from "../utils/graph";
import {highlightPath} from "./algoUtils";

export default class Dijkstra implements Algo {

    startNodeId: NodeId;
    endNodeId: NodeId;
    distances: Map<NodeId, number>;
    visitedNodeIds: Set<NodeId>;
    closestNodeIds: PriorityQueue<NodeId>;
    predecessors: Map<NodeId, NodeId>;
    lastVisitedNodeId: ?NodeId;

    constructor(startNodeId: NodeId, endNodeId: NodeId) {
        this.startNodeId = startNodeId;
        this.endNodeId = endNodeId;

        this.distances = new Map();
        this.visitedNodeIds = new Set();
        this.closestNodeIds = new PriorityQueue();
        this.predecessors = new Map();
    }

    isDone(): boolean {
        return this.lastVisitedNodeId === this.endNodeId ||
            this.closestNodeIds.empty() ||
            this.distances.get(this.closestNodeIds.peek()) === Number.POSITIVE_INFINITY;
    }

    init(graph: Graph): Graph {
        graph.getNodes().forEach(node => {
            const nodeId = node.id;
            if (nodeId === this.startNodeId) {
                this.distances.set(nodeId, 0);
                this.closestNodeIds.offer(nodeId, 0);
            } else {
                this.distances.set(nodeId, Number.POSITIVE_INFINITY);
                this.closestNodeIds.offer(nodeId, Number.POSITIVE_INFINITY);
            }
        });
        graph = Graph.updateNode(graph, this.startNodeId, {class: Constants.START_NODE_CLASS});
        graph = Graph.updateNode(graph, this.endNodeId, {class: Constants.END_NODE_CLASS});
        return graph;
    }

    step(graph: Graph): Graph {
        if (!this.isDone()) {
            graph = this.doStep(graph);
        }
        return graph;
    }

    doStep(graph: Graph): Graph {
        const nodeId = this.closestNodeIds.poll();
        const distanceToNode = (this.distances.get(nodeId): any);
        console.log(`Visiting ${nodeId} (distance from start: ${distanceToNode})`);

        // If the current node is reachable
        if (distanceToNode !== Number.POSITIVE_INFINITY) {
            graph.getEdgesFrom(nodeId).forEach(edge => {
                const nextNodeId = edge.target.id;
                // And the next node has not already been visited
                if (!this.visitedNodeIds.has(nextNodeId)) {
                    graph = Graph.updateEdge(graph, nodeId, nextNodeId, {class: Constants.VISITED_EDGE_CLASS});
                    const oldDistanceToNext = (this.distances.get(nextNodeId): any);
                    const distanceToNext = distanceToNode + edge.weight;
                    if (distanceToNext < oldDistanceToNext) {
                        this.distances.set(nextNodeId, distanceToNext);
                        console.log(`Updating distance to ${nextNodeId} with ${distanceToNext}`);
                        this.closestNodeIds.update(nextNodeId, distanceToNext);
                        this.predecessors.set(nextNodeId, nodeId);
                    }
                }
            });

            graph = this.markAsVisited(graph, nodeId);
        }

        if (nodeId === this.endNodeId) {
            const distance = (this.distances.get(this.endNodeId): any);
            console.log(`Finished: distance from ${this.startNodeId} to ${this.endNodeId} is ${distance}`);
            graph = this.markShortestPath(graph);
        } else if (this.isDone()) {
            console.log(`Finished: can't reach ${this.endNodeId} from ${this.startNodeId}`);
        }

        return graph;
    }

    markAsVisited(graph: Graph, nodeId: NodeId): Graph {
        this.visitedNodeIds.add(nodeId);
        this.lastVisitedNodeId = nodeId;

        if (nodeId !== this.startNodeId && nodeId !== this.endNodeId) {
            graph = Graph.updateNode(graph, nodeId, {class: Constants.VISITED_NODE_CLASS});
        }
        return graph;
    }

    markShortestPath(graph: Graph): Graph {
        return highlightPath(graph, this.startNodeId, this.endNodeId, this.predecessors);
    }
}
