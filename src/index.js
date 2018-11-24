import Graph from "./graph";
import GraphRenderer from "./graphRenderer";
import Dijkstra from "./dijkstra";
import {UNVISITED_NODE_CLASS} from "./constants";

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

const renderer = new GraphRenderer("#root");
renderer.setSource(graph);

Dijkstra.run(graph, renderer, 1, 10, 1000);
