//@flow
import React from "react";
import type {GraphBuilder, GraphBuilderParam} from "../utils/graphBuilders";
import graphBuilders from "../utils/graphBuilders";

type GraphBuilderSelectorProps = {
    graphBuilder: GraphBuilder,
    graphBuilderParams: mixed[],
    disabled: boolean,
    onGraphBuilderChange: (GraphBuilder) => void,
    onGraphBuilderParamsChange: (mixed[]) => void,
};

export default class GraphBuilderSelector extends React.Component<GraphBuilderSelectorProps> {

    constructor(props: GraphBuilderSelectorProps) {
        super(props);
    }

    render() {
        const graphBuilderIndex = graphBuilders.indexOf(this.props.graphBuilder);
        return (
            <div className="graphBuilderSelector">
                <div className="fieldGroup">
                    <label htmlFor="graphType">Type: </label>
                    <select id="graphType" disabled={this.props.disabled}
                        value={graphBuilderIndex} onChange={this.setGraphBuilder}>
                        {graphBuilders.map((builder, index) => {
                            return <option key={builder.name} value={index}>{builder.name}</option>;
                        })}
                    </select>
                </div>

                {this.props.graphBuilder.parameters.map((param, index) => this.createParameterField(index, param))}
            </div>
        );
    }

    setGraphBuilder = (event: any) => {
        const index = parseInt(event.target.value);
        const graphBuilder = graphBuilders[index];
        this.props.onGraphBuilderChange(graphBuilder);
    };

    createParameterField(index: number, param: GraphBuilderParam) {
        // TODO : handle more parameter types
        const id = "graphBuilderParam" + index;
        return (
            <div key={id} className="fieldGroup">
                <label htmlFor={id}>{param.name}: </label>
                <input id={id} type="number" disabled={this.props.disabled}
                    value={this.props.graphBuilderParams[index]}
                    onChange={e => this.setGraphBuilderParam(e, index)}/>
            </div>);
    }

    setGraphBuilderParam = (event: any, index: number) => {
        const params = [...this.props.graphBuilderParams];
        const rawValue = event.target.value;
        // TODO : handle more parameter types
        params[index] = rawValue === "" ? 0 : parseInt(rawValue);
        this.props.onGraphBuilderParamsChange(params);
    };
}
