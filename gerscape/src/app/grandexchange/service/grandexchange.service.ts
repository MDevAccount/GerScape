import { LoadingState } from 'src/app/shared/model/call-state.model'
import * as GrandExchangeActions from '../store/grandexchange.actions'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { Injectable } from '@angular/core'

@Injectable()
export class GrandExchangeService {
    static URL_ITEM =
        'http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=#VAR#'

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
}
