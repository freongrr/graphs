//@flow
import update from "immutability-helper";

export type NodeId = number;
export type Node = { id: NodeId };
export type Edge = { source: Node, target: Node, weight: number };

export default class Graph {

    key: string;
    nodes: Node[];
    edges: Edge[];

    constructor(from?: { key: string, nodes: Node[], edges: Edge[] }) {
        this.key = from ? from.key : "graph" + Math.round(Math.random() * 1000);
        this.nodes = from ? from.nodes : [];
        this.edges = from ? from.edges : [];
    }

    getKey() {
        return this.key;
    }

    addNode(id: NodeId, attributes: {}) {
        this.nodes.push({id: id, ...attributes});
    }

    getNodes() {
        return [...this.nodes];
    }

    // TODO : make weight an attribute
    addEdge(sourceId: NodeId, destinationId: NodeId, weight: number = 1) {
        const sourceIndex = this.nodes.findIndex(n => n.id === sourceId);
        const destinationIndex = this.nodes.findIndex(n => n.id === destinationId);
        if (sourceIndex < 0) {
            console.warn(`Can't find node with id ${sourceId}`);
        } else if (destinationIndex < 0) {
            console.warn(`Can't find node with id ${destinationId}`);
        } else if (this.findEdgeIndex(sourceId, destinationId) >= 0) {
            console.warn(`Ignoring duplicated edge between ${sourceId} and ${destinationId}`);
        } else {
            this.edges.push({
                source: this.nodes[sourceIndex],
                target: this.nodes[destinationIndex],
                weight: weight
            });
        }
    }

    findEdgeIndex(sourceId: NodeId, destinationId: NodeId): number {
        return this.edges.findIndex(edge => {
            return edge.source.id === sourceId && edge.target.id === destinationId ||
                edge.target.id === sourceId && edge.source.id === destinationId;
        });
    }

    getEdges() {
        return [...this.edges];
    }

    getEdgesFrom(nodeId: NodeId) {
        const results = [];
        this.edges.forEach(edge => {
            if (edge.source.id === nodeId) {
                results.push(edge);
            } else if (edge.target.id === nodeId) {
                results.push(Graph.reverse(edge));
            }
        });
        return results;
    }

    static reverse(edge: Edge) {
        return {
            source: edge.target,
            target: edge.source,
            weight: edge.weight
        };
    }

    static updateNode(graph: Graph, id: NodeId, attributes: {}): Graph {
        const index = graph.nodes.findIndex(n => n.id === id);
        if (index < 0) {
            console.warn(`Can't find node with id ${id}`);
            return graph;
        } else {
            const node = graph.nodes[index];
            const updatedNode = {...node, ...attributes};
            return new Graph(update(graph, {nodes: {$splice: [[index, 1, updatedNode]]}}));
        }
    }

    static updateEdge(graph: Graph, sourceId: NodeId, destinationId: NodeId, attributes: {}): Graph {
        const index = graph.findEdgeIndex(sourceId, destinationId);
        if (index < 0) {
            console.warn(`Can't find edge between ${sourceId} and ${destinationId}`);
            return graph;
        } else {
            const edge = graph.edges[index];
            const updatedEdge = {...edge, ...attributes};
            return new Graph(update(graph, {edges: {$splice: [[index, 1, updatedEdge]]}}));
        }
    }
}
