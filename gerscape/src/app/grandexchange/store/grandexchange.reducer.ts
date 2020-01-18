import * as GrandExchangeActions from './grandexchange.actions'
import { GrandExchangeItem } from '../model/grandexchange-item.model'

export interface GrandExchangeState {
    grandExchangeItems: GrandExchangeItem[]
}

const initialState: GrandExchangeState = {
    grandExchangeItems: [],
}

export function grandExchangeReducer(
    state = initialState,
    action: GrandExchangeActions.GrandExchangeActions
) {
    switch (action.type) {
        case GrandExchangeActions.GRANDEXCHANGE_ADD_ITEM:
            let geItems = [...state.grandExchangeItems]
            if (action.payload) geItems.push(action.payload)
            return {
                ...state,
                grandExchangeItems: geItems,
            }

        default:
            return state
    }
}
