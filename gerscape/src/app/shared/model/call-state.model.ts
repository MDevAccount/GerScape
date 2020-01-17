export class CallState {
    constructor(public state: LoadingState, public actionType: string, public errorMsg: string) {}
}

export enum LoadingState {
    INIT = 'INIT',
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    ERROR = 'ERROR',
}
