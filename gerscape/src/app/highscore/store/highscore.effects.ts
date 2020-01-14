import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, tap, finalize } from 'rxjs/operators';
import { of, forkJoin, merge } from 'rxjs';
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
import { HttpClient } from '@angular/common/http';


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

    @Effect()
    fetchEverything = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_EVERYTHING),
            switchMap((action: HighscoreActions.FetchEverything) => {
                this.store.dispatch(new HighscoreActions.SetIsFetchingData(true));
                const playerName = action.payload;
                return forkJoin(
                    [
                        this.highscoreService.createHttpGetRequest<QuestResponse>(true, playerName, HighscoreService.URL_PLAYER_QUESTS, false)
                            .pipe(
                                map(questResponse => {
                                    return questResponse;
                                }, 
                                catchError((questsError: QuestsError) => {
                                    return null; 
                                }))
                            ),
                        this.highscoreService.createHttpGetRequest<string>(true, playerName, HighscoreService.URL_PLAYER_DETAILS, true)
                            .pipe(
                                map(playerDetailsResponse => {
                                    return this.handlePlayerDetailsResponse(playerDetailsResponse);
                                }, 
                                catchError(error => {
                                    return null; 
                                }))
                            ),
                        this.highscoreService.createHttpGetRequest<SesonalEvent[]>(true, playerName, HighscoreService.URL_SESONAL_EVENTS, false)
                            .pipe(
                                map(sesonalEventsResponse => {
                                    return sesonalEventsResponse;
                                }, 
                                catchError(error => {
                                    return null; 
                                }))
                            ),
                        this.highscoreService.createHttpGetRequest<RuneMetricsProfile>(true, playerName, HighscoreService.URL_RUNEMETRICS_PROFILE, false)
                            .pipe(
                                map(runeMetricsProfileResponse => {
                                    return this.handleRuneMetricsResponse(runeMetricsProfileResponse);
                                }, 
                                catchError((runeMetricsError: RuneMetricsError) => {
                                    return null; 
                                }))
                            ),
                        this.highscoreService.createHttpGetRequest<string>(true, playerName, HighscoreService.URL_PLAYER_HIGHSCORE_LIGHT, true)
                        .pipe(
                            map(strResponse => {
                               return this.handleHighscoreLightResponse(strResponse, playerName);
                            }, 
                            catchError(error => {
                                return null; 
                            }))
                        )
                    ]
                )
            }),
            map(forks => {
                const playerDetailsResponse = forks[1];

                this.store.dispatch(new HighscoreActions.SetQuestResponse(forks[0]));
                this.store.dispatch(new HighscoreActions.SetPlayerDetails(forks[1]));
                this.store.dispatch(new HighscoreActions.SetSesonalEvents(forks[2]));
                this.store.dispatch(new HighscoreActions.SetRuneMetricsProfile(forks[3]));
                this.store.dispatch(new HighscoreActions.SetHighscoreLight(forks[4]));
                //this.store.dispatch(new HighscoreActions.FetchClanMembers(playerDetailsResponse ? playerDetailsResponse.clan : ""));
                return playerDetailsResponse ? playerDetailsResponse.clan : null;
            }),
            map(clanName => {
                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                return new HighscoreActions.FetchClanMembers(clanName);
            })  
        );

    @Effect()
    fetchQuests = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_QUESTS),
            switchMap((action: HighscoreActions.FetchQuests) => {
                const playerName = action.payload;
                const url = HighscoreService.URL_PLAYER_QUESTS;
                this.store.dispatch(new HighscoreActions.SetIsFetchingData(true));
                return this.highscoreService
                    .createHttpGetRequest<QuestResponse>(true, playerName, url, false)
                        .pipe(
                            map(questResponse => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return new HighscoreActions.SetQuestResponse(questResponse);
                            }, 
                            catchError((questsError: QuestsError) => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return of(new HighscoreActions.SetQuestResponse(null)); 
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
                const url = HighscoreService.URL_PLAYER_DETAILS;
                this.store.dispatch(new HighscoreActions.SetIsFetchingData(true));
                return this.highscoreService
                    .createHttpGetRequest<string>(true, playerName, url, true)
                        .pipe(
                            map(playerDetailsResponse => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return new HighscoreActions.SetPlayerDetails(this.handlePlayerDetailsResponse(playerDetailsResponse));
                            }, 
                            catchError(error => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return of(new HighscoreActions.SetPlayerDetails(null)); 
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
                const url = HighscoreService.URL_CLANMEMBERS;
                this.store.dispatch(new HighscoreActions.SetIsFetchingData(true));
                return this.highscoreService
                    .createHttpGetRequest<string>(true, clanName, url, true)
                        .pipe(
                            map(strResponse => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return new HighscoreActions.SetClanMembers(this.handleClanMemberResponse(strResponse));
                            }, 
                            catchError(error  => {
                                console.log("error: " + error);
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return of(new HighscoreActions.SetClanMembers(null)); 
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
                const url = HighscoreService.URL_SESONAL_EVENTS;
                this.store.dispatch(new HighscoreActions.SetIsFetchingData(true));
                return this.highscoreService
                    .createHttpGetRequest<SesonalEvent[]>(true, playerName, url, false)
                        .pipe(
                            map(sesonalEventsResponse => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return new HighscoreActions.SetSesonalEvents(sesonalEventsResponse);
                            }, 
                            catchError(error => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return of(new HighscoreActions.SetSesonalEvents(null)); 
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
                const url = HighscoreService.URL_RUNEMETRICS_PROFILE;
                this.store.dispatch(new HighscoreActions.SetIsFetchingData(true));
                return this.highscoreService
                    .createHttpGetRequest<RuneMetricsProfile>(true, playerName, url, false)
                        .pipe(
                            map(runeMetricsProfileResponse => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return new HighscoreActions.SetRuneMetricsProfile(this.handleRuneMetricsResponse(runeMetricsProfileResponse));
                            }, 
                            catchError((runeMetricsError: RuneMetricsError) => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return of(new HighscoreActions.SetRuneMetricsProfile(null)); 
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
                const url = HighscoreService.URL_PLAYER_HIGHSCORE_LIGHT;
                this.store.dispatch(new HighscoreActions.SetIsFetchingData(true));
                return this.highscoreService
                    .createHttpGetRequest<string>(true, playerName, url, true)
                        .pipe(
                            map(strResponse => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                               return new HighscoreActions.SetHighscoreLight(this.handleHighscoreLightResponse(strResponse, playerName));
                            }, 
                            catchError(error => {
                                this.store.dispatch(new HighscoreActions.SetIsFetchingData(false));
                                return of(new HighscoreActions.SetHighscoreLight(null)); 
                            }))
                        )
            })
        );


    handlePlayerDetailsResponse(playerDetailsResponse: string) {
        let response = playerDetailsResponse.split("[")[1].split("]")[0];
        let playerDetails: PlayerDetails = JSON.parse(response);
        return playerDetails;
    }

    handleClanMemberResponse(strResponse: string) {
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