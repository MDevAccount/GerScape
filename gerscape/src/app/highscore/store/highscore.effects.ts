import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
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

    @Effect()
    fetchQuests = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_QUESTS),
            switchMap((action: HighscoreActions.FetchQuests) => {
                const playerName = action.payload;
                const url = HighscoreService.URL_PLAYER_QUESTS;
                return this.highscoreService
                    .createHttpGetRequest<QuestResponse>(playerName, url)
                        .pipe(
                            map(questResponse => {
                                return new HighscoreActions.SetQuestResponse(questResponse);
                            }, 
                            catchError((questsError: QuestsError) => {
                                return of(new HighscoreActions.SetQuestResponse(null)); 
                            }))
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
                return this.highscoreService
                    .createHttpGetRequest<string>(playerName, url, true)
                        .pipe(
                            map(playerDetailsResponse => {
                                let response = playerDetailsResponse.split("[")[1].split("]")[0];
                                let playerDetails: PlayerDetails = JSON.parse(response);
                                this.store.dispatch(new HighscoreActions.SetIsClanless(playerDetails.clan == ""));
                                return new HighscoreActions.SetPlayerDetails(playerDetails);
                            }, 
                            catchError((questsError: QuestsError) => {
                                return of(new HighscoreActions.SetPlayerDetails(null)); 
                            }))
                        )
            })
        );

    @Effect()
    fetchClanMembers = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_CLAN_MEMBERS),
            withLatestFrom(this.store.select('highscore')),
            switchMap(([actionData , highscoreState]) => {
                if (highscoreState.isClanless) {
                    let action: HighscoreActions.FetchClanMembers = actionData;
                    return throwError("Player " + action.payload + " is not in a clan!");
                } else {
                    return actionData;
                }
            }),
            switchMap((action: HighscoreActions.FetchClanMembers) => {
                const playerName = action.payload;
                const url = HighscoreService.URL_CLANMEMBERS;
                return this.highscoreService
                    .createHttpGetRequest<string>(playerName, url, true)
                        .pipe(
                            map(strResponse => {
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
                                return new HighscoreActions.SetClanMembers(clanMembers);
                            }, 
                            catchError(error  => {
                                console.log("error: " + error);
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
                return this.highscoreService
                    .createHttpGetRequest<SesonalEvent[]>(playerName, url)
                        .pipe(
                            map(sesonalEventsResponse => {
                                return new HighscoreActions.SetSesonalEvents(sesonalEventsResponse);
                            }, 
                            catchError(error => {
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
                return this.highscoreService
                    .createHttpGetRequest<RuneMetricsProfile>(playerName, url)
                        .pipe(
                            map(runeMetricsProfileResponse => {
                                if (!runeMetricsProfileResponse.skillvalues) {
                                    this.store.dispatch(new HighscoreActions.SetIsRuneMetricsProfilePrivate(true));
                                    return new HighscoreActions.SetRuneMetricsProfile(null); 
                                } else {
                                    this.store.dispatch(new HighscoreActions.SetIsRuneMetricsProfilePrivate(false));
                                    //Remove last diggit here because its nachkommastelle and our pipe will fuck it up 
                                    let toStr = "";
                                    console.log(runeMetricsProfileResponse);
                                    runeMetricsProfileResponse.skillvalues.forEach((skillValue, index, theArr) => {
                                        toStr = "" + skillValue.xp;
                                        theArr[index].xp = +toStr.substr(0, toStr.length - 1);
                                    });
                                    return new HighscoreActions.SetRuneMetricsProfile(runeMetricsProfileResponse);
                                }
                            }, 
                            catchError((runeMetricsError: RuneMetricsError) => {
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
                return this.highscoreService
                    .createHttpGetRequest<string>(playerName, url, true)
                        .pipe(
                            map(strResponse => {
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
                                return new HighscoreActions.SetHighscoreLight(highscoreLight);
                            }, 
                            catchError(error => {
                                return of(new HighscoreActions.SetHighscoreLight(null)); 
                            }))
                        )
            })
        );


}