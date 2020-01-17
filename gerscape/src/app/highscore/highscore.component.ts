import { Component, OnInit, OnDestroy, HostBinding, ViewChild, ElementRef } from '@angular/core'
import { Location } from '@angular/common'
import { AppState } from '../store/app.reducer'
import { Store } from '@ngrx/store'
import { HighscoreService } from './service/highscore.service'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Subscription, of, Observable } from 'rxjs'

import { switchMap } from 'rxjs/operators'
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

    tabs = ['stats', 'activities', 'quests', 'events', 'clan']
    tabDescs = ['Fertigkeiten', 'Aktivitäten', 'Abenteuer', 'Sesonale Events', 'Clan']
    selectedTabIndex = 0

    avatarUrl = HighscoreService.DEFAULT_AVATAR_IMAGE

    highscoreLightCallState$: Observable<string>
    highscoreLight: HighscoreLightProfile = null

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private highscoreService: HighscoreService
    ) {}

    ngOnInit() {
        this.highscoreLightCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_LIGHT_HIGHSCORE
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.highscoreLightProfile)
            .subscribe((highscoreLight) => {
                if (highscoreLight) {
                    this.highscoreLight = highscoreLight
                }
            })

        console.log(this.route.snapshot.params.typeId)
        this.routeSubscription = this.route.params.subscribe((params) => {
            const routeFragments = this.router.url.split('/')
            console.log('playername: ', params)
            console.log('fragments: ', routeFragments)

            this.store.dispatch(new HighscoreActions.FetchPlayersClanName('mischa'))

            this.store.dispatch(new HighscoreActions.FetchClanMembersOfClan('suchtlurche'))

            this.store.dispatch(new HighscoreActions.FetchPlayersRuneMetricsProfile('mischa'))

            this.store.dispatch(new HighscoreActions.FetchPlayersLightHighscore('mischa'))

            this.store.dispatch(new HighscoreActions.FetchPlayersQuestAchievements('mischa'))

            this.store.dispatch(new HighscoreActions.FetchPlayersSesonalEvents('mischa'))

            // if (routeFragments.length > 1) {
            //     this.selectedTabIndex = this.tabs.indexOf(routeFragments[2]);
            // }
            // console.log(routeFragments);
            // console.log("hj8dsfhz879sdhf")
            // console.log(params);
            // if (params && params.playername && params.playername.length > 0) {
            //     console.log("hj8dsfhz879sdhf")
            //     console.log(params);
            //     if (this.highscoreService.currentPlayerName != params.playername) {
            //         console.log("fzuzuif");
            //         this.playerName = params.playername;
            //         this.highscoreService.fetchEverything(params.playerName);
            //     }
            // }
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
