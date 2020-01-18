import { Action } from '@ngrx/store'
import { Quest } from '../model/quest.model'
import { SesonalEvent } from '../model/sesonal-event.model'
import { ClanMember } from '../model/clan-member.model'
import { HighscoreLightProfile } from '../model/highscore-light-profile.model'
import { RuneMetricsProfile } from '../model/runemetrics-profile.model'
import { LoadingState } from 'src/app/shared/model/call-state.model'

export const FETCH_PLAYERS_RUNE_METRICS_PROFILE = '[Highscore] Fetch players runemetrics profile'
export const FETCH_PLAYERS_CLAN_NAME = '[Highscore] Fetch players clan name'
export const FETCH_PLAYERS_LIGHT_HIGHSCORE = '[Highscore] Fetch players light highscore'
export const FETCH_PLAYERS_QUEST_ACHIEVEMENTS = '[Highscore] Fetch players quest achievements'
export const FETCH_PLAYERS_SESONAL_EVENTS = '[Highscore] Fetch players sesonal events'
export const FETCH_CLAN_MEMBERS_OF_CLAN = '[Highscore] Fetch clan members of clan'

export const SET_PLAYERS_RUNE_METRICS_PROFILE = '[Highscore] Set players runemetrics profile'
export const SET_PLAYERS_CLAN_NAME = '[Highscore] Set players clan name'
export const SET_PLAYERS_LIGHT_HIGHSCORE = '[Highscore] Set players light highscore'
export const SET_PLAYERS_QUEST_ACHIEVEMENTS = '[Highscore] Set players quest achievements'
export const SET_PLAYERS_SESONAL_EVENTS = '[Highscore] Set players sesonal events'
export const SET_CLAN_MEMBERS_OF_CLAN = '[Highscore] Set clan members of clan'

export const SET_CALL_STATE_OF_ACTION_X = '[Highscore] Set callstate of action x'

export class SetPlayerRuneMetricsProfile implements Action {
    readonly type = SET_PLAYERS_RUNE_METRICS_PROFILE

    constructor(public payload: RuneMetricsProfile) {}
}

export class SetPlayersClanName implements Action {
    readonly type = SET_PLAYERS_CLAN_NAME

    constructor(public payload: string) {}
}

export class SetPlayersLightHighscore implements Action {
    readonly type = SET_PLAYERS_LIGHT_HIGHSCORE

    constructor(public payload: HighscoreLightProfile) {}
}

export class SetPlayerQuestAchievements implements Action {
    readonly type = SET_PLAYERS_QUEST_ACHIEVEMENTS

    constructor(public payload: Quest[]) {}
}

export class SetPlayersSesonalEvents implements Action {
    readonly type = SET_PLAYERS_SESONAL_EVENTS

    constructor(public payload: SesonalEvent[]) {}
}

export class SetClanMembersOfClan implements Action {
    readonly type = SET_CLAN_MEMBERS_OF_CLAN

    constructor(public payload: ClanMember[]) {}
}

export class FetchClanMembersOfClan implements Action {
    readonly type = FETCH_CLAN_MEMBERS_OF_CLAN

    constructor(public payload: string) {}
}

export class FetchPlayersLightHighscore implements Action {
    readonly type = FETCH_PLAYERS_LIGHT_HIGHSCORE

    constructor(public payload: string) {}
}

export class FetchPlayersClanName implements Action {
    readonly type = FETCH_PLAYERS_CLAN_NAME

    constructor(public payload: string) {}
}

export class FetchPlayersRuneMetricsProfile implements Action {
    readonly type = FETCH_PLAYERS_RUNE_METRICS_PROFILE

    constructor(public payload: string) {}
}

export class FetchPlayersQuestAchievements implements Action {
    readonly type = FETCH_PLAYERS_QUEST_ACHIEVEMENTS

    constructor(public payload: string) {}
}

export class FetchPlayersSesonalEvents implements Action {
    readonly type = FETCH_PLAYERS_SESONAL_EVENTS

    constructor(public payload: string) {}
}

export class SetCallStateOfActionX implements Action {
    readonly type = SET_CALL_STATE_OF_ACTION_X

    constructor(
        public payload: { loadingState: LoadingState; actionType: string; errorMsg: string }
    ) {}
}

export type HighscoreActions =
    | SetPlayerRuneMetricsProfile
    | SetClanMembersOfClan
    | SetPlayerQuestAchievements
    | SetPlayersLightHighscore
    | SetPlayersSesonalEvents
    | SetPlayersClanName
    | FetchClanMembersOfClan
    | FetchPlayersLightHighscore
    | SetCallStateOfActionX
    | FetchClanMembersOfClan
    | FetchPlayersClanName
    | FetchPlayersRuneMetricsProfile
    | FetchPlayersQuestAchievements
    | FetchPlayersSesonalEvents
