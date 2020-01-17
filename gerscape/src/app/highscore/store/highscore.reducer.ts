import * as HighscoreActions from './highscore.actions'
import { PlayerProfile } from '../model/player-profile.model'
import { CallState } from 'src/app/shared/model/call-state.model'
import { LoadingState } from '../../shared/model/call-state.model'
import { RuneMetricsProfile } from '../model/runemetrics-profile.model'
import { HighscoreLightProfile } from '../model/highscore-light-profile.model'
import { ClanMember } from '../model/clan-member.model'
import { Quest } from '../model/quest.model'
import { Activity } from '../model/activity.model'
import { SesonalEvent } from '../model/sesonal-event.model'

export interface HighscoreState {
    runeMetricsProfile: RuneMetricsProfile
    highscoreLightProfile: HighscoreLightProfile
    clanName: string
    clanMembers: ClanMember[]
    quests: Quest[]
    activities: Activity[]
    sesonalEvents: SesonalEvent[]
    callStates: CallState[]
}

const initialState: HighscoreState = {
    runeMetricsProfile: null,
    highscoreLightProfile: null,
    clanName: null,
    clanMembers: null,
    quests: null,
    activities: null,
    sesonalEvents: null,
    callStates: [
        new CallState(LoadingState.INIT, HighscoreActions.FETCH_PLAYERS_CLAN_NAME, ''),
        new CallState(LoadingState.INIT, HighscoreActions.FETCH_CLAN_MEMBERS_OF_CLAN, ''),
        new CallState(LoadingState.INIT, HighscoreActions.FETCH_PLAYERS_QUEST_ACHIEVEMENTS, ''),
        new CallState(LoadingState.INIT, HighscoreActions.FETCH_PLAYERS_LIGHT_HIGHSCORE, ''),
        new CallState(LoadingState.INIT, HighscoreActions.FETCH_PLAYERS_RUNE_METRICS_PROFILE, ''),
        new CallState(LoadingState.INIT, HighscoreActions.FETCH_PLAYERS_SESONAL_EVENTS, ''),
    ],
}

export function highscoreReducer(state = initialState, action: HighscoreActions.HighscoreActions) {
    switch (action.type) {
        case HighscoreActions.SET_CALL_STATE_OF_ACTION_X:
            const callStateCopy = updateActionCallState(
                [...state.callStates],
                action.payload.actionType,
                action.payload.loadingState
            )
            return {
                ...state,
                callStates: callStateCopy,
            }
        case HighscoreActions.SET_PLAYERS_RUNE_METRICS_PROFILE:
            return {
                ...state,
                runeMetricsProfile: action.payload,
            }
        case HighscoreActions.SET_CLAN_MEMBERS_OF_CLAN:
            return {
                ...state,
                clanMembers: action.payload,
            }
        case HighscoreActions.SET_PLAYERS_CLAN_NAME:
            return {
                ...state,
                HighscoreActions: action.payload,
            }
        case HighscoreActions.SET_PLAYERS_LIGHT_HIGHSCORE:
            return {
                ...state,
                highscoreLightProfile: action.payload,
            }
        case HighscoreActions.SET_PLAYERS_SESONAL_EVENTS:
            return {
                ...state,
                sesonalEvents: action.payload,
            }
        case HighscoreActions.SET_PLAYERS_QUEST_ACHIEVEMENTS:
            return {
                ...state,
                quests: action.payload,
            }
        default: {
            return state
        }
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
