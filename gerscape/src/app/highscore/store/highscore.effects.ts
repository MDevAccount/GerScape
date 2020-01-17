import { Injectable } from '@angular/core'
import { Actions, ofType, Effect } from '@ngrx/effects'
import { switchMap, map, catchError } from 'rxjs/operators'
import * as HighscoreActions from './highscore.actions'
import { Role, ClanMember } from '../model/clan-member.model'
import { HighscoreService } from '../service/highscore.service'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { HttpClient } from '@angular/common/http'
import { of, empty } from 'rxjs'
import { Skill } from '../model/skill.model'
import { HighscoreLightProfile } from '../model/highscore-light-profile.model'
import { LoadingState } from 'src/app/shared/model/call-state.model'
import { RuneMetricsProfile } from '../model/runemetrics-profile.model'
import { Activity } from '../model/activity.model'
import { Quest, Status } from '../model/quest.model'
import { SesonalEvent } from '../model/sesonal-event.model'

export interface RuneMetricsResponse {
    magic: number
    questsstarted: number
    totalskill: number
    questscomplete: number
    questsnotstarted: number
    totalxp: number
    ranged: number
    activities: Activity[]
    skillvalues: Skillvalue[]
    name: string
    rank: string
    melee: number
    combatlevel: number
    loggedIn: string
}

export interface Skillvalue {
    level: number
    xp: number
    rank: number
    id: number
}

export interface QuestResponse {
    quests: QuestValue[]
    loggedIn: string
}

export interface QuestValue {
    title: string
    status: Status
    difficulty: number
    members: boolean
    questPoints: number
    userEligible: boolean
}

export interface SesonalEventsResponse {
    score_raw: number
    endDate: string
    score_formatted: string
    rank: number
    hiscoreId: number
    title: string
    startDate: string
}

@Injectable()
export class HighscoreEffects {
    constructor(
        private actions$: Actions,
        private highscoreService: HighscoreService,
        private store: Store<AppState>,
        private http: HttpClient
    ) {}

    @Effect()
    fetchClanMembers = this.actions$.pipe(
        ofType(HighscoreActions.FETCH_CLAN_MEMBERS_OF_CLAN),
        switchMap((action: HighscoreActions.FetchClanMembersOfClan) => {
            const url = this.highscoreService.getCompleteUrl(
                HighscoreService.URL_CLANMEMBERS,
                action.payload
            )
            this.highscoreService.dispatchCallStateOfActionX(LoadingState.LOADING, action.type)

            return this.http
                .get<string>(url, { responseType: 'text' as 'json' })
                .pipe(
                    map((clanMembers) => {
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.LOADED,
                            action.type
                        )

                        return new HighscoreActions.SetClanMembersOfClan(
                            this.handleClanMemberResponse(clanMembers)
                        )
                    }),
                    catchError((error) => {
                        console.log(error)
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.ERROR,
                            action.type,
                            error
                        )

                        return of(new HighscoreActions.SetClanMembersOfClan(null))
                    })
                )
        })
    )

    @Effect()
    fetchHighscoreLight = this.actions$.pipe(
        ofType(HighscoreActions.FETCH_PLAYERS_LIGHT_HIGHSCORE),
        switchMap((action: HighscoreActions.FetchPlayersLightHighscore) => {
            const url = this.highscoreService.getCompleteUrl(
                HighscoreService.URL_PLAYER_HIGHSCORE_LIGHT,
                action.payload
            )
            this.highscoreService.dispatchCallStateOfActionX(LoadingState.LOADING, action.type)

            return this.http
                .get<string>(url, { responseType: 'text' as 'json' })
                .pipe(
                    map((highscoreLightResponse) => {
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.LOADED,
                            action.type
                        )
                        const highscoreLight = this.handleHighscoreLightResponse(
                            highscoreLightResponse,
                            action.payload
                        )
                        if (!highscoreLight)
                            this.highscoreService.dispatchCallStateOfActionX(
                                LoadingState.ERROR,
                                action.type
                            )
                        return new HighscoreActions.SetPlayersLightHighscore(highscoreLight)
                    }),
                    catchError((error) => {
                        console.log(error)
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.ERROR,
                            action.type,
                            error
                        )

                        return of(new HighscoreActions.SetPlayersLightHighscore(null))
                    })
                )
        })
    )

    @Effect()
    fetchPlayersClanName = this.actions$.pipe(
        ofType(HighscoreActions.FETCH_PLAYERS_CLAN_NAME),
        switchMap((action: HighscoreActions.FetchPlayersClanName) => {
            const url = this.highscoreService.getCompleteUrl(
                HighscoreService.URL_PLAYER_CLAN_NAME,
                action.payload
            )
            this.highscoreService.dispatchCallStateOfActionX(LoadingState.LOADING, action.type)
            return this.http
                .get<string>(url, { responseType: 'text' as 'json' })
                .pipe(
                    map((playerClanData) => {
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.LOADED,
                            action.type
                        )
                        const clanName = this.handlePlayerClanNameResponse(playerClanData)
                        if (!clanName) {
                            this.highscoreService.dispatchCallStateOfActionX(
                                LoadingState.ERROR,
                                action.type
                            )
                        } else if (clanName.length > 0) {
                            this.store.dispatch(
                                new HighscoreActions.FetchClanMembersOfClan(clanName)
                            )
                        }
                        return new HighscoreActions.SetPlayersClanName(clanName)
                    }),
                    catchError((error) => {
                        console.log(error)
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.ERROR,
                            action.type,
                            error
                        )
                        return of(new HighscoreActions.SetPlayersClanName(null))
                    })
                )
        })
    )

    @Effect()
    fetchPlayersRuneMetricsProfile = this.actions$.pipe(
        ofType(HighscoreActions.FETCH_PLAYERS_RUNE_METRICS_PROFILE),
        switchMap((action: HighscoreActions.FetchPlayersRuneMetricsProfile) => {
            const url = this.highscoreService.getCompleteUrl(
                HighscoreService.URL_RUNEMETRICS_PROFILE,
                action.payload
            )
            this.highscoreService.dispatchCallStateOfActionX(LoadingState.LOADING, action.type)
            return this.http.get<RuneMetricsResponse>(url).pipe(
                map((handleRuneMetricsResponse) => {
                    this.highscoreService.dispatchCallStateOfActionX(
                        LoadingState.LOADED,
                        action.type
                    )
                    const runeMetricsProfile = this.handleRuneMetricsResponse(
                        handleRuneMetricsResponse
                    )
                    if (!runeMetricsProfile)
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.ERROR,
                            action.type
                        )
                    return new HighscoreActions.SetPlayerRuneMetricsProfile(runeMetricsProfile)
                }),
                catchError((error) => {
                    console.log(error)
                    this.highscoreService.dispatchCallStateOfActionX(
                        LoadingState.ERROR,
                        action.type,
                        error
                    )
                    return of(new HighscoreActions.SetPlayerRuneMetricsProfile(null))
                })
            )
        })
    )

    @Effect()
    fetchPlayersQuestAchievements = this.actions$.pipe(
        ofType(HighscoreActions.FETCH_PLAYERS_QUEST_ACHIEVEMENTS),
        switchMap((action: HighscoreActions.FetchPlayersQuestAchievements) => {
            const url = this.highscoreService.getCompleteUrl(
                HighscoreService.URL_PLAYER_QUESTS,
                action.payload
            )
            this.highscoreService.dispatchCallStateOfActionX(LoadingState.LOADING, action.type)
            return this.http.get<QuestResponse>(url).pipe(
                map((questResponse) => {
                    this.highscoreService.dispatchCallStateOfActionX(
                        LoadingState.LOADED,
                        action.type
                    )
                    const quests = this.handleQuestsResponse(questResponse)
                    if (!quests)
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.ERROR,
                            action.type
                        )
                    return new HighscoreActions.SetPlayerQuestAchievements(quests)
                }),
                catchError((error) => {
                    console.log(error)
                    this.highscoreService.dispatchCallStateOfActionX(
                        LoadingState.ERROR,
                        action.type,
                        error
                    )
                    return of(new HighscoreActions.SetPlayerQuestAchievements(null))
                })
            )
        })
    )

    @Effect()
    fetchPlayersSesonalEvents = this.actions$.pipe(
        ofType(HighscoreActions.FETCH_PLAYERS_SESONAL_EVENTS),
        switchMap((action: HighscoreActions.FetchPlayersSesonalEvents) => {
            const url = this.highscoreService.getCompleteUrl(
                HighscoreService.URL_SESONAL_EVENTS,
                action.payload
            )
            this.highscoreService.dispatchCallStateOfActionX(LoadingState.LOADING, action.type)
            return this.http.get<SesonalEventsResponse[]>(url).pipe(
                map((sesonalEventsResponse) => {
                    this.highscoreService.dispatchCallStateOfActionX(
                        LoadingState.LOADED,
                        action.type
                    )
                    const sesonalEvents = this.handleSesonalEventsResponse(sesonalEventsResponse)
                    if (!sesonalEvents)
                        this.highscoreService.dispatchCallStateOfActionX(
                            LoadingState.ERROR,
                            action.type
                        )
                    return new HighscoreActions.SetPlayersSesonalEvents(sesonalEvents)
                }),
                catchError((error) => {
                    console.log(error)
                    this.highscoreService.dispatchCallStateOfActionX(
                        LoadingState.ERROR,
                        action.type,
                        error
                    )
                    return of(new HighscoreActions.SetPlayersSesonalEvents(null))
                })
            )
        })
    )
    // @Effect()
    // fetchAnyPlayerData = this.actions$
    //     .pipe(
    //         ofType(HighscoreActions.FETCH_ANY),
    //         flatMap((action: HighscoreActions.FetchAny<any>) => {
    //             // let args1 = action.payload;
    //             // const url1 = HighscoreService.URL_CORS_ANYWHERE + args1.url.url.replace("#VAR#", args1.searchParam);

    //             // return new args1.isLoadingAction(false);
    //             const args = action.payload;
    //             console.log(args.searchParam);
    //             this.store.dispatch(new args.isLoadingAction(true));
    //             if (!args.searchParam) {
    //                 this.store.dispatch(new args.onRequestResponseAction(null));
    //                 return new args.isLoadingAction(false);
    //             }
    //             console.log("fetching "+ args.url.url);
    //             const url = HighscoreService.URL_CORS_ANYWHERE + args.url.url.replace("#VAR#", args.searchParam);
    //             return this.http
    //                 .get<typeof args.responseType>(url, args.url.tweekResponse ? {responseType: 'text' as  'json'} : {})
    //                     .pipe(
    //                         map(response => {
    //                             if (args.onRequestResponseAction == HighscoreActions.SetClanMembers) {
    //                                 const clanMembers = this.handleClanMemberResponse(response);
    //                                 if (!clanMembers) {
    //                                     this.store.dispatch(new HighscoreActions.SetIsClanless(true));
    //                                 }
    //                                 this.store.dispatch(new args.onRequestResponseAction(clanMembers));
    //                             } else if (args.onRequestResponseAction == HighscoreActions.SetHighscoreLight) {
    //                                 this.store.dispatch(new args.onRequestResponseAction(this.handleHighscoreLightResponse(response, args.searchParam)));
    //                             } else if (args.onRequestResponseAction == HighscoreActions.SetQuestResponse) {
    //                                 this.store.dispatch(new args.onRequestResponseAction(response));
    //                             } else if (args.onRequestResponseAction == HighscoreActions.SetPlayerDetails) {
    //                                 this.store.dispatch(new args.onRequestResponseAction(this.handlePlayerDetailsResponse(response)));
    //                             } else if (args.onRequestResponseAction == HighscoreActions.SetSesonalEvents) {
    //                                 this.store.dispatch(new args.onRequestResponseAction(response));
    //                             } else if (args.onRequestResponseAction == HighscoreActions.SetRuneMetricsProfile) {
    //                                 const runeMetrics = this.handleRuneMetricsResponse(response);
    //                                 if (!runeMetrics) {
    //                                     this.store.dispatch(new HighscoreActions.SetIsRuneMetricsProfilePrivate(true));
    //                                 }
    //                                 this.store.dispatch(new args.onRequestResponseAction(runeMetrics));
    //                             } else {
    //                                 this.store.dispatch(new args.onRequestResponseAction(null));
    //                             }
    //                             return new args.isLoadingAction(false);
    //                         },
    //                         catchError(error => {
    //                             console.log("error1");
    //                             console.log(error);
    //                             return of([]);
    //                         })),
    //                         catchError(error => {
    //                             console.log("error2");
    //                             console.log(error);
    //                             this.store.dispatch(new args.onRequestResponseAction(null));
    //                             return of(new args.isLoadingAction(false));
    //                         })
    //                     )
    //         })
    //     );

    handleSesonalEventsResponse(res: SesonalEventsResponse[]) {
        if (!res) return null
        let sesonalEvents: SesonalEvent[] = []
        res.forEach((seRes) => {
            sesonalEvents.push(
                new SesonalEvent(
                    seRes.score_raw,
                    seRes.endDate,
                    seRes.rank,
                    seRes.title,
                    seRes.startDate
                )
            )
        })
        return sesonalEvents
    }

    handleQuestsResponse(res: QuestResponse) {
        if (!res) return null
        if (!res.quests) return null
        if (res.quests.length == 0) return null
        let quests: Quest[] = []
        res.quests.forEach((quest) => {
            quests.push(
                new Quest(
                    quest.title,
                    quest.status,
                    quest.difficulty,
                    quest.members,
                    quest.questPoints,
                    quest.userEligible
                )
            )
        })
        return quests
    }

    handlePlayerClanNameResponse(playerClanNameResponse: string) {
        if (!playerClanNameResponse) return null
        let response = playerClanNameResponse.split('[')[1].split(']')[0]
        return JSON.parse(response)['clan']
    }

    handleClanMemberResponse(clanMemberReponse: string) {
        if (!clanMemberReponse) return null
        if (!clanMemberReponse.startsWith('Clanmate, Clan Rank, Total XP, Kills')) {
            return null
        } else {
            let clanMembers: ClanMember[] = []
            clanMemberReponse
                .split('\n')
                .filter((el, index) => index > 0)
                .forEach((clanMember, index) => {
                    const prop = clanMember.split(',')
                    clanMembers.push(new ClanMember(prop[0], Role[prop[1]], +prop[2], +prop[3]))
                })
            return clanMembers
        }
    }

    handleRuneMetricsResponse(res: RuneMetricsResponse) {
        if (!res) return null
        if (!res.skillvalues) return null
        let skills: Skill[] = []
        res.skillvalues.forEach((skillValue) => {
            skills.push(
                new Skill(
                    HighscoreService.SKILL_NAMES[skillValue.id],
                    skillValue.level,
                    skillValue.xp,
                    skillValue.rank
                )
            )
        })
        return new RuneMetricsProfile(
            res.name,
            res.totalskill,
            res.totalxp,
            +res.rank.replace(',', ''),
            res.combatlevel,
            res.questsstarted,
            res.questscomplete,
            res.questsnotstarted,
            res.activities,
            skills
        )
    }

    handleHighscoreLightResponse(highscoreLight: string, playerName: string) {
        if (!highscoreLight) return null

        let skills: Skill[] = []
        let totalRank = -1
        let totalXp = -1
        let totalLevel = -1
        let combatLevel = -1
        highscoreLight
            .split('\n')
            .filter((el, index) => index <= 27)
            .forEach((skillStr, index) => {
                let skillProperty = skillStr.split(',')
                if (index == 0) {
                    totalRank = +skillProperty[0]
                    totalLevel = +skillProperty[2]
                    totalXp = +skillProperty[1]
                } else {
                    skills.push(
                        new Skill(
                            HighscoreService.SKILL_NAMES[index - 1],
                            +skillProperty[1],
                            +skillProperty[2],
                            +skillProperty[0]
                        )
                    )
                }
            })
        combatLevel = HighscoreService.getCombatLevel(skills)
        return new HighscoreLightProfile(
            playerName,
            totalXp,
            totalLevel,
            totalRank,
            combatLevel,
            skills
        )
    }
}
