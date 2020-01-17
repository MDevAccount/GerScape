import { Component, OnInit } from '@angular/core'
import { AppState } from './store/app.reducer'
import { Store } from '@ngrx/store'
import {
    FetchClanMembersOfClan,
    FetchPlayersLightHighscore,
    FetchPlayersClanName,
    FetchPlayersRuneMetricsProfile,
    FetchPlayersQuestAchievements,
    FetchPlayersSesonalEvents,
} from './highscore/store/highscore.actions'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    constructor(private store: Store<AppState>) {}

    ngOnInit() {}
}
