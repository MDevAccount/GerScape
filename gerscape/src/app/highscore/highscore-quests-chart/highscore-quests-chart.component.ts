import { OnInit, Component, OnDestroy } from '@angular/core'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { Subscription, Observable } from 'rxjs'
import { HighscoreService } from '../service/highscore.service'
import * as HighscoreActions from '../store/highscore.actions'
import { Quest, Status } from '../model/quest.model'

@Component({
    selector: 'app-highscore-quests-chart',
    templateUrl: 'highscore-quests-chart.component.html',
    styleUrls: ['highscore-quests-chart.component.css'],
})
export class HighscoreQuestsChartComponent implements OnInit, OnDestroy {
    series: number[] = []
    labels: string[] = []
    plotOptions = {
        radialBar: {
            dataLabels: {
                total: {
                    show: true,
                    label: 'ERLEDIGT',
                    color: '#43E226',
                    formatter: function(val) {
                        return Math.round(val.config.series[0]) + '%'
                    },
                },
                value: {
                    show: true,
                    fontSize: '30px',
                },
            },
            track: {
                show: true,
                background: '#313131',
            },
        },
    }

    storeSubscription: Subscription
    questsCallState$: Observable<string>
    quests: Quest[] = []

    constructor(private store: Store<AppState>, private highscoreService: HighscoreService) {}

    ngOnInit() {
        this.questsCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_QUEST_ACHIEVEMENTS
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.quests)
            .subscribe((quests) => {
                if (quests) {
                    this.updateChart(quests)
                    this.quests = quests
                }
            })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
    }

    updateChart(quests: Quest[]) {
        const questsDone = quests.filter((quest) => quest.status == Status.Completed).length
        const questsStarted = quests.filter((quest) => quest.status == Status.Started).length
        const questsNotStarted = quests.filter((quest) => quest.status == Status.NotStarted).length

        this.labels.push('ERLEDIGT')
        this.labels.push('GESTARTET')
        this.labels.push('NICHT GESTARTET')
        this.series.push(this.getPercentOfAndMax100(questsDone, quests.length))
        this.series.push(this.getPercentOfAndMax100(questsStarted, quests.length))
        this.series.push(this.getPercentOfAndMax100(questsNotStarted, quests.length))
    }

    getPercentOfAndMax100(base: number, from: number) {
        let percent = (base / from) * 100
        return percent > 100 ? 100 : Math.round(percent)
    }
}
