//@flow
import React from "react";
import Graph from "../utils/graph";
import type {GraphBuilder} from "../utils/graphBuilders";
import graphBuilders from "../utils/graphBuilders";
import GraphRenderer from "./graphRenderer";
import Algo from "../algos/algo";
import Dijkstra from "../algos/dijkstra";
import GraphBuilderSelector from "./graphBuilderSelector";
import "./app.scss";

const STEP_DELAY = 1000;

const NO_OP = () => {
    // Nothing to do
};

type AppState = {
    graphBuilder: GraphBuilder,
    graphBuilderParams: mixed[],
    graph: Graph,
    playing: boolean,
    algo: ?Algo
};

export default class App extends React.Component<{}, AppState> {

    timeout: any;

    constructor(props: {}) {
        super(props);

        this.state = {
            graphBuilder: graphBuilders[0],
            graphBuilderParams: [],
            graph: graphBuilders[0].build(),
            playing: false,
            algo: null
        };
    }

    render() {
        const isPlaying = !!this.state.playing;
        const isDone = this.state.algo && this.state.algo.isDone();
        return (
            <div className="App">
                <GraphBuilderSelector
                    disabled={isPlaying}
                    graphBuilder={this.state.graphBuilder}
                    graphBuilderParams={this.state.graphBuilderParams}
                    onGraphBuilderChange={this.setGraphBuilder}
                    onGraphBuilderParamsChange={this.setGraphBuilderParams}/>

                <div>
                    Algo:
                    <input type="button" value="Reset" disabled={isPlaying} onClick={this.reset}/>
                    {isPlaying && <input type="button" value="Stop" onClick={this.stop}/>}
                    {!isPlaying && <input type="button" value="Play" onClick={this.play} disabled={isDone}/>}
                    <input type="button" value="Step" onClick={this.step} disabled={isPlaying || isDone}/>
                </div>

                <GraphRenderer graph={this.state.graph}/>
            </div>
        );
    }

    setGraphBuilder = (graphBuilder: GraphBuilder) => {
        this.setState({
            graphBuilder: graphBuilder,
            graphBuilderParams: graphBuilder.parameters.map(p => p.default)
        });
    };

    setGraphBuilderParams = (graphBuilderParams: mixed[]) => {
        this.setState({graphBuilderParams: graphBuilderParams});
    };

    reset = () => {
        const graph = this.state.graphBuilder.build(...this.state.graphBuilderParams);
        this.setState({
            graph: graph,
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
            if (this.state.algo && this.state.algo.isDone()) {
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
        this.doStep(NO_OP);
    };

    doStep(callback: () => void) {
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
