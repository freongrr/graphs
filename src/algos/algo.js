// @flow

import Graph from "../utils/graph";

export interface Algo {

    isDone(): boolean;

    init(Graph): Graph;

    step(Graph): Graph;
}
