import * as GrandExchangeActions from './grandexchange.actions';

export interface State {
    test: boolean
}

const initialState: State = {
   test: true
};

export function grandExchangeReducer(state = initialState, action: GrandExchangeActions.GrandExchangeActions) {

    switch(action.type) {

        case GrandExchangeActions.TEST:
            return {
                ...state,
                test: action.payload
            }
            
        default:
            return state;
    }
}