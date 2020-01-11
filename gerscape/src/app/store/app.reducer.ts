import { ActionReducerMap } from '@ngrx/store';
import * as fromHighscore from '../highscore/store/highscore.reducer'
export interface AppState {
    highscore: fromHighscore.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    highscore: fromHighscore.highscoreReducer
}