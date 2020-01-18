import { Component, OnInit, OnDestroy } from '@angular/core'
import { AppState } from '../store/app.reducer'
import { Store } from '@ngrx/store'
import { HighscoreService } from './service/highscore.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription, of, Observable } from 'rxjs'

import { trigger, state, transition, animate, style } from '@angular/animations'
import { HighscoreLightProfile } from './model/highscore-light-profile.model'
import * as HighscoreActions from './store/highscore.actions'

@Component({
    selector: 'app-highscore',
    templateUrl: 'highscore.component.html',
    styleUrls: ['highscore.component.css'],
    animations: [
        //<-----
        trigger('flyIn', [
            state(
                'normal',
                style({
                    transform: 'translateY(0) scale(1)',
                })
            ),
            state(
                'tabPos',
                style({
                    transform: 'translateY(500px) scale(0.0)',
                })
            ),
            //the 2 lines above can be rewritten.. the arrow shows the direction of the animation.. so..
            transition('normal => flying', animate(400)), // from which to which state do we transition and how long should it take
            //transition('flying => normal', animate(400)), // from which to which state do we transition and how long should it take
            //if we want to animate shrunken to anything and from anything we can use the wildcard operator *
        ]),
    ],
})
export class HighscoreComponent implements OnInit, OnDestroy {
    state = 'normal' //<-- can be a number or anything else

    storeSubscription: Subscription
    routeSubscription: Subscription
    clanNameSubscription: Subscription

    tabs = ['stats', 'activities', 'quests', 'events', 'clan']
    tabDescs = ['Fertigkeiten', 'Aktivitäten', 'Abenteuer', 'Sesonale Events', 'Clan']
    selectedTabIndex = 0

    avatarUrl = HighscoreService.DEFAULT_AVATAR_IMAGE

    clanName$: Observable<string>
    clanNameCallState$: Observable<string>
    highscoreLightCallState$: Observable<string>
    highscoreLight: HighscoreLightProfile = null

    highscoreFragment = ''
    componentFragment = ''
    playerNameFragment = ''

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router,
        private highscoreService: HighscoreService
    ) {}

    ngOnInit() {
        this.highscoreLightCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_LIGHT_HIGHSCORE
        )

        this.clanNameCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_CLAN_NAME
        )

        this.clanName$ = this.highscoreService.getClanName$()

        this.clanNameSubscription = this.clanName$.subscribe((clanName) => {
            if (clanName && clanName.length > 0)
                this.store.dispatch(new HighscoreActions.FetchClanMembersOfClan(clanName))
        })

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.highscoreLightProfile)
            .subscribe((highscoreLight) => {
                if (highscoreLight) {
                    this.highscoreLight = highscoreLight
                }
            })

        this.routeSubscription = this.route.params.subscribe((params) => {
            let fragments = this.router.url.split('/')
            console.log(fragments, fragments.length)
            this.highscoreFragment = fragments.length >= 2 ? fragments[1] : ''
            this.componentFragment = fragments.length >= 3 ? fragments[2] : ''
            this.playerNameFragment = fragments.length >= 4 ? fragments[3] : ''

            if (
                this.highscoreFragment == 'highscore' &&
                this.tabs.filter((tab) => tab == this.componentFragment).length > 0 &&
                this.playerNameFragment &&
                this.playerNameFragment != ''
            ) {
                this.store.dispatch(
                    new HighscoreActions.FetchPlayersClanName(this.playerNameFragment)
                )
                this.store.dispatch(
                    new HighscoreActions.FetchPlayersRuneMetricsProfile(this.playerNameFragment)
                )
                this.store.dispatch(
                    new HighscoreActions.FetchPlayersLightHighscore(this.playerNameFragment)
                )
                this.store.dispatch(
                    new HighscoreActions.FetchPlayersQuestAchievements(this.playerNameFragment)
                )
                this.store.dispatch(
                    new HighscoreActions.FetchPlayersSesonalEvents(this.playerNameFragment)
                )
            }
        })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
        if (this.routeSubscription) this.routeSubscription.unsubscribe()
    }

    onChangeTab(newTabIndex: number) {
        this.state == 'normal' ? (this.state = 'flying') : (this.state = 'normal')
        this.selectedTabIndex = newTabIndex

        //this.location.go("highscore/" + this.tabs[newTabIndex] + '/' + this.playerName);
        //this.router.navigate([this.tabs[newTabIndex]], {relativeTo: this.route});
    }

    // setUrlManuallyTo(event) {
    //     let splittedUrl = this.router.url.split("/");
    //     if (splittedUrl.length == 3 && splittedUrl[0] == "highscore") {
    //         let url = this.router.url.substring(0, this.router.url.length - splittedUrl[splittedUrl.length - 1].length)
    //         this.location.go("highscore" + this.navLinks[event.index].link);
    //     }

    // }
}
