import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { SesonalEvent } from '../model/sesonal-event.model'
import { Subscription, Observable } from 'rxjs'
import * as HighscoreActions from '../store/highscore.actions'
import { HighscoreService } from '../service/highscore.service'

@Component({
    selector: 'app-highscore-sesonal',
    templateUrl: 'highscore-sesonal.component.html',
    styleUrls: ['highscore-sesonal.component.css'],
})
export class HighscoreSesonalEventsComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, { static: true }) sort: MatSort
    displayedColumns: string[] = ['startDate', 'endDate', 'title', 'score_raw', 'rank']

    dataSource = new MatTableDataSource<SesonalEvent>([])
    storeSubscription: Subscription

    sesonalEventsCallState$: Observable<string>
    sesonalEventsCount = 0

    constructor(private store: Store<AppState>, private highscoreService: HighscoreService) {}

    ngOnInit() {
        this.dataSource.sort = this.sort

        this.sesonalEventsCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_SESONAL_EVENTS
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.sesonalEvents)
            .subscribe((sesonalEvents) => {
                if (sesonalEvents) {
                    this.dataSource.data = sesonalEvents
                    this.sesonalEventsCount = sesonalEvents.length
                }
            })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
    }
}
