import Graph from "./graph";
import {UNVISITED_NODE_CLASS} from "./constants";

export function createSimpleGraph() {
    const graph = new Graph();
    for (let i = 1; i <= 10; i++) {
        graph.addNode(i, {class: UNVISITED_NODE_CLASS});
    }

    graph.addEdge(1, 2, 5);
    graph.addEdge(1, 3, 10);
    graph.addEdge(2, 3, 6);
    graph.addEdge(3, 4, 2);
    graph.addEdge(3, 6, 4);
    graph.addEdge(4, 5, 3);
    graph.addEdge(5, 7, 8);
    graph.addEdge(5, 8, 4);
    graph.addEdge(5, 10, 12);
    graph.addEdge(7, 9, 2);
    graph.addEdge(7, 10, 6);

    return graph;
}

export function createRandomGraph(minNodeCount, maxNodeCount, minEdgeCount, maxEdgeCount) {
    const graph = new Graph();
    const nodeCount = Math.round(minNodeCount + Math.random() * (maxNodeCount - minNodeCount));
    const edgeCount = Math.round(minEdgeCount + Math.random() * (maxEdgeCount - minEdgeCount));

    for (let i = 1; i <= nodeCount; i++) {
        graph.addNode(i, {class: UNVISITED_NODE_CLASS});
    }

    for (let i = 1; i <= edgeCount; i++) {
        const nodeId1 = Math.round(1 + Math.random() * (nodeCount - 2));
        const nodeId2 = Math.round(nodeId1 + 1 + Math.random() * (nodeCount - nodeId1 - 1));
        const weight = Math.round(1 + Math.random() * 9);
        graph.addEdge(nodeId1, nodeId2, weight);
    }

    return graph;
}
