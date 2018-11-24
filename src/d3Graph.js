import * as d3 from "d3";
import "./styles.scss";

const WIDTH = 560;
const HEIGHT = 500;
const LABEL_WIDTH = 20;
const LABEL_HEIGHT = 16;
const NODE_RADIUS = 16;

const FORCE_BASE_DISTANCE = 50;
const FORCE_WEIGHT_FACTOR = 20;
const FORCE_NODE_CHARGE = -500;

export default class D3Graph {

    constructor(selector = "body") {
        this.nodes = [];
        this.edges = [];

        // Create an empty simulation
        // Note: using the weight alone does not work well
        // so we use a base distance and a charge to push nodes 
        this.force = d3.forceSimulation()
            .force("link", d3.forceLink()
                .id(node => node.id)
                .distance(edge => FORCE_BASE_DISTANCE + (FORCE_WEIGHT_FACTOR * edge.weight)))
            .force("charge", d3.forceManyBody().strength(FORCE_NODE_CHARGE))
            .force("x", d3.forceX(WIDTH / 2))
            .force("y", d3.forceY(HEIGHT / 2))
            .on("tick", () => this.tick());

        const svg = d3.select(selector)
            .append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT);

        // Create a selection for the paths and the circles
        // This lets us attach data to it and use it to render them
        this.edgeSelection = svg.append("svg:g").selectAll("g");
        this.circle = svg.append("svg:g").selectAll("g");
    }

    addNode(id) {
        this.nodes.push({
            id: id,
            type: "unvisited"
        });
        this.update();
    }

    addEdge(sourceId, destinationId, weight = 1) {
        const sourceIndex = this.nodes.findIndex(n => n.id === sourceId);
        const destinationIndex = this.nodes.findIndex(n => n.id === destinationId);
        if (sourceIndex >= 0 && destinationIndex >= 0) {
            this.edges.push({
                source: this.nodes[sourceIndex],
                target: this.nodes[destinationIndex],
                weight: weight
            });
            this.update();
        }
    }

    update() {
        this.renderEdges();
        this.renderNodes();

        // Update the nodes and edges inside the simulation
        this.force.nodes(this.nodes)
            .force("link").links(this.edges);

        // Sets alphaMin to stop the simulation when things settle
        this.force.alphaMin(0.05).restart();
    }

    renderEdges() {
        // Sets the data in the selection
        this.edgeSelection = this.edgeSelection.data(this.edges);

        // Remove old edges
        this.edgeSelection.exit().remove();

        // and redraw them
        const edgeGroup = this.edgeSelection.enter()
            .append("svg:g")
            .attr("class", "edge");

        edgeGroup.append("svg:path");

        const labelGroup = edgeGroup.append("svg:g");
        labelGroup.append("svg:rect")
            .attr("width", LABEL_WIDTH)
            .attr("height", LABEL_HEIGHT)
            .style("fill", "white")
            .style("stroke", "black");
        labelGroup.append("svg:text")
            .attr("x", LABEL_WIDTH / 2)
            .attr("y", 12)
            .text(edge => edge.weight);

        this.edgeSelection = edgeGroup.merge(this.edgeSelection);
    }

    renderNodes() {
        // Sets the data in the selection
        this.circle = this.circle.data(this.nodes, node => node.id);

        // Remove old nodes
        this.circle.exit().remove();

        // and redraw them
        const nodeGroup = this.circle.enter()
            .append("svg:g")
            .attr("class", node => D3Graph.getNodeClassNames(node));

        nodeGroup.append("svg:circle")
            .attr("r", NODE_RADIUS)
            .style("fill", node => D3Graph.getNodeColor(node))
            .style("stroke", node => d3.rgb(D3Graph.getNodeColor(node)).darker().toString());
        nodeGroup.append("svg:text")
            .attr("x", 0)
            .attr("y", 4)
            .attr("class", "id")
            .text(node => node.id);

        this.circle = nodeGroup.merge(this.circle);
    }

    // update force layout (called automatically each iteration)
    // TODO : we could call that manually to avoid the stabilization phase
    tick() {
        this.edgeSelection.selectAll("path").attr("d", edge => {
            const sourceX = edge.source.x;
            const sourceY = edge.source.y;
            const targetX = edge.target.x;
            const targetY = edge.target.y;
            return `M${sourceX},${sourceY}L${targetX},${targetY}`;
        });

        this.edgeSelection.selectAll("g").attr("transform", edge => {
            const x = (edge.source.x + edge.target.x) / 2 - LABEL_WIDTH / 2;
            const y = (edge.source.y + edge.target.y) / 2 - LABEL_HEIGHT / 2;
            return `translate(${x},${y})`;
        });

        this.circle.attr("transform", (d) => `translate(${d.x},${d.y})`);
    }

    static getNodeClassNames(node) {
        return "node " + node.type;
    }

    static getNodeColor(node) {
        switch (node.type) {
            case "unvisited":
                return "pink";
            default:
                return "white";
        }
    }
}
