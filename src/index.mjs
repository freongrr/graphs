import Graph from "./graph";
import {shortestDistance} from "./dijkstra";

const g = new Graph();
g.addNodes(5);
g.addEdge(1, 2, 5);
g.addEdge(2, 3, 6);
g.addEdge(3, 4, 2);
g.addEdge(1, 3, 15);

console.log(shortestDistance(g, 1, 4));
