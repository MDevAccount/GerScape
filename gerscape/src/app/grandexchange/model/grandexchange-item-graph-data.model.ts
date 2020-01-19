export class GrandExchangeItemGraphData {
    constructor(public id: number, public daily: GraphData[], public average: GraphData[]) {}
}

export class GraphData {
    constructor(public timeStamp: number, public price: number) {}
}
