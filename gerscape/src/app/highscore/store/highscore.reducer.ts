import * as HighscoreActions from './highscore.actions';
import { HighscoreLight } from 'src/app/highscore/model/highscore-light.model';
import { PlayerDetails } from 'src/app/highscore/model/player-details.model';
import { RuneMetricsProfile } from 'src/app/highscore/model/runemetrics-profile.model';
import { QuestResponse } from 'src/app/highscore/model/quest.model';
import { SesonalEvent } from '../model/sesonal-event.model';


export interface State {
    runemetricsProfile: RuneMetricsProfile,
    questResponse: QuestResponse,
    highscoreLight: HighscoreLight,
    playerDetails: PlayerDetails,
    sesonalEvents: SesonalEvent[]
}

const initialState: State = {
    runemetricsProfile: new RuneMetricsProfile(0, 0, 0, 0, 0, 0, 0, [], [], "", "", 0, 0, ""),
    questResponse: new QuestResponse([], ""),
    highscoreLight: new HighscoreLight(0, 0, 0, [], []),
    playerDetails: new PlayerDetails(false, false, "", "", ""),
    sesonalEvents: []
};

export function highscoreReducer(state = initialState, action: HighscoreActions.HighscoreActions) {

    switch(action.type) {

        case HighscoreActions.SET_HIGHSCORE_LIGHT:
            return {
                ...state,
                highscoreLight: action.payload
            }

        case HighscoreActions.SET_PLAYER_DETAILS:
            return {
                ...state,
                playerDetails: action.payload
            };

        case HighscoreActions.SET_QUESTS:
            return {
                ...state,
                questResponse: action.payload
            };   

        case HighscoreActions.SET_RUNEMETRICS_PROFILE:
            return {
                ...state,
                runemetricsProfile: action.payload
            };   

        case HighscoreActions.SET_SESONAL_EVENTS:
            return {
                ...state,
                sesonalEvents: action.payload
            };  

        default:
            return state;
    }
}
