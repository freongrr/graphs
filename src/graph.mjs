export default class Graph {

    constructor() {
        this.nodes = [];
        this.edges = {};
    }

    addNode(n) {
        this.nodes.push(n);
    }

    addNodes(count) {
        for (let n = 1; n <= count; n++) {
            this.addNode(n);
        }
    }

    addEdge(from, to, weight = 1) {
        this.doAddEdge(from, to, weight);
        this.doAddEdge(to, from, weight);

    }

    doAddEdge(from, to, weight) {
        if (this.edges[from] === undefined) {
            this.edges[from] = {};
        }
        if (this.edges[from][to] === undefined) {
            this.edges[from][to] = [];
        }
        this.edges[from][to].push(weight);
    }

    getNodes() {
        return [...this.nodes];
    }

    getEdges(node) {
        const edges = [];
        Object.keys(this.edges[node]).forEach(next => {
            this.edges[node][next].forEach(w => {
                edges.push({node: parseInt(next), weight: w});
            });
        });
        return edges;
    }
}
