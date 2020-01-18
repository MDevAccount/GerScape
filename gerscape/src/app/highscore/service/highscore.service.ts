import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { Skill } from '../model/skill.model'
import { LoadingState } from 'src/app/shared/model/call-state.model'
import * as HighscoreActions from '../store/highscore.actions'
import { Role } from '../model/clan-member.model'

@Injectable()
export class HighscoreService {
    static URL_PLAYER_HIGHSCORE_LIGHT =
        'https://secure.runescape.com/m=hiscore/index_lite.ws?player=#VAR#'
    static URL_RUNEMETRICS_PROFILE =
        'https://apps.runescape.com/runemetrics/profile/profile?user=#VAR#&activities=20'
    static URL_PLAYER_QUESTS = 'https://apps.runescape.com/runemetrics/quests?user=#VAR#'
    static URL_PLAYER_CLAN_NAME =
        'http://services.runescape.com/m=website-data/playerDetails.ws?names=%5B%22#VAR#%22%5D&callback=jQuery000000000000000_0000000000&_=0'

    static URL_CLANMEMBERS =
        'http://services.runescape.com/m=clan-hiscores/members_lite.ws?clanName=#VAR#'
    static URL_SESONAL_EVENTS =
        'http://services.runescape.com/m=temp-hiscores/getRankings.json?player=#VAR#&status=archived'
    static URL_PLAYER_AVATAR_IMAGE = 'http://secure.runescape.com/m=avatar-rs/#VAR#/chat.png'

    static DEFAULT_AVATAR_IMAGE = './assets/img/default_chat.png'

    static MAX_TOTAL_XP = 5400000000
    static MAX_SKILL_XP = 200000000
    static MAX_LEVEL = 2673
    static COMP_LEVEL = 2778
    static ALL_120_TOTAL_LEVEL = 3240
    static XP_AT_120 = 104273167
    static SKILL_AMOUNT = 27

    static SKILL_NAMES = [
        'Angriff',
        'Verteidigung',
        'Stärke',
        'Lebenspunkte',
        'Fernkampf',
        'Gebet',
        'Magie',
        'Kochen',
        'Holzfällerei',
        'Bognerei',
        'Fischen',
        'Funkenschlagen',
        'Handwerk',
        'Schmieden',
        'Bergbau',
        'Pflanzenkunde',
        'Gewandheit',
        'Diebstahl',
        'Berserker',
        'Landwirtschaft',
        'Runenfertigung',
        'Jagen',
        'Baukunst',
        'Beschwörung',
        'Kerkerkunde',
        'Mystik',
        'Erfinden',
    ]

    static SKILL_ICONS = [
        'attack',
        'defence',
        'strength',
        'constitution',
        'ranged',
        'prayer',
        'magic',
        'cooking',
        'woodcutting',
        'fletching',
        'fishing',
        'firemaking',
        'crafting',
        'smithing',
        'mining',
        'herblore',
        'agility',
        'thieving',
        'slayer',
        'farming',
        'runecrafting',
        'hunter',
        'construction',
        'summoning',
        'dungeoneering',
        'divination',
        'invention',
    ]

    static ROLE_ICONS = [
        {
            image: 'questionmark.png',
            gerRole: 'Unbekannt',
            engRole: Role.Unknown,
        },
        {
            image: 'Admin-clan-rank.png',
            gerRole: 'Admin',
            engRole: Role.Admin,
        },
        {
            image: 'Owner-clan-rank.png',
            gerRole: 'Owner',
            engRole: Role.Owner,
        },
        {
            image: 'Captain-clan-rank.png',
            gerRole: 'Kaptian',
            engRole: Role.Captain,
        },
        {
            image: 'Coordinator-clan-rank.png',
            gerRole: 'Koordinator',
            engRole: Role.Coordinator,
        },
        {
            image: 'Corporal-clan-rank.png',
            gerRole: 'Korporal',
            engRole: Role.Corporal,
        },
        {
            image: 'Deputy-owner-clan-rank.png',
            gerRole: 'Admin-Stellvertreter',
            engRole: Role.DeputyOwner,
        },
        {
            image: 'General-clan-rank.png',
            gerRole: 'General',
            engRole: Role.General,
        },
        {
            image: 'Lieutenant-clan-rank.png',
            gerRole: 'Leutnant',
            engRole: Role.Lieutenant,
        },
        {
            image: 'Organiser-clan-rank.png',
            gerRole: 'Organisator',
            engRole: Role.Organiser,
        },
        {
            image: 'Overseer-clan-rank.png',
            gerRole: 'Aufseher',
            engRole: Role.Overseer,
        },
        {
            image: 'Sergeant-clan-rank.png',
            gerRole: 'Sergeant',
            engRole: Role.Sergeant,
        },
        {
            image: 'Recruit-clan-rank.png',
            gerRole: 'Rekrut',
            engRole: Role.Recruit,
        },
    ]

    skillXps: number[] = []
    currentPlayerName = ''
    highscoreState$

    constructor(private http: HttpClient, private store: Store<AppState>) {
        this.createSkillXpArray()
        this.highscoreState$ = this.store.select('highscore').pipe()
    }

    dispatchCallStateOfActionX(
        loadingState: LoadingState,
        actionType: string,
        errorMsg: string = ''
    ) {
        this.store.dispatch(
            new HighscoreActions.SetCallStateOfActionX({
                loadingState: loadingState,
                actionType: actionType,
                errorMsg: errorMsg,
            })
        )
    }

    getCallStateOfActionX$(actionType: string) {
        return this.store.select(
            (state: AppState) =>
                state.highscore.callStates.filter(
                    (callState) => callState.actionType == actionType
                )[0].state
        )
    }

    getClanName$() {
        return this.store.select((state: AppState) => state.highscore.clanName)
    }

    // getClanMembers() {
    //     return this.highscoreState.playerProfile.clanMembers
    // }

    // getClanName() {
    //     return this.highscoreState.playerProfile.clanName
    // }

    // fetchPlayerDetails(playerName: string) {
    //   console.log("ido9shfi0o9sdhnfhsdif");
    //   this.store.dispatch(
    //     new FetchAny({
    //       searchParam: playerName,
    //       onRequestResponseAction: SetPlayerDetails,
    //       isLoadingAction: SetIsLoadingPlayerDetails,
    //       url: HighscoreService.URL_PLAYER_DETAILS,
    //       responseType: String
    //     })
    //   );
    // }

    // fetchHighscoreLight(playerName: string) {
    //   this.store.dispatch(
    //     new FetchAny({
    //       searchParam: playerName,
    //       onRequestResponseAction: SetHighscoreLight,
    //       isLoadingAction: SetIsLoadingHighscoreLight,
    //       url: HighscoreService.URL_PLAYER_HIGHSCORE_LIGHT,
    //       responseType: String
    //     })
    //   );
    // }

    // fetchRuneMetricsProfile(playerName: string) {
    //   this.store.dispatch(
    //     new FetchAny({
    //       searchParam: playerName,
    //       onRequestResponseAction: SetRuneMetricsProfile,
    //       isLoadingAction: SetIsLoadingRuneMetricsProfile,
    //       url: HighscoreService.URL_RUNEMETRICS_PROFILE,
    //       responseType: RuneMetricsProfile
    //     })
    //   );
    // }

    // fetchQuestResponse(playerName: string) {
    //   this.store.dispatch(
    //     new FetchAny({
    //       searchParam: playerName,
    //       onRequestResponseAction: SetQuestResponse,
    //       isLoadingAction: SetIsLoadingQuestResponse,
    //       url: HighscoreService.URL_PLAYER_QUESTS,
    //       responseType: QuestResponse
    //     })
    //   );
    // }

    // fetchSesonalEvents(playerName: string) {
    //   this.store.dispatch(
    //     new FetchAny({
    //       searchParam: playerName,
    //       onRequestResponseAction: SetSesonalEvents,
    //       isLoadingAction: SetIsLoadingSesonalEvents,
    //       url: HighscoreService.URL_SESONAL_EVENTS,
    //       responseType: { SesonalEvent } //TODO CHECK
    //     })
    //   );
    // }

    // fetchEverything(playerName: string) {}

    private createSkillXpArray() {
        for (let level = 0; level <= 127; level++) {
            this.skillXps[level] =
                (1 / 8) * level * (level - 1) +
                75 * ((Math.pow(2, (level - 1) / 7) - 1) / (1 - Math.pow(2, -1 / 7)))
        }
    }

    getLevelForXp(xp: number) {
        if (xp && xp > 0) {
            for (let level = 0; level < this.skillXps.length; level++) {
                if (this.skillXps[level] > xp) {
                    return level - 1
                }
            }
        }
        return -1
    }

    isSkill120(xp: number) {
        return xp > HighscoreService.XP_AT_120
    }

    getPercentOfNextLevel(xp: number) {
        let currLevelXp = this.skillXps[this.getLevelForXp(xp)]
        let nextLevelXp = this.skillXps[this.getNextLevel(xp)]
        let difXpFromLevelToLevel = nextLevelXp - currLevelXp
        let xpProgress = xp - currLevelXp
        return xp === HighscoreService.MAX_SKILL_XP
            ? 100
            : Math.round((xpProgress / difXpFromLevelToLevel) * 100)
    }

    getXpTillNextLevel(xp: number) {
        if (this.getNextLevel(xp) == 126) return HighscoreService.MAX_SKILL_XP - xp
        return this.skillXps[this.getNextLevel(xp)] - xp
    }

    getNextLevel(xp: number) {
        return this.getLevelForXp(xp) + 1
    }

    static getCombatLevel(skills: Skill[]) {
        const attack = skills[0].level
        const strength = skills[2].level
        const mage = skills[6].level
        const range = skills[4].level
        const defence = skills[1].level
        const constitution = skills[3].level
        const prayer = skills[5].level
        const summoning = skills[23].level
        let arr = [attack + strength, 2 * mage, 2 * range]
        return Math.floor(
            ((13 / 10) * Math.max(...arr) +
                defence +
                constitution +
                (1 / 2) * prayer +
                (1 / 2) * summoning) /
                4
        )
    }
}
