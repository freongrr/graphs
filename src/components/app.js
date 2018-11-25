//@flow
import React from "react";
import Graph from "../utils/graph";
import type {GraphBuilder} from "../utils/graphBuilders";
import graphBuilders from "../utils/graphBuilders";
import type {AlgoBuilder} from "../algos/algoBuilders";
import algoBuilders from "../algos/algoBuilders";
import GraphRenderer from "./graphRenderer";
import type {Algo} from "../algos/algo";
import GraphBuilderSelector from "./graphBuilderSelector";
import AlgoBuilderSelector from "./algoBuilderSelector";
import "./app.scss";

const STEP_DELAY = 1000;

const NO_OP = () => {
    // Nothing to do
};

type AppState = {
    graphBuilder: GraphBuilder,
    graphBuilderParams: mixed[],
    graph: Graph,
    algoBuilder: AlgoBuilder,
    algoBuilderParams: mixed[],
    algo: ?Algo,
    playing: boolean,
};

export default class App extends React.Component<{}, AppState> {

    timeout: any;

    constructor(props: {}) {
        super(props);

        this.state = {
            graphBuilder: graphBuilders[0],
            graphBuilderParams: [],
            graph: graphBuilders[0].build(),
            algoBuilder: algoBuilders[0],
            algoBuilderParams: [],
            algo: null,
            playing: false,
        };
    }

    render() {
        const isPlaying = !!this.state.playing;
        const isDone = this.state.algo && this.state.algo.isDone();
        return (
            <div className="App">
                <div className="graphControls">
                    <h2>Graph</h2>
                    <GraphBuilderSelector
                        disabled={isPlaying}
                        graphBuilder={this.state.graphBuilder}
                        graphBuilderParams={this.state.graphBuilderParams}
                        onGraphBuilderChange={this.setGraphBuilder}
                        onGraphBuilderParamsChange={this.setGraphBuilderParams}/>
                    <div className="buttonGroup">
                        <input type="button" value="Generate" disabled={isPlaying} onClick={this.rebuildGraph}/>
                    </div>
                </div>

                <div className="algoControls">
                    <h2>Algo</h2>
                    <AlgoBuilderSelector
                        disabled={isPlaying}
                        algoBuilder={this.state.algoBuilder}
                        algoBuilderParams={this.state.algoBuilderParams}
                        onAlgoBuilderChange={this.setAlgoBuilder}
                        onAlgoBuilderParamsChange={this.setAlgoBuilderParams}/>
                    <div className="buttonGroup">
                        {isPlaying && <input type="button" value="Stop" onClick={this.stop}/>}
                        {!isPlaying && <input type="button" value="Play" onClick={this.play} disabled={isDone}/>}
                        <input type="button" value="Step" onClick={this.step} disabled={isPlaying || isDone}/>
                    </div>
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

    rebuildGraph = () => {
        const graph = this.state.graphBuilder.build(...this.state.graphBuilderParams);
        this.setState({
            graph: graph,
            playing: false,
            algo: null
        });
    };

    setAlgoBuilder = (algoBuilder: AlgoBuilder) => {
        this.setState({
            algoBuilder: algoBuilder,
            algoBuilderParams: algoBuilder.parameters.map(p => p.default)
        });
    };

    setAlgoBuilderParams = (algoBuilderParams: mixed[]) => {
        this.setState({algoBuilderParams: algoBuilderParams});
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
            const algo = this.state.algoBuilder.build(this.state.graph, ...this.state.algoBuilderParams);
            algo.init();
            this.setState({algo: algo}, callback);
        } else {
            this.state.algo.step();
            // TODO : make the graph immutable and return a copy at each step
            // this will also us to go back to previous steps
            this.forceUpdate(callback);
        }
    }
}
