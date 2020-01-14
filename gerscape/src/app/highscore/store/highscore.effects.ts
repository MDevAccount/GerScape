import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as HighscoreActions  from './highscore.actions';
import { HighscoreService } from '../service/highscore.service';
import { HighscoreLight, Skill, Minigame } from 'src/app/highscore/model/highscore-light.model';
import { RuneMetricsProfile } from 'src/app/highscore/model/runemetrics-profile.model';
import { QuestResponse } from '../model/quest.model';
import { PlayerDetails } from '../model/player-details.model';
import { SesonalEvent } from '../model/sesonal-event.model';
import { ClanMember, Role } from '../model/clanmember.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';


interface RuneMetricsError {
    error: string;
    loggedIn: boolean;
}

interface QuestsError {
    quests:	[];
    loggedIn: boolean;
}

@Injectable()
export class HighscoreEffects {


    constructor(
        private actions$: Actions,
        private highscoreService: HighscoreService,
        private store: Store<AppState>) {

    }

    // @Effect()
    // fetchEverything = this.actions$
    //     .pipe(
    //         ofType(HighscoreActions.FETCH_EVERYTHING),
    //         switchMap((action: HighscoreActions.FetchEverything) => {
    //             this.store.dispatch(new HighscoreActions.SetIsFetchingData(true));
    //             const playerName = action.payload;
    //             return forkJoin(
    //                 [
    //                     this.highscoreService.createHttpGetRequest<QuestResponse>(playerName, HighscoreService.URL_PLAYER_QUESTS, false)
    //                         .pipe(
    //                             map(questResponse => {
    //                                 return questResponse;
    //                             }, 
    //                             catchError((questsError: QuestsError) => {
    //                                 return null; 
    //                             }))
    //                         ),
    //                     this.highscoreService.createHttpGetRequest<string>(playerName, HighscoreService.URL_PLAYER_DETAILS, true)
    //                         .pipe(
    //                             map(playerDetailsResponse => {
    //                                 return this.handlePlayerDetailsResponse(playerDetailsResponse);
    //                             }, 
    //                             catchError(error => {
    //                                 return null; 
    //                             }))
    //                         ),
    //                     this.highscoreService.createHttpGetRequest<SesonalEvent[]>(playerName, HighscoreService.URL_SESONAL_EVENTS, false)
    //                         .pipe(
    //                             map(sesonalEventsResponse => {
    //                                 console.log("test1");
    //                                 return sesonalEventsResponse;
    //                             }, 
    //                             catchError(error => {
    //                                 console.log("test");
    //                                 return null; 
    //                             }))
    //                         ),
    //                     this.highscoreService.createHttpGetRequest<RuneMetricsProfile>(playerName, HighscoreService.URL_RUNEMETRICS_PROFILE, false)
    //                         .pipe(
    //                             map(runeMetricsProfileResponse => {
    //                                 return this.handleRuneMetricsResponse(runeMetricsProfileResponse);
    //                             }, 
    //                             catchError((runeMetricsError: RuneMetricsError) => {
    //                                 return null; 
    //                             }))
    //                         ),
    //                     this.highscoreService.createHttpGetRequest<string>(playerName, HighscoreService.URL_PLAYER_HIGHSCORE_LIGHT, true)
    //                     .pipe(
    //                         map(strResponse => {
    //                            return this.handleHighscoreLightResponse(strResponse, playerName);
    //                         }, 
    //                         catchError(error => {
    //                             return null; 
    //                         }))
    //                     )
    //                 ]
    //             )
    //         }),
    //         map(forks => {
    //             const playerDetailsResponse = forks[1];
    //             console.log(playerDetailsResponse);
    //             this.store.dispatch(new HighscoreActions.SetQuestResponse(forks[0]));
    //             this.store.dispatch(new HighscoreActions.SetPlayerDetails(forks[1]));
    //             this.store.dispatch(new HighscoreActions.SetSesonalEvents(forks[2]));
    //             this.store.dispatch(new HighscoreActions.SetRuneMetricsProfile(forks[3]));
    //             this.store.dispatch(new HighscoreActions.SetHighscoreLight(forks[4]));
    //             this.store.dispatch(new HighscoreActions.FetchClanMembers(playerDetailsResponse ? playerDetailsResponse.clan : null));
                
    //             return new HighscoreActions.SetIsFetchingData(false);
    //         })
    //     );

    // @Effect()
    // fetchAny = this.actions$
    //     .pipe(
    //         ofType(HighscoreActions.FETCH_ANY),
    //         switchMap((action: HighscoreActions.FetchAny) => {
    //             const param = action.payload.searchParam;
    //             action.payload.highscoreAction
    //             HighscoreActions.
    //             if (!param) {
    //                 return of()
    //             }
    //         })
    //     );

    @Effect()
    fetchQuests = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_QUESTS),
            switchMap((action: HighscoreActions.FetchQuests) => {
                const playerName = action.payload;
                if (!playerName)
                    return of(new HighscoreActions.SetQuestResponse(null)); 
                this.store.dispatch(new HighscoreActions.SetIsLoadingQuestResponse(true));
                const url = HighscoreService.URL_PLAYER_QUESTS;
                return this.highscoreService
                    .createHttpGetRequest<QuestResponse>(playerName, url, false)
                        .pipe(
                            map(questResponse => {
                                this.store.dispatch(new HighscoreActions.SetQuestResponse(questResponse));
                                return new HighscoreActions.SetIsLoadingQuestResponse(false);
                            }, 
                            catchError((questsError: QuestsError) => {
                                this.store.dispatch(new HighscoreActions.SetQuestResponse(null));
                                return of(new HighscoreActions.SetIsLoadingQuestResponse(false)); 
                            })
                        )
                    )
            })
        );

    @Effect()
    fetchPlayerDetails = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_PLAYER_DETAILS),
            switchMap((action: HighscoreActions.FetchPlayerDetails) => {
                const playerName = action.payload;
                if (!playerName)
                this.store.dispatch(new HighscoreActions.SetIsLoadingPlayerDetails(true));
                const url = HighscoreService.URL_PLAYER_DETAILS;
                return this.highscoreService
                    .createHttpGetRequest<string>(playerName, url, true)
                        .pipe(
                            map(playerDetailsResponse => {
                                this.store.dispatch(new HighscoreActions.SetPlayerDetails(this.handlePlayerDetailsResponse(playerDetailsResponse)));
                                return new HighscoreActions.SetIsLoadingPlayerDetails(false);
                            }, 
                            catchError(error => {
                                this.store.dispatch(new HighscoreActions.SetPlayerDetails(null));
                                return of(new HighscoreActions.SetIsLoadingPlayerDetails(false)); 
                            }))
                        )
            })
        );

    @Effect()
    fetchClanMembers = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_CLAN_MEMBERS),
            switchMap((action: HighscoreActions.FetchClanMembers) => {
                const clanName = action.payload;
                if (!clanName)
                    return of(new HighscoreActions.SetClanMembers(null)); 
                this.store.dispatch(new HighscoreActions.SetIsLoadingClanMembers(true));
                const url = HighscoreService.URL_CLANMEMBERS;
                return this.highscoreService
                    .createHttpGetRequest<string>(clanName, url, true)
                        .pipe(
                            map(strResponse => {
                                this.store.dispatch(new HighscoreActions.SetClanMembers(this.handleClanMemberResponse(strResponse)));
                                this.store.dispatch(new HighscoreActions.SetIsClanless(false));
                                return new HighscoreActions.SetIsLoadingClanMembers(false);
                            }, 
                            catchError(error  => {
                                console.log("error: " + error);
                                this.store.dispatch(new HighscoreActions.SetClanMembers(null));
                                this.store.dispatch(new HighscoreActions.SetIsClanless(true));
                                return of(new HighscoreActions.SetIsLoadingClanMembers(false)); 
                            }))
                        )
            })
        );

    @Effect()
    fetchSesonalEvents = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_SESONAL_EVENTS),
            switchMap((action: HighscoreActions.FetchSesonalEvents) => {
                const playerName = action.payload;
                if (!playerName)
                    return of(new HighscoreActions.SetSesonalEvents(null)); 
                this.store.dispatch(new HighscoreActions.SetIsLoadingSesonalEvents(true));
                const url = HighscoreService.URL_SESONAL_EVENTS;
                return this.highscoreService
                    .createHttpGetRequest<SesonalEvent[]>(playerName, url, false)
                        .pipe(
                            map(sesonalEventsResponse => {
                                this.store.dispatch(new HighscoreActions.SetSesonalEvents(sesonalEventsResponse));
                                return new HighscoreActions.SetIsLoadingSesonalEvents(false);
                            }, 
                            catchError(error => {
                                this.store.dispatch(new HighscoreActions.SetSesonalEvents(null));
                                return of(new HighscoreActions.SetIsLoadingSesonalEvents(false)); 
                            }))
                        )
            })
        );
    
    @Effect()
    fetchRuneMetricsProfile = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_RUNEMETRICS_PROFILE),
            switchMap((action: HighscoreActions.FetchRuneMetricsProfile) => {
                const playerName = action.payload;
                if (!playerName)
                    return of(new HighscoreActions.SetRuneMetricsProfile(null)); 
                this.store.dispatch(new HighscoreActions.SetIsLoadingRuneMetricsProfile(true));
                const url = HighscoreService.URL_RUNEMETRICS_PROFILE;
                return this.highscoreService
                    .createHttpGetRequest<RuneMetricsProfile>(playerName, url, false)
                        .pipe(
                            map(runeMetricsProfileResponse => {
                                this.store.dispatch(new HighscoreActions.SetRuneMetricsProfile(this.handleRuneMetricsResponse(runeMetricsProfileResponse)));
                                return new HighscoreActions.SetIsLoadingRuneMetricsProfile(false);
                            }, 
                            catchError((runeMetricsError: RuneMetricsError) => {
                                this.store.dispatch(new HighscoreActions.SetRuneMetricsProfile(null));
                                return of(new HighscoreActions.SetIsLoadingRuneMetricsProfile(false)); 
                            }))
                        )
            })
        );

    @Effect()
    fetchHighscoreLight = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_HIGHSCORE_LIGHT),
            switchMap((action: HighscoreActions.FetchHighscoreLight) => {
                const playerName = action.payload;
                if (!playerName)
                    return of(new HighscoreActions.SetHighscoreLight(null)); 
                this.store.dispatch(new HighscoreActions.SetIsLoadingHighscoreLight(true));
                const url = HighscoreService.URL_PLAYER_HIGHSCORE_LIGHT;
                return this.highscoreService
                    .createHttpGetRequest<string>(playerName, url, true)
                        .pipe(
                            map(strResponse => {
                                this.store.dispatch(new HighscoreActions.SetHighscoreLight(this.handleHighscoreLightResponse(strResponse, playerName)));
                                return new HighscoreActions.SetIsLoadingHighscoreLight(false);
                            }, 
                            catchError(error => {
                                this.store.dispatch(new HighscoreActions.SetHighscoreLight(null));
                                return of(new HighscoreActions.SetIsLoadingHighscoreLight(false)); 
                            }))
                        )
            })
        );


    handlePlayerDetailsResponse(playerDetailsResponse: string) {
        if (!playerDetailsResponse)
            return null;
        let response = playerDetailsResponse.split("[")[1].split("]")[0];
        let playerDetails: PlayerDetails = JSON.parse(response);
        return playerDetails;
    }

    handleClanMemberResponse(strResponse: string) {
        if (!strResponse)
            return null;
        if (!strResponse.startsWith("Clanmate, Clan Rank, Total XP, Kills")) {
            return null;
        } else {
            let clanMembers: ClanMember[] = [];
            let role;
            strResponse.split('\n').forEach((clanMember, index) => {
                const clanMemberProperty = clanMember.split(",");
                if (index > 0) {
                    role = Object.keys(Role).filter(k => k == clanMemberProperty[1]);
                    //role = Object.keys(Role).filter(role => role == clanMemberProperty[1]);
                    clanMembers.push(new ClanMember(clanMemberProperty[0], role, +clanMemberProperty[2], +clanMemberProperty[3]));
                } 
            });
            return clanMembers;
        }
    }

    handleRuneMetricsResponse(runeMetricsProfileResponse: RuneMetricsProfile) {
        if (!runeMetricsProfileResponse.skillvalues) {
            this.store.dispatch(new HighscoreActions.SetIsRuneMetricsProfilePrivate(true));
            return null; 
        } else {
            this.store.dispatch(new HighscoreActions.SetIsRuneMetricsProfilePrivate(false));
            //Remove last diggit here because its nachkommastelle and our pipe will fuck it up 
            let toStr = "";
            runeMetricsProfileResponse.skillvalues.forEach((skillValue, index, theArr) => {
                toStr = "" + skillValue.xp;
                theArr[index].xp = +toStr.substr(0, toStr.length - 1);
            });
            return runeMetricsProfileResponse;
        }
    }

    handleHighscoreLightResponse(strResponse: string, playerName: string) {
        if (!strResponse)
            return null;
        let highscoreLight = new HighscoreLight("", 0, 0, 0, 0, [], []);
        strResponse.split('\n').forEach((skillData, index) => {
            const skillProperty = skillData.split(",");
            if (index == 0) {
                highscoreLight.totalRank = +skillProperty[0];
                highscoreLight.totalLevel = +skillProperty[1];
                highscoreLight.totalXp = +skillProperty[2];
            } else  if (index <= 27) {
                highscoreLight.skills.push(new Skill(index - 1, +skillProperty[1], +skillProperty[2], +skillProperty[0]));
            } else {
                highscoreLight.minigames.push(new Minigame(+skillProperty[1], + skillProperty[0]));
            }    
        });
        let combatLevel = HighscoreService.getCombatLevel(
            highscoreLight.skills[0].level,
            highscoreLight.skills[2].level,
            highscoreLight.skills[6].level,
            highscoreLight.skills[4].level,
            highscoreLight.skills[1].level,
            highscoreLight.skills[3].level,
            highscoreLight.skills[5].level,
            highscoreLight.skills[23].level
        );
        highscoreLight.combatLevel = combatLevel;
        highscoreLight.name = playerName;
        return highscoreLight;
    }
}