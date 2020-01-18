import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { Quest, Status } from '../model/quest.model'
import { Subscription, Observable } from 'rxjs'
import * as HighscoreActions from '../store/highscore.actions'
import { HighscoreService } from '../service/highscore.service'

@Component({
    selector: 'app-highscore-quests',
    templateUrl: 'highscore-quests.component.html',
    styleUrls: ['highscore-quests.component.css'],
})
export class HighscoreQuestsComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, { static: true }) sort: MatSort
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator

    displayedColumns: string[] = ['name', 'status', 'difficulty', 'members', 'questPoints']
    dataSource = new MatTableDataSource<Quest>([])

    storeSubscription: Subscription

    questsCallState$: Observable<string>
    questsCount = 0

    constructor(private store: Store<AppState>, private highscoreService: HighscoreService) {}

    ngOnInit() {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator

        this.questsCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_QUEST_ACHIEVEMENTS
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.quests)
            .subscribe((questAchievements) => {
                if (questAchievements) {
                    this.dataSource.data = questAchievements
                    this.questsCount = questAchievements.length
                }
            })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
    }

    getStatus(quest: Quest) {
        switch (quest.status) {
            case Status.Completed:
                return 'Abgeschlossen'
            case Status.NotStarted:
                return 'Nicht angefangen'
            case Status.Started:
                return 'Angefangen'
            default:
                return ''
        }
    }
}
