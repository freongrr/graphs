// @flow

export interface Algo {

    isDone(): boolean;

    init(): void;

    step(): void;
}
