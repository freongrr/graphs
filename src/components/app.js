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

const STEP_DELAY = 1000;

const NO_OP = () => {
    // Nothing to do
};

type AppState = {
    graphBuilder: GraphBuilder,
    graphBuilderParams: mixed[],
    graph: Graph,
    originalGraph: Graph,
    algoBuilder: AlgoBuilder,
    algoBuilderParams: mixed[],
    algo: ?Algo,
    playing: boolean,
};

export default class App extends React.Component<{}, AppState> {

    timeout: any;

    constructor(props: {}) {
        super(props);

        const defaultGraphBuilder = graphBuilders[0];
        const initialAlgo = defaultGraphBuilder.build();
        const defaultAlgoBuilder = algoBuilders[0];
        this.state = {
            graphBuilder: defaultGraphBuilder,
            graphBuilderParams: [],
            graph: initialAlgo,
            originalGraph: initialAlgo,
            algoBuilder: defaultAlgoBuilder,
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
                        <input type="button" value="Reset" onClick={this.reset} disabled={isPlaying}/>
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
            originalGraph: graph,
            playing: false,
            algo: null
        });
    };

    setAlgoBuilder = (algoBuilder: AlgoBuilder) => {
        this.setState({
            graph: this.state.originalGraph,
            algoBuilder: algoBuilder,
            algoBuilderParams: algoBuilder.parameters.map(p => p.default),
            algo: null
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

    reset = () => {
        this.setState({graph: this.state.originalGraph});
    };

    step = () => {
        this.doStep(NO_OP);
    };

    doStep(callback: () => void) {
        if (this.state.algo == null) {
            const algo = this.state.algoBuilder.build(this.state.graph, ...this.state.algoBuilderParams);
            const graph = algo.init(this.state.graph);
            this.setState({algo, graph}, callback);
        } else {
            const graph = this.state.algo.step(this.state.graph);
            this.setState({graph}, callback);
        }
    }
}
