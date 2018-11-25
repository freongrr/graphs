/* eslint-disable react/prop-types */

import React from "react";
import * as d3 from "d3";
import "./graphRenderer.scss";

const WIDTH = 600;
const HEIGHT = 600;
const LABEL_WIDTH = 20;
const LABEL_HEIGHT = 16;
const NODE_RADIUS = 16;

const FORCE_BASE_DISTANCE = 50;
const FORCE_WEIGHT_FACTOR = 10;
const FORCE_NODE_CHARGE = -500;

// TODO : implement zoom!
export default class GraphRenderer extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    render() {
        return <div ref={this.ref} className="graphRenderer"/>;
    }

    componentDidMount() {
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

        const svg = d3.select(this.ref.current)
            .append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT);

        // Create a selection for the paths and the circles
        // This lets us attach data to it and use it to render them
        this.edgeSelection = svg.append("svg:g").selectAll("g");
        this.nodeSelection = svg.append("svg:g").selectAll("g");

        this.update(true);
    }

    componentDidUpdate(prevProps) {
        // HACK - use a key to tell when the graph has changed
        const oldGraphKey = prevProps.graph.getKey();
        const newGraphKey = this.props.graph.getKey();
        this.update(oldGraphKey !== newGraphKey);
    }

    update(newGraph) {
        this.renderEdges(newGraph);
        this.renderNodes();

        // Update the nodes and edges inside the simulation
        this.force.nodes(this.getNodes())
            .force("link").links(this.getEdges());

        // We need to reset alpha and target when showing a new graph,
        // but not when it's a minor iteration or it keeps jumping around
        if (newGraph) {
            this.force.alpha(1).alphaTarget(0).alphaMin(0.1).restart();
        } else {
            this.force.alphaMin(0.05).restart();
        }
    }

    getNodes() {
        return this.props.graph.getNodes();
    }

    getEdges() {
        return this.props.graph.getEdges();
    }

    renderEdges(newGraph) {
        if (newGraph) {
            // Remove all the edges when showing a new graph to avoid recycling old edges
            // (that could have the same source, destination and weight but still be in a different place) 
            this.edgeSelection.datum(null);
        }

        // Sets the data in the selection
        this.edgeSelection = this.edgeSelection.data(this.getEdges(), edge => {
            return edge ? (edge.source.id + "_" + edge.target.id + "_" + edge.weight) : undefined;
        });

        // Update existing edges
        this.edgeSelection.attr("class", edge => GraphRenderer.getEdgeClassNames(edge));

        // Delete edges that have been removed from the selection
        this.edgeSelection.exit().remove();

        // Create edges that have been added to the selection
        const edgeGroup = this.edgeSelection.enter()
            .append("svg:g")
            .attr("class", edge => GraphRenderer.getEdgeClassNames(edge));

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
        // Move the link between two nodes
        this.edgeSelection.selectAll("path").attr("d", edge => {
            const sourceX = edge.source.x;
            const sourceY = edge.source.y;
            const targetX = edge.target.x;
            const targetY = edge.target.y;
            return `M${sourceX},${sourceY}L${targetX},${targetY}`;
        });

        // And move the label too (there must be a way to position it relative to the path)
        this.edgeSelection.selectAll("g").attr("transform", edge => {
            const x = (edge.source.x + edge.target.x) / 2 - LABEL_WIDTH / 2;
            const y = (edge.source.y + edge.target.y) / 2 - LABEL_HEIGHT / 2;
            return `translate(${x},${y})`;
        });

        this.nodeSelection.attr("transform", node => `translate(${node.x},${node.y})`);
    }

    static getEdgeClassNames(edge) {
        let classNames = "edge";
        if (edge.class) {
            classNames += " " + edge.class;
        }
        return classNames;
    }

    static getNodeClassNames(node) {
        let classNames = "node";
        if (node.class) {
            classNames += " " + node.class;
        }
        return classNames;
    }
}
