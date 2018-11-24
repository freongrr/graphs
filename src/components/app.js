import React from "react";
import {createRandomGraph, createSimpleGraph} from "../utils/graphBuilder";
import GraphRenderer from "./graphRenderer";
import Dijkstra from "../algos/dijkstra";
import "./app.scss";

const STEP_DELAY = 1000;

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nodeCount: 10,
            edgeCount: 10,
            graph: createSimpleGraph(),
            playing: false,
            algo: null
        };
    }

    render() {
        const isPlaying = !!this.state.playing;
        const isDone = this.state.algo && this.state.algo.isDone();
        return (
            <div className="App">
                <div className="fieldGroup">
                    <label htmlFor="nodeCount">Nodes: </label>
                    <input id="nodeCount" type="number" disabled={isPlaying}
                        value={this.state.nodeCount} onChange={this.setNodeCount}/>
                </div>
                <div className="fieldGroup">
                    <label htmlFor="edgeCount">Edges: </label>
                    <input id="edgeCount" type="number" disabled={isPlaying}
                        value={this.state.edgeCount} onChange={this.setEdgeCount}/>
                </div>

                <input type="button" value="Reset" disabled={isPlaying} onClick={this.reset}/>
                {isPlaying && <input type="button" value="Stop" onClick={this.stop}/>}
                {!isPlaying && <input type="button" value="Play" onClick={this.play} disabled={isDone}/>}
                <input type="button" value="Step" onClick={this.step} disabled={isPlaying || isDone}/>

                <GraphRenderer graph={this.state.graph}/>
            </div>
        );
    }

    setNodeCount = e => this.setState({nodeCount: parseInt(e.target.value)});

    setEdgeCount = e => this.setState({edgeCount: parseInt(e.target.value)});

    reset = () => {
        this.setState({
            graph: createRandomGraph(
                this.state.nodeCount,
                this.state.nodeCount,
                this.state.edgeCount,
                this.state.edgeCount),
            playing: false,
            algo: null
        });
    };

    play = () => {
        if (!this.state.playing) {
            this.setState({playing: true});
            this.autoStep();
        }
    };

    autoStep = () => {
        this.doStep(() => {
            if (this.state.algo.isDone()) {
                this.stop();
            } else {
                this.timeout = setTimeout(() => this.autoStep(), STEP_DELAY);
            }
        });
    };

    stop = () => {
        if (this.state.playing) {
            clearTimeout(this.timeout);
            this.setState({playing: false});
        }
    };

    step = () => {
        this.doStep(() => {
            // No-op
        });
    };

    doStep(callback) {
        if (this.state.algo == null) {
            const algo = this.createAlgo();
            algo.init();
            this.setState({algo: algo}, callback);
        } else {
            this.state.algo.step();
            // TODO : make the graph immutable and return a copy at each step
            // this will also us to go back to previous steps
            this.forceUpdate(callback);
        }
    }

    createAlgo() {
        const nodes = this.state.graph.getNodes();
        const firstNodeId = nodes[0].id;
        const lastNodeId = nodes[nodes.length - 1].id;
        return new Dijkstra(this.state.graph, firstNodeId, lastNodeId);
    }
}
