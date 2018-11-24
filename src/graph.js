export default class Graph {

    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(id, attributes) {
        this.nodes.push({id: id, ...attributes});
    }

    updateNode(id, attributes) {
        const index = this.nodes.findIndex(n => n.id === id);
        if (index < 0) {
            console.warn(`Can't find node with id ${id}`);
        } else {
            const node = this.nodes[index];
            Object.assign(node, attributes);
        }
    }

    getNodes() {
        return [...this.nodes];
    }

    addEdge(sourceId, destinationId, weight = 1) {
        const sourceIndex = this.nodes.findIndex(n => n.id === sourceId);
        const destinationIndex = this.nodes.findIndex(n => n.id === destinationId);
        if (sourceIndex < 0) {
            console.warn(`Can't find node with id ${sourceId}`);
        } else if (destinationIndex < 0) {
            console.warn(`Can't find node with id ${destinationId}`);
        } else {
            this.edges.push({
                source: this.nodes[sourceIndex],
                target: this.nodes[destinationIndex],
                weight: weight
            });
        }
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
