import * as GrandExchangeActions from './grandexchange.actions'
import { GrandExchangeItem } from '../model/grandexchange-item.model'
import { CallState, LoadingState } from 'src/app/shared/model/call-state.model'
import { GrandExchangeItemGraphData } from '../model/grandexchange-item-graph-data.model'

export interface GrandExchangeState {
    grandExchangeItems: GrandExchangeItem[]
    grandExchangeItemGraphsData: GrandExchangeItemGraphData[]
    currentGrandExchangeItem: GrandExchangeItem
    currentGrandExchangeItemGraphData: GrandExchangeItemGraphData
    callStates: CallState[]
}

const initialState: GrandExchangeState = {
    grandExchangeItems: [],
    grandExchangeItemGraphsData: [],
    currentGrandExchangeItem: null,
    currentGrandExchangeItemGraphData: null,
    callStates: [
        new CallState(LoadingState.INIT, GrandExchangeActions.FETCH_GRAND_EXCHANGE_ITEM, ''),
        new CallState(LoadingState.INIT, GrandExchangeActions.SET_CURRENT_DETAIL_ITEM, ''),
        new CallState(LoadingState.INIT, GrandExchangeActions.ADD_GRAND_EXCHANGE_ITEM, ''),
        new CallState(
            LoadingState.INIT,
            GrandExchangeActions.SET_CURRENT_DETAIL_ITEM_GRAPH_DATA,
            ''
        ),
        new CallState(
            LoadingState.INIT,
            GrandExchangeActions.ADD_GRAND_EXCHANGE_ITEM_GRAPH_DATA,
            ''
        ),
        new CallState(
            LoadingState.INIT,
            GrandExchangeActions.FETCH_GRAND_EXCHANGE_ITEM_GRAPH_DATA,
            ''
        ),
    ],
}

export function grandExchangeReducer(
    state = initialState,
    action: GrandExchangeActions.GrandExchangeActions
) {
    switch (action.type) {
        case GrandExchangeActions.SET_CALL_STATE_OF_ACTION_X:
            const callStateCopy = updateActionCallState(
                [...state.callStates],
                action.payload.actionType,
                action.payload.loadingState
            )
            return {
                ...state,
                callStates: callStateCopy,
            }
        case GrandExchangeActions.ADD_GRAND_EXCHANGE_ITEM:
            let geItems = [...state.grandExchangeItems]
            if (action.payload) geItems.push(action.payload)
            return {
                ...state,
                grandExchangeItems: geItems,
            }
        case GrandExchangeActions.ADD_GRAND_EXCHANGE_ITEMS:
            let items = [...state.grandExchangeItems]
            if (action.payload && action.payload.length > 0)
                action.payload.forEach((item) => items.push(item))
            return {
                ...state,
                grandExchangeItems: geItems,
            }
        case GrandExchangeActions.ADD_GRAND_EXCHANGE_ITEM_GRAPH_DATA:
            let geItemGraphs = [...state.grandExchangeItemGraphsData]
            if (action.payload) geItemGraphs.push(action.payload)
            return {
                ...state,
                grandExchangeItemGraphsData: geItemGraphs,
            }
        case GrandExchangeActions.SET_CURRENT_DETAIL_ITEM:
            return {
                ...state,
                currentGrandExchangeItem: action.payload,
            }
        case GrandExchangeActions.SET_CURRENT_DETAIL_ITEM_GRAPH_DATA:
            console.log('test', action.payload)
            return {
                ...state,
                currentGrandExchangeItemGraphData: action.payload,
            }
        default:
            return state
    }
}

function updateActionCallState(
    callStates: CallState[],
    type: string,
    newLoadingState: LoadingState
) {
    let callStatesCopy = [...callStates]
    let callState = callStatesCopy.filter((callState) => callState.actionType == type)[0]
    if (callState) {
        callStatesCopy = callStatesCopy.filter((callState) => callState.actionType != type)
        callState.state = newLoadingState
        callStatesCopy.push(callState)
    }

    return callStatesCopy
}
