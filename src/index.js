import Graph from "./graph";
import GraphRenderer from "./graphRenderer";

const g = new Graph();
for (let i = 1; i <= 10; i++) {
    g.addNode(i, {class: "unvisited"});
}

g.addEdge(1, 2, 5);
g.addEdge(1, 3, 10);
g.addEdge(2, 3, 6);
g.addEdge(3, 4, 2);
g.addEdge(3, 6, 4);
g.addEdge(4, 5, 3);
g.addEdge(5, 7, 8);
g.addEdge(5, 8, 4);
g.addEdge(5, 10, 12);
g.addEdge(7, 9, 2);
g.addEdge(7, 10, 6);

g.updateNode(1, {class: "start"});
g.updateNode(10, {class: "end"});

const renderer = new GraphRenderer("#root");
renderer.setSource(g);
