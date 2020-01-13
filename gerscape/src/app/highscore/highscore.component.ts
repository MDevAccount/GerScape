import {Component, OnInit} from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { FetchRuneMetricsProfile, FetchSesonalEvents, FetchHighscoreLight, FetchPlayerDetails, FetchQuests, FetchClanMembers } from './store/highscore.actions';
import { HighscoreService } from './service/highscore.service';

@Component({
  selector: 'app-highscore',
  templateUrl: 'highscore.component.html',
  styleUrls: ['highscore.component.css'],
})
export class HighscoreComponent implements OnInit {
    totalLevel;
    totalXp;
    combatLevel;
    playerName;
    avatarUrl = "./assets/img/default_chat.png";
    isRuneMetricsProfilePrivate = true;

    constructor(
        private store: Store<AppState>) {

    }

    ngOnInit() {
        this.store.dispatch(new FetchRuneMetricsProfile("blaueshemd"));
        this.store.dispatch(new FetchHighscoreLight("blaueshemd"));
        this.store.dispatch(new FetchPlayerDetails("blaueshemd"));
        this.store.dispatch(new FetchQuests("blaueshemd"));
        this.store.dispatch(new FetchSesonalEvents("blaueshemd"));
        this.store.dispatch(new FetchClanMembers("blaueshemd"));

        this.store.select('highscore').subscribe(state => {
            this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
            if (state.runemetricsProfile) {
                this.combatLevel = state.runemetricsProfile.combatlevel;
                this.totalLevel = state.runemetricsProfile.totalskill;
                this.totalXp = state.runemetricsProfile.totalxp;
                this.playerName = state.runemetricsProfile.name;
                this.avatarUrl = HighscoreService.URL_PLAYER_AVATAR_IMAGE.replace("#VAR#", state.runemetricsProfile.name);
            } else if (state.highscoreLight) {
                this.combatLevel = state.highscoreLight.combatLevel;
                this.totalXp = state.highscoreLight.totalXp;
                this.totalLevel = state.highscoreLight.totalLevel;
                this.playerName = state.highscoreLight.name;
                this.avatarUrl = HighscoreService.URL_PLAYER_AVATAR_IMAGE.replace("#VAR#", state.highscoreLight.name);
            }
        });
    }
}