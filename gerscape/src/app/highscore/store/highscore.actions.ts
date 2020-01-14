import { Action } from '@ngrx/store';
import { HighscoreLight } from 'src/app/highscore/model/highscore-light.model';
import { QuestResponse } from 'src/app/highscore/model/quest.model';
import { RuneMetricsProfile } from 'src/app/highscore/model/runemetrics-profile.model';
import { PlayerDetails } from '../model/player-details.model';
import { SesonalEvent } from '../model/sesonal-event.model';
import { ClanMember } from '../model/clanmember.model';


export const SET_PLAYER_DETAILS = "[Highscore] Set player details";
export const SET_CLAN_MEMBERS = "[Highscore] Set clan members";
export const SET_SESONAL_EVENTS = "[Highscore] Set sesonal events";
export const SET_QUESTS = "[Highscore] Set quests";
export const SET_HIGHSCORE_LIGHT = "[Highscore] Set highscore light";
export const SET_RUNEMETRICS_PROFILE = "[Highscore] Set runemetrics profile";
export const FETCH_PLAYER_DETAILS = "[Highscore] Fetch player details";
export const FETCH_CLAN_MEMBERS = "[Highscore] Fetch clan members";
export const FETCH_SESONAL_EVENTS = "[Highscore] Fetch sesonal events";
export const FETCH_HIGHSCORE_LIGHT = "[Highscore] Fetch highscore light";
export const FETCH_QUESTS = "[Highscore] Fetch quests";
export const FETCH_RUNEMETRICS_PROFILE = "[Highscore] Fetch runemetrics profile";
export const SET_IS_RUNEMETRICS_PROFILE_PRIVATE = "[Highscore] Set is runemetrics profile private";
export const SET_IS_FETCHING_DATA = "[Highscore] Set is fetching data";
export const FETCH_EVERYTHING = "[Highscore] Fetch everything";

export class SetHighscoreLight implements Action {
    readonly type = SET_HIGHSCORE_LIGHT;

    constructor(public payload: HighscoreLight) {

    }
}

export class FetchHighscoreLight implements Action {
    readonly type = FETCH_HIGHSCORE_LIGHT;
    
    constructor(public payload: string) {

    }
}

export class FetchEverything implements Action {
    readonly type = FETCH_EVERYTHING;
    
    constructor(public payload: string) {

    }
}

export class SetIsFetchingData implements Action {
    readonly type = SET_IS_FETCHING_DATA;
    
    constructor(public payload: boolean) {

    }
}

export class SetIsRuneMetricsProfilePrivate implements Action {
    readonly type = SET_IS_RUNEMETRICS_PROFILE_PRIVATE;
    
    constructor(public payload: boolean) {

    }
}

export class SetPlayerDetails implements Action {
    readonly type = SET_PLAYER_DETAILS;

    constructor(public payload: PlayerDetails) {

    }
}

export class FetchPlayerDetails implements Action {
    readonly type = FETCH_PLAYER_DETAILS;

    constructor(public payload: string) {

    }
}

export class SetQuestResponse implements Action {
    readonly type = SET_QUESTS;

    constructor(public payload: QuestResponse) {

    }
}

export class FetchQuests implements Action {
    readonly type = FETCH_QUESTS;

    constructor(public payload: string) {

    }
}

export class SetSesonalEvents implements Action {
    readonly type = SET_SESONAL_EVENTS;

    constructor(public payload: SesonalEvent[]) {

    }
}

export class FetchSesonalEvents implements Action {
    readonly type = FETCH_SESONAL_EVENTS;

    constructor(public payload: string) {

    }
}

export class SetClanMembers implements Action {
    readonly type = SET_CLAN_MEMBERS;

    constructor(public payload: ClanMember[]) {

    }
}

export class FetchClanMembers implements Action {
    readonly type = FETCH_CLAN_MEMBERS;

    constructor(public payload: string) {

    }
}

export class SetRuneMetricsProfile implements Action {
    readonly type = SET_RUNEMETRICS_PROFILE;

    constructor(public payload: RuneMetricsProfile) {

    }

}

export class FetchRuneMetricsProfile implements Action {
    readonly type = FETCH_RUNEMETRICS_PROFILE;

    constructor(public payload: string) {

    }
}

export type HighscoreActions = 
    | FetchClanMembers
    | SetClanMembers
    | FetchSesonalEvents
    | SetSesonalEvents
    | FetchSesonalEvents
    | FetchQuests
    | SetQuestResponse
    | FetchPlayerDetails
    | SetPlayerDetails
    | SetHighscoreLight
    | FetchHighscoreLight
    | FetchRuneMetricsProfile
    | SetRuneMetricsProfile
    | SetIsRuneMetricsProfilePrivate
    | SetIsFetchingData
    | FetchEverything;

