import {Component, OnInit, OnDestroy} from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { FetchEverything } from './store/highscore.actions';
import { HighscoreService } from './service/highscore.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-highscore',
  templateUrl: 'highscore.component.html',
  styleUrls: ['highscore.component.css'],
})
export class HighscoreComponent implements OnInit, OnDestroy {
    totalLevel;
    totalXp;
    combatLevel;
    rank;
    playerName;
    avatarUrl = "./assets/img/default_chat.png";
    isRuneMetricsProfilePrivate = false;
    isFetchingData = false;
    storeSubscription: Subscription;
    routeSubscription: Subscription;
    activeTabIndex = 0;
    navLinks = [
        {
            label: 'Fertigkeiten',
            link: '/stats',
            index: 0
        }, 
        {
            label: 'Letzte Aktivitäten',
            link: '/activities',
            index: 1
        }, 
        {
            label: 'Abenteuer',
            link: '/quests',
            index: 2
        }, 
        {
            label: 'Sesonale Liste',
            link: '/events',
            index: 3
        }, 
        {
            label: 'Clan',
            link: '/clan',
            index: 4
        }, 
    ];

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router) {

    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            if (!this.playerName && !this.router.url.endsWith("highscore") && !this.isFetchingData) {
                let name = this.router.url.split("/")[2];
                this.store.dispatch(new FetchEverything(name));
            } 
            this.activeTabIndex = this.navLinks.indexOf(this.navLinks.find(navLink => navLink.link === '.' + this.router.url));
        });

        this.storeSubscription = this.store.select('highscore').subscribe(state => {
            this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
            this.isFetchingData = state.isFetchingData;
            if (state.runemetricsProfile) {
                this.combatLevel = state.runemetricsProfile.combatlevel;
                this.totalLevel = state.runemetricsProfile.totalskill;
                this.totalXp = state.runemetricsProfile.totalxp;
                this.rank = state.runemetricsProfile.rank;
                this.playerName = state.runemetricsProfile.name;
                this.avatarUrl = HighscoreService.URL_PLAYER_AVATAR_IMAGE.replace("#VAR#", state.runemetricsProfile.name);
            } else if (state.highscoreLight) {
                this.combatLevel = state.highscoreLight.combatLevel;
                this.totalXp = state.highscoreLight.totalXp;
                this.totalLevel = state.highscoreLight.totalLevel;
                this.rank = state.highscoreLight.totalRank;
                this.playerName = state.highscoreLight.name;
                this.avatarUrl = HighscoreService.URL_PLAYER_AVATAR_IMAGE.replace("#VAR#", state.highscoreLight.name);
            }
        });
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }
}