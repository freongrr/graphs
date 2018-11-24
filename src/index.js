import Graph from "./graph";
import {shortestDistance} from "./dijkstra";
import D3Graph from "./d3Graph";

const d3Graph = new D3Graph("#root");
d3Graph.addNode(1);
d3Graph.addNode(2);
d3Graph.addNode(3);
d3Graph.addNode(4);
d3Graph.addEdge(1, 2, 5);
d3Graph.addEdge(2, 3, 6);
d3Graph.addEdge(3, 4, 2);
d3Graph.addEdge(1, 3, 15);

const g = new Graph();
g.addNodes(5);
g.addEdge(1, 2, 5);
g.addEdge(2, 3, 6);
g.addEdge(3, 4, 2);
g.addEdge(1, 3, 15);

console.log(shortestDistance(g, 1, 4));
