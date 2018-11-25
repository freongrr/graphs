//@flow
import type {Algo} from "./algo";
import Dijkstra from "./dijkstra";
import Graph from "../utils/graph";
import BreadthFirstSearch from "./breadthFirstSearch";

export type AlgoBuilderParam = { name: string, type: mixed, default?: mixed };
export type AlgoBuilder = {
    name: string,
    parameters: AlgoBuilderParam[],
    build: (Graph, ...any) => Algo
};

const BUILDERS = ([{
    name: "Dijkstra",
    parameters: [],
    build: (graph: Graph) => {
        const nodes = graph.getNodes();
        const firstNodeId = nodes[0].id;
        const lastNodeId = nodes[nodes.length - 1].id;
        return new Dijkstra(firstNodeId, lastNodeId);
    }
}, {
    name: "Breadth-first Search",
    parameters: [],
    build: (graph: Graph) => {
        const nodes = graph.getNodes();
        const firstNodeId = nodes[0].id;
        const lastNodeId = nodes[nodes.length - 1].id;
        return new BreadthFirstSearch(firstNodeId, lastNodeId);
    }
}]: AlgoBuilder[]);

export default BUILDERS;
