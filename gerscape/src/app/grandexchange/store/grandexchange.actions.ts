import { Action } from '@ngrx/store'
import { LoadingState } from 'src/app/shared/model/call-state.model'
import { GrandExchangeItem } from '../model/grandexchange-item.model'

export const GRANDEXCHANGE_FETCH_ITEM = '[Grandexchange] Fetch item'

export const GRANDEXCHANGE_ADD_ITEM = '[Grandexchange] Add item'

export const SET_CALL_STATE_OF_ACTION_X = '[Grandexchange] Set call state of action x'

export class FetchGrandExchangeItem implements Action {
    readonly type = GRANDEXCHANGE_FETCH_ITEM

    constructor(public payload: number) {}
}

export class AddGrandExchangeItem implements Action {
    readonly type = GRANDEXCHANGE_ADD_ITEM

    constructor(public payload: GrandExchangeItem) {}
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
