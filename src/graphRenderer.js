import * as d3 from "d3";
import "./styles.scss";
import Graph from "./graph";

const WIDTH = 560;
const HEIGHT = 500;
const LABEL_WIDTH = 20;
const LABEL_HEIGHT = 16;
const NODE_RADIUS = 16;

const FORCE_BASE_DISTANCE = 50;
const FORCE_WEIGHT_FACTOR = 10;
const FORCE_NODE_CHARGE = -500;

const EMPTY_GRAPH = new Graph();

export default class GraphRenderer {

    constructor(selector = "body") {
        this.graph = EMPTY_GRAPH;

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
        this.nodeSelection = svg.append("svg:g").selectAll("g");
    }

    getNodes() {
        return this.graph.getNodes();
    }

    getEdges() {
        return this.graph.getEdges();
    }

    setSource(graph) {
        this.graph = graph;
        this.update();
    }

    update() {
        this.renderEdges();
        this.renderNodes();

        // Update the nodes and edges inside the simulation
        this.force.nodes(this.getNodes())
            .force("link").links(this.getEdges());

        // Sets alphaMin to stop the simulation when things settle
        this.force.alphaMin(0.05).restart();
    }

    renderEdges() {
        // Sets the data in the selection
        this.edgeSelection = this.edgeSelection.data(this.getEdges());

        // Delete edges that have been removed from the selection
        this.edgeSelection.exit().remove();

        // Create edges that have been added to the selection
        const edgeGroup = this.edgeSelection.enter()
            .append("svg:g")
            .attr("class", "edge");

        edgeGroup.append("svg:path");

        const labelGroup = edgeGroup.append("svg:g");
        labelGroup.append("svg:rect")
            .attr("width", LABEL_WIDTH)
            .attr("height", LABEL_HEIGHT);
        labelGroup.append("svg:text")
            .attr("x", LABEL_WIDTH / 2)
            .attr("y", 12)
            .text(edge => edge.weight);

        this.edgeSelection = edgeGroup.merge(this.edgeSelection);
    }

    renderNodes() {
        // Sets the data in the selection
        this.nodeSelection = this.nodeSelection.data(this.getNodes(), node => node.id);

        // Update existing nodes
        this.nodeSelection.attr("class", node => GraphRenderer.getNodeClassNames(node));

        // Delete nodes that have been removed from the selection
        this.nodeSelection.exit().remove();

        // Create nodes that have been added to the selection
        const nodeGroup = this.nodeSelection.enter()
            .append("svg:g")
            .attr("class", node => GraphRenderer.getNodeClassNames(node));

        nodeGroup.append("svg:circle")
            .attr("r", NODE_RADIUS);
        nodeGroup.append("svg:text")
            .attr("x", 0)
            .attr("y", 4)
            .attr("class", "id")
            .text(node => node.id);

        this.nodeSelection = nodeGroup.merge(this.nodeSelection);
    }

    // Update nodes and edges according the force simulation
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

        this.nodeSelection.attr("transform", (d) => `translate(${d.x},${d.y})`);
    }

    static getNodeClassNames(node) {
        let classNames = "node";
        if (node.class) {
            classNames += " " + node.class;
        }
        return classNames;
    }
}
