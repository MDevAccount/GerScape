import { createSelector } from '@ngrx/store'
import { HighscoreState } from './highscore.reducer'
import { AppState } from 'src/app/store/app.reducer'

// export const highscoreState = (state: AppState) => state.highscore
// export const highscoreClanNameState = (state: AppState) => state.highscore.playerProfile.clanName
// export const highscoreClanMembersState = (state: AppState) =>
//     state.highscore.playerProfile.clanMembers
// export const highscoreCallStatesState = (state: AppState) => state.highscore.callStates

// export const getCallStateOf = createSelector(
//     highscoreState,
//     (state: HighscoreState, actionType: string) =>
//         state.callStates.filter((callState) => callState.actionType == actionType)[0]
// )
