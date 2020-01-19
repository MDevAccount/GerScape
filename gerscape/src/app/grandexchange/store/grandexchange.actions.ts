import { Action } from '@ngrx/store'
import { GrandExchangeItem } from '../model/grandexchange-item.model'
import { LoadingState } from 'src/app/shared/model/call-state.model'
import { GrandExchangeItemGraphData } from '../model/grandexchange-item-graph-data.model'

export const FETCH_GRAND_EXCHANGE_ITEM = '[Grandexchange] Fetch item'
export const FETCH_GRAND_EXCHANGE_ITEMS = '[Grandexchange] Fetch items'
export const FETCH_GRAND_EXCHANGE_ITEM_GRAPH_DATA = '[Grandexchange] Fetch item graph data'

export const ADD_GRAND_EXCHANGE_ITEM = '[Grandexchange] Add item'
export const ADD_GRAND_EXCHANGE_ITEMS = '[Grandexchange] Add items'
export const ADD_GRAND_EXCHANGE_ITEM_GRAPH_DATA = '[Grandexchange] Add item graph data'

export const SET_CURRENT_DETAIL_ITEM = '[Grandexchange] Set current detail item'
export const SET_CURRENT_DETAIL_ITEM_GRAPH_DATA =
    '[Grandexchange] Set current detail item graph data'

export const SET_CALL_STATE_OF_ACTION_X = '[Grandexchange] Set call state of action x'

export class FetchGrandExchangeItem implements Action {
    readonly type = FETCH_GRAND_EXCHANGE_ITEM

    constructor(public payload: number) {}
}

export class FetchGrandExchangeItemGraphData implements Action {
    readonly type = FETCH_GRAND_EXCHANGE_ITEM_GRAPH_DATA

    constructor(public payload: number) {}
}

export class FetchGrandExchangeItems implements Action {
    readonly type = FETCH_GRAND_EXCHANGE_ITEMS

    constructor(public payload: { category: string; searchLetter: string; page: number }) {}
}

export class AddGrandExchangeItem implements Action {
    readonly type = ADD_GRAND_EXCHANGE_ITEM

    constructor(public payload: GrandExchangeItem) {}
}

export class AddGrandExchangeItems implements Action {
    readonly type = ADD_GRAND_EXCHANGE_ITEMS

    constructor(public payload: GrandExchangeItem[]) {}
}

export class AddGrandExchangeItemGraph implements Action {
    readonly type = ADD_GRAND_EXCHANGE_ITEM_GRAPH_DATA

    constructor(public payload: GrandExchangeItemGraphData) {}
}

export class SetCurrentDetailGrandExchangeItem implements Action {
    readonly type = SET_CURRENT_DETAIL_ITEM

    constructor(public payload: GrandExchangeItem) {}
}

export class SetCurrentDetailGrandExchangeItemGraphData implements Action {
    readonly type = SET_CURRENT_DETAIL_ITEM_GRAPH_DATA

    constructor(public payload: GrandExchangeItemGraphData) {}
}

export class SetCallStateOfActionX implements Action {
    readonly type = SET_CALL_STATE_OF_ACTION_X

    constructor(
        public payload: { loadingState: LoadingState; actionType: string; errorMsg: string }
    ) {}
}

export type GrandExchangeActions =
    | FetchGrandExchangeItem
    | SetCallStateOfActionX
    | AddGrandExchangeItem
    | SetCurrentDetailGrandExchangeItem
    | FetchGrandExchangeItemGraphData
    | AddGrandExchangeItemGraph
    | SetCurrentDetailGrandExchangeItemGraphData
    | FetchGrandExchangeItems
    | AddGrandExchangeItems
