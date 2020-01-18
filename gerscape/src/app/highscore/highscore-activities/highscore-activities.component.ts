import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'
import { MatSort, MatTableDataSource } from '@angular/material'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { Subscription, Observable } from 'rxjs'
import { Activity } from '../model/activity.model'
import { HighscoreService } from '../service/highscore.service'
import * as HighscoreActions from '../store/highscore.actions'

@Component({
    selector: 'app-highscore-activities',
    templateUrl: 'highscore-activities.component.html',
    styleUrls: ['highscore-activities.component.css'],
})
export class HighscoreActivitiesComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, { static: true }) sort: MatSort

    displayedColumns: string[] = ['date', 'text', 'details']
    dataSource = new MatTableDataSource<Activity>([])

    storeSubscription: Subscription

    activitiesCallState$: Observable<string>
    activitiesCount = 0

    constructor(private store: Store<AppState>, private highscoreService: HighscoreService) {}

    ngOnInit() {
        this.dataSource.sort = this.sort

        this.activitiesCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_RUNE_METRICS_PROFILE
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.runeMetricsProfile)
            .subscribe((runeMetricsProfile) => {
                if (runeMetricsProfile && runeMetricsProfile.activities) {
                    this.dataSource.data = runeMetricsProfile.activities
                    this.activitiesCount = runeMetricsProfile.activities.length
                }
            })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
    }
}
