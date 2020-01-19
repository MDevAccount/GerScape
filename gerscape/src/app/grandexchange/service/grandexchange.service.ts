import { LoadingState } from 'src/app/shared/model/call-state.model'
import * as GrandExchangeActions from '../store/grandexchange.actions'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { Injectable } from '@angular/core'

@Injectable()
export class GrandExchangeService {
    static URL_ITEM =
        'http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=#VAR#'

    static URL_ITEM_SEARCH =
        'http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=#VAR1#&alpha=#VAR2#&page=#VAR3#'

    static URL_ITEM_GRAPH_DATA = 'http://services.runescape.com/m=itemdb_rs/api/graph/#VAR#.json'

    constructor(private store: Store<AppState>) {}

    dispatchCallStateOfActionX(
        loadingState: LoadingState,
        actionType: string,
        errorMsg: string = ''
    ) {
        this.store.dispatch(
            new GrandExchangeActions.SetCallStateOfActionX({
                loadingState: loadingState,
                actionType: actionType,
                errorMsg: errorMsg,
            })
        )
    }

    getCallStateOfActionX$(actionType: string) {
        return this.store.select(
            (state: AppState) =>
                state.grandExchange.callStates.filter(
                    (callState) => callState.actionType == actionType
                )[0].state
        )
    }

    getGrandExchangeItem$() {
        return this.store.select((state: AppState) => state.highscore.clanMembers)
    }
}
