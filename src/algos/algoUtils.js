//@flow
import type {NodeId} from "../utils/graph";
import Graph from "../utils/graph";
import * as Constants from "../utils/constants";

export function highlightPath(graph: Graph, startNodeId: NodeId, endNodeId: NodeId, predecessors: Map<NodeId, NodeId>): Graph {
    let id = endNodeId;
    while (id && id !== startNodeId) {
        const previousId = predecessors.get(id);
        if (previousId) {
            graph = Graph.updateEdge(graph, id, previousId, {class: Constants.HIGHLIGHTED_EDGE_CLASS});
        }
        id = previousId;
    }
    return graph;
}
