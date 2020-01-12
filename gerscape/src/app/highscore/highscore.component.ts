import {Component, OnInit} from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { FetchRuneMetricsProfile, FetchSesonalEvents, FetchHighscoreLight, FetchPlayerDetails, FetchQuests, FetchClanMembers } from './store/highscore.actions';
import { RuneMetricsProfile } from './model/runemetrics-profile.model';

@Component({
  selector: 'app-highscore',
  templateUrl: 'highscore.component.html',
  styleUrls: ['highscore.component.css'],
})
export class HighscoreComponent implements OnInit {
    totalLevel;
    totalXp;
    combatLevel;

    constructor(
        private store: Store<AppState>) {

    }

    ngOnInit() {
        this.store.dispatch(new FetchRuneMetricsProfile("Mischa"));
        this.store.dispatch(new FetchHighscoreLight("Mischa"));
        this.store.dispatch(new FetchPlayerDetails("Mischa"));
        this.store.dispatch(new FetchQuests("Mischa"));
        this.store.dispatch(new FetchSesonalEvents("Mischa"));
        this.store.dispatch(new FetchClanMembers("Suchtlurche"));

        this.store.select('highscore').subscribe(state => {
            if (state.runemetricsProfile) {
                this.combatLevel = state.runemetricsProfile.combatlevel;
                this.totalLevel = state.runemetricsProfile.totalskill;
                this.totalXp = state.runemetricsProfile.totalxp;
            }
        });
    }
}