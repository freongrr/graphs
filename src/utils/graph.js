//@flow

export type NodeId = number;
export type Node = { id: NodeId };
export type Edge = { source: Node, target: Node, weight: number };

export default class Graph {

    key: string;
    nodes: Node[];
    edges: Edge[];

    constructor() {
        this.key = "graph" + Math.round(Math.random() * 1000);
        this.nodes = [];
        this.edges = [];
    }

    getKey() {
        return this.key;
    }

    addNode(id: NodeId, attributes: {}) {
        this.nodes.push({id: id, ...attributes});
    }

    updateNode(id: NodeId, attributes: {}) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            Object.assign(node, attributes);
        } else {
            console.warn(`Can't find node with id ${id}`);
        }
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
        } else if (this.findEdge(sourceId, destinationId)) {
            console.warn(`Ignoring duplicated edge between ${sourceId} and ${destinationId}`);
        } else {
            this.edges.push({
                source: this.nodes[sourceIndex],
                target: this.nodes[destinationIndex],
                weight: weight
            });
        }
    }

    updateEdge(sourceId: NodeId, destinationId: NodeId, attributes: {}) {
        const edge = this.findEdge(sourceId, destinationId);
        if (edge) {
            Object.assign(edge, attributes);
        } else {
            console.warn(`Can't find edge between ${sourceId} and ${destinationId}`);
        }
    }

    findEdge(sourceId: NodeId, destinationId: NodeId) {
        return this.edges.find(edge => {
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
}
