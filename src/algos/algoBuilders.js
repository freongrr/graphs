//@flow
import type {Algo} from "./algo";
import Dijkstra from "./dijkstra";
import Graph from "../utils/graph";

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
        return new Dijkstra(graph, firstNodeId, lastNodeId);
    }
}]: AlgoBuilder[]);

export default BUILDERS;
