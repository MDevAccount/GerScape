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
        private highscoreService: HighscoreService) {

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
                                return of(new HighscoreActions.SetQuestResponse(new QuestResponse([], ""))); 
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
                                return new HighscoreActions.SetPlayerDetails(playerDetails);
                            }, 
                            catchError((questsError: QuestsError) => {
                                return of(new HighscoreActions.SetPlayerDetails(new PlayerDetails(false, false, "", "", ""))); 
                            }))
                        )
            })
        );

    @Effect()
    fetchClanMembers = this.actions$
        .pipe(
            ofType(HighscoreActions.FETCH_CLAN_MEMBERS),
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
                                return of(new HighscoreActions.SetClanMembers([])); 
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
                                return of(new HighscoreActions.SetSesonalEvents([])); 
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
                                //Remove last diggit here because its nachkommastelle and our pipe will fuck it up 
                                let toStr = "";
                                runeMetricsProfileResponse.skillvalues.forEach((skillValue, index, theArr) => {
                                    toStr = "" + skillValue.xp;
                                    theArr[index].xp = +toStr.substr(0, toStr.length - 1);
                                });
                                return new HighscoreActions.SetRuneMetricsProfile(runeMetricsProfileResponse);
                            }, 
                            catchError((runeMetricsError: RuneMetricsError) => {
                                return of(new HighscoreActions.SetRuneMetricsProfile(new RuneMetricsProfile(0, 0, 0, 0, 0, 0, 0, [], [], "", "", 0, 0, ""))); 
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
                                let highscoreLight = new HighscoreLight(0, 0, 0, [], []);
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
                                return new HighscoreActions.SetHighscoreLight(highscoreLight);
                            }, 
                            catchError(error => {
                                return of(new HighscoreActions.SetHighscoreLight(new HighscoreLight(0, 0, 0, [], []))); 
                            }))
                        )
            })
        );

    
    // private createRunescapeProfileLight(playerName: string, highscoreLightData: HighscoreLightData) : RunescapeProfile {
    //     let runescapeProfile = new RunescapeProfile(
    //         "",
    //         0,
    //         0,
    //         0,
    //         0,
    //         0,
    //         0,
    //         0,
    //         0,
    //         0,
    //         new Clan("", false, "", []),
    //         [],
    //         [],
    //         [],
    //         [] 
    //     );

    //     let skills: Skill[] = [];

    //     highscoreLightData.data.split('/n').forEach((skillString, skillIndex) => {

    //         let skill = new Skill(
    //             skillIndex - 1,
    //             RunescapeProfile[skillIndex - 1].name,
    //             0,
    //             0,
    //             0,
    //             0,
    //             0
    //         );

    //         skillString.split(',').forEach((skillData, splitIndex)   => {
    //             if (skillIndex == 0 ) {
    //                 if (splitIndex == 0) {
    //                     runescapeProfile.totalRank;
    //                 }           
    //                 if (splitIndex == 1) {
    //                     runescapeProfile.totalLevel;
    //                 }                   
    //                 if (splitIndex == 2) {
    //                     runescapeProfile.totalXp;
    //                 }
    //             } else if (splitIndex == 0) {
    //                 skill.rank = +skillData;
    //             } else if (splitIndex == 1) {
    //                 skill.level = +skillData;
    //                 skill.virtualLevel = this.highscoreService.getVirtualLevelForXp(skill.level, false),
    //                 skill.virtualLevelNoLimit = this.highscoreService.getVirtualLevelForXp(skill.level, true)
    //             } else if (splitIndex == 2) {
    //                 skill.xp = +skillData;
    //             }
    //         })

    //         skills.push(skill);
    //     })

    //     runescapeProfile.name = playerName;
    //     runescapeProfile.skills = skills;
    //     runescapeProfile.virtualTotalLevel = skills.reduce((sum, skill) => sum += skill.virtualLevel, 0);
    //     runescapeProfile.virtualTotalLevelNoLimit = skills.reduce((sum, skill) => sum += skill.virtualLevelNoLimit, 0);
        
    //     console.log(runescapeProfile);
    //     return runescapeProfile;
    // }
    
    // private createRunescapeProfile(runeMetricsData: RuneMetricsData) : RunescapeProfile {
    //     //TODO -> erfinden seperat virtuelle lvl getten

    //     let skills: Skill[] = [];
    //     runeMetricsData.skillvalues.forEach(skill => {
    //         skills.push(new Skill(
    //             skill.id,
    //             RunescapeProfile[skill.id].name,
    //             skill.xp,
    //             skill.rank,
    //             skill.level,
    //             this.highscoreService.getVirtualLevelForXp(skill.xp, false),
    //             this.highscoreService.getVirtualLevelForXp(skill.xp, true)
    //         ));
    //     });

    //     let activities: Activity[] = [];
    //     runeMetricsData.activities.forEach(activity => {
    //         activities.push(new Activity(
    //             new Date(activity.date),
    //             activity.details,
    //             activity.text
    //         ));
    //     });

    //     let runescapeProfile = new RunescapeProfile(
    //         runeMetricsData.name,
    //         +runeMetricsData.rank.replace(',', ''),
    //         runeMetricsData.totalxp,
    //         runeMetricsData.totalskill,
    //         skills.reduce((sum, skill) => sum += skill.virtualLevel, 0),
    //         skills.reduce((sum, skill) => sum += skill.virtualLevelNoLimit, 0),
    //         runeMetricsData.combatlevel,
    //         runeMetricsData.questsstarted,
    //         runeMetricsData.questsnotstarted,
    //         runeMetricsData.questscomplete,
    //         new Clan("", false, "", []),
    //         [],
    //         [],
    //         skills,
    //         activities 
    //     );

    //     console.log(runescapeProfile);
    //     return runescapeProfile;
    // }


}