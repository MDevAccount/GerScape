import * as HighscoreActions from './highscore.actions';
import { HighscoreLight } from 'src/app/highscore/model/highscore-light.model';
import { PlayerDetails } from 'src/app/highscore/model/player-details.model';
import { RuneMetricsProfile } from 'src/app/highscore/model/runemetrics-profile.model';
import { QuestResponse } from 'src/app/highscore/model/quest.model';
import { SesonalEvent } from '../model/sesonal-event.model';
import { ClanMember } from '../model/clanmember.model';


export interface State {
    runemetricsProfile: RuneMetricsProfile,
    questResponse: QuestResponse,
    highscoreLight: HighscoreLight,
    playerDetails: PlayerDetails,
    sesonalEvents: SesonalEvent[],
    clanMembers: ClanMember[],

    isRuneMetricsProfilePrivate: boolean,
    isClanless: boolean,

    isLoadingRuneMetricsProfile: boolean,
    isLoadingQuestResponse: boolean,
    isLoadingHighscoreLight: boolean,
    isLoadingPlayerDetails: boolean,
    isLoadingSesonalEvents: boolean,
    isLoadingClanMembers: boolean
}

const initialState: State = {
    runemetricsProfile: null,
    questResponse: null,
    highscoreLight: null,
    playerDetails: null,
    sesonalEvents: null,
    clanMembers: null,
    isRuneMetricsProfilePrivate: false,
    isClanless: false,
    isLoadingRuneMetricsProfile: false,
    isLoadingQuestResponse: false,
    isLoadingHighscoreLight: false,
    isLoadingPlayerDetails: false,
    isLoadingSesonalEvents: false,
    isLoadingClanMembers: false
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

        case HighscoreActions.SET_CLAN_MEMBERS:
            return {
                ...state,
                clanMembers: action.payload
            };
        
        case HighscoreActions.SET_IS_RUNEMETRICS_PROFILE_PRIVATE:
            return {
                ...state,
                isRuneMetricsProfilePrivate: action.payload
            }

        case HighscoreActions.SET_IS_CLANLESS:
            return {
                ...state,
                isClanless: action.payload
            }

        case HighscoreActions.IS_LOADING_RUNEMETRICS_PROFILE:
            return {
                ...state,
                isLoadingRuneMetricsProfile: action.payload
            }

        case HighscoreActions.IS_LOADING_QUEST_RESPONSE:
            return {
                ...state,
                isLoadingQuestResponse: action.payload
            }

        case HighscoreActions.SET_IS_LOADING_HIGHSCORE_LIGHT:
            return {
                ...state,
                isLoadingHighscoreLight: action.payload
            }

        case HighscoreActions.SET_IS_LOADING_PLAYER_DETAILS:
            return {
                ...state,
                isLoadingPlayerDetails: action.payload
            }

        case HighscoreActions.SET_IS_LOADING_SESONAL_EVENTS:
            return {
                ...state,
                isLoadingSesonalEvents: action.payload
            }

        case HighscoreActions.SET_IS_LOADING_CLAN_MEMBERS:
            return {
                ...state,
                isLoadingClanMembers: action.payload
            }
        default:
            return state;
    }
}