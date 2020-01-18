import { ActionReducerMap } from '@ngrx/store'
import * as fromHighscore from '../highscore/store/highscore.reducer'
import * as fromGrandExchange from '../grandExchange/store/grandexchange.reducer'

export interface AppState {
    highscore: fromHighscore.HighscoreState
    grandExchange: fromGrandExchange.GrandExchangeState
}

export const appReducer: ActionReducerMap<AppState> = {
    highscore: fromHighscore.highscoreReducer,
    grandExchange: fromGrandExchange.grandExchangeReducer,
}
