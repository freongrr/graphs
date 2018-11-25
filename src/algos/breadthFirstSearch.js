//@flow
import type {Algo} from "./algo";
import type {NodeId} from "../utils/graph";
import Graph from "../utils/graph";
import * as Constants from "../utils/constants";
import {highlightPath} from "./algoUtils";

export default class BreadthFirstSearch implements Algo {

    startNodeId: NodeId;
    endNodeId: NodeId;
    toVisit: NodeId[];
    visited: Set<NodeId>;
    predecessors: Map<NodeId, NodeId>;

    constructor(startNodeId: NodeId, endNodeId: NodeId) {
        this.startNodeId = startNodeId;
        this.endNodeId = endNodeId;
        this.toVisit = [];
        this.visited = new Set();
        this.predecessors = new Map();
    }

    isDone(): boolean {
        return this.toVisit.length === 0;
    }

    init(graph: Graph): Graph {
        this.toVisit.push(this.startNodeId);
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
        const nodeId = this.toVisit.shift();
        console.log(`Visiting ${nodeId}...`);
        if (nodeId === this.endNodeId) {
            this.toVisit.splice(0, this.toVisit.length);
            graph = this.markShortestPath(graph);
        } else {
            graph = this.markAsVisited(graph, nodeId);
            graph.getEdgesFrom(nodeId).forEach(edge => {
                const nextNodeId = edge.target.id;
                // And the next node has not already been visited
                if (!this.visited.has(nextNodeId) && this.predecessors.get(nextNodeId) === undefined) {
                    graph = this.scheduleVisit(graph, nodeId, nextNodeId);
                }
            });
        }
        return graph;
    }

    markAsVisited(graph: Graph, nodeId: NodeId): Graph {
        this.visited.add(this.startNodeId);
        if (nodeId !== this.startNodeId && nodeId !== this.endNodeId) {
            graph = Graph.updateNode(graph, nodeId, {class: Constants.VISITED_NODE_CLASS});
        }
        return graph;
    }

    scheduleVisit(graph: Graph, nodeId: NodeId, nextNodeId: NodeId) {
        console.log(`Adding ${nextNodeId} to the list of nodes to visit`);
        this.toVisit.push(nextNodeId);
        this.predecessors.set(nextNodeId, nodeId);
        return Graph.updateEdge(graph, nodeId, nextNodeId, {class: Constants.VISITED_EDGE_CLASS});
    }

    markShortestPath(graph: Graph): Graph {
        return highlightPath(graph, this.startNodeId, this.endNodeId, this.predecessors);
    }
}
