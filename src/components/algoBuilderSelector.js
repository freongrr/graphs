//@flow
import React from "react";
import type {AlgoBuilder, AlgoBuilderParam} from "../algos/algoBuilders";
import algoBuilders from "../algos/algoBuilders";

type AlgoBuilderSelectorProps = {
    algoBuilder: AlgoBuilder,
    algoBuilderParams: mixed[],
    disabled: boolean,
    onAlgoBuilderChange: (AlgoBuilder) => void,
    onAlgoBuilderParamsChange: (mixed[]) => void,
};

// TODO : this is pretty much the same thing as GraphBuilderSelector
export default class AlgoBuilderSelector extends React.Component<AlgoBuilderSelectorProps> {

    constructor(props: AlgoBuilderSelectorProps) {
        super(props);
    }

    render() {
        const algoBuilderIndex = algoBuilders.indexOf(this.props.algoBuilder);
        return (
            <div className="algoSelector">
                <div className="fieldGroup">
                    <label htmlFor="graphType">Type: </label>
                    <select id="algoType" disabled={this.props.disabled}
                        value={algoBuilderIndex} onChange={this.setAlgoBuilder}>
                        {algoBuilders.map((builder, index) => {
                            return <option key={builder.name} value={index}>{builder.name}</option>;
                        })}
                    </select>
                </div>

                {this.props.algoBuilder.parameters.map((param, index) => this.createParameterField(index, param))}
            </div>
        );
    }

    setAlgoBuilder = (event: any) => {
        const index = parseInt(event.target.value);
        const graphBuilder = algoBuilders[index];
        this.props.onAlgoBuilderChange(graphBuilder);
    };

    createParameterField(index: number, param: AlgoBuilderParam) {
        // TODO : handle more parameter types
        const id = "graphBuilderParam" + index;
        return (
            <div key={id} className="fieldGroup">
                <label htmlFor={id}>{param.name}: </label>
                <input id={id} type="number" disabled={this.props.disabled}
                    value={this.props.algoBuilderParams[index]}
                    onChange={e => this.setGraphBuilderParam(e, index)}/>
            </div>);
    }

    setGraphBuilderParam = (event: any, index: number) => {
        const params = [...this.props.algoBuilderParams];
        const rawValue = event.target.value;
        // TODO : handle more parameter types
        params[index] = rawValue === "" ? 0 : parseInt(rawValue);
        this.props.onAlgoBuilderParamsChange(params);
    };
}
