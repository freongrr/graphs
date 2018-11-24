export default class Graph {

    constructor() {
        this.nodes = [];
        this.edges = [];
        this.key = "graph" + Math.round(Math.random() * 1000);
    }

    getKey() {
        return this.key;
    }

    addNode(id, attributes) {
        this.nodes.push({id: id, ...attributes});
    }

    updateNode(id, attributes) {
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
    addEdge(sourceId, destinationId, weight = 1) {
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

    updateEdge(sourceId, destinationId, attributes) {
        const edge = this.findEdge(sourceId, destinationId);
        if (edge) {
            Object.assign(edge, attributes);
        } else {
            console.warn(`Can't find edge between ${sourceId} and ${destinationId}`);
        }
    }

    findEdge(sourceId, destinationId) {
        return this.edges.find(edge => {
            return edge.source.id === sourceId && edge.target.id === destinationId ||
                edge.target.id === sourceId && edge.source.id === destinationId;
        });
    }

    getEdges() {
        return [...this.edges];
    }

    getEdgesFrom(nodeId) {
        return this.edges.flatMap(edge => {
            if (edge.source.id === nodeId) {
                return [edge];
            } else if (edge.target.id === nodeId) {
                return [Graph.reverse(edge)];
            } else {
                return [];
            }
        });
    }

    static reverse(edge) {
        return {
            source: edge.target,
            target: edge.source,
            weight: edge.weight
        };
    }
}
