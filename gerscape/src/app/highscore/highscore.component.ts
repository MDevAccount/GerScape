import {Component, OnInit, OnDestroy} from '@angular/core';
import { Location } from '@angular/common';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { FetchHighscoreLight, FetchPlayerDetails, FetchQuests, FetchRuneMetricsProfile, FetchSesonalEvents } from './store/highscore.actions';
import { HighscoreService } from './service/highscore.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-highscore',
  templateUrl: 'highscore.component.html',
  styleUrls: ['highscore.component.css'],
})
export class HighscoreComponent implements OnInit, OnDestroy {
    selectedTabIndex = 0;
    totalLevel;
    totalXp;
    combatLevel;
    rank;
    playerName;
    avatarUrl = "./assets/img/default_chat.png";
    isRuneMetricsProfilePrivate = false;
    storeSubscription: Subscription;
    routeSubscription: Subscription;
    activeTabIndex = 0;
    navLinks = [
        {
            link: 'stats',
            index: 0
        }, 
        {
            link: 'activities',
            index: 1
        }, 
        {
            link: 'quests',
            index: 2
        }, 
        {
            link: 'events',
            index: 3
        }, 
        {
            link: 'clan',
            index: 4
        }, 
    ];

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location) {

    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            //TODO add last request sent to reducer so we can check here..
            if (!this.playerName && !this.router.url.endsWith("highscore")) {
                this.setTabAccordingToUrl(this.router.url);
                let name = this.router.url.split("/")[2];
                this.store.dispatch(new FetchHighscoreLight(name));
                this.store.dispatch(new FetchPlayerDetails(name));
                this.store.dispatch(new FetchQuests(name));
                this.store.dispatch(new FetchRuneMetricsProfile(name));
                this.store.dispatch(new FetchSesonalEvents(name));
            } 
        });

        this.storeSubscription = this.store.select('highscore').subscribe(state => {
            this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
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

    setTabAccordingToUrl(url: string) {
        let splittedUrl = this.router.url.split("/");
        if (splittedUrl[3]) {
            let link = this.router.url.split("/")[3];
            this.navLinks.filter(navLink => navLink.link == link).map(link => {
                this.selectedTabIndex = link.index;
            })
        }
    }

    setUrlManuallyTo(event) {
        let splittedUrl = this.router.url.split("/");
        let url = this.router.url.substring(0, this.router.url.length - splittedUrl[splittedUrl.length - 1].length)
        this.location.go(url + this.navLinks[event.index].link);
    }
}