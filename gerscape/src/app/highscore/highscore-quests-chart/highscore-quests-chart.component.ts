import { OnInit, Component } from '@angular/core';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Status } from '../model/quest.model';

@Component({
    selector: 'app-highscore-quests-chart',
    templateUrl: 'highscore-quests-chart.component.html',
    styleUrls: ['highscore-quests-chart.component.css'],
})
export class HighscoreQuestsChartComponent implements OnInit {
    series: number[] = [];
    labels: string[] = [];
    hasBeenLoaded = false;
    currPlayerName = "";
    isRuneMetricsProfilePrivate = false;

    plotOptions = {
        radialBar: {
            dataLabels: {
                total: {
                    show: true,
                    label: 'ERLEDIGT',
                    color: '#43E226',
                    formatter: function(val) {
                        return Math.round(val.config.series[0]) + '%';
                    }
                },
                value: {
                    show: true,
                    fontSize: '30px'
                },
            },
            track: {
                show: true,
                background: '#313131'
            }
        }
    }
    constructor(private store: Store<AppState>) {

    }

    ngOnInit() {
        this.store.select('highscore').subscribe(state => {

            this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;

            let questsDone;
            let questsStarted;
            let questsNotStarted;

            if (state.questResponse) {
                if (state.highscoreLight || state.runemetricsProfile) {
                    let playerName = state.highscoreLight ? state.highscoreLight.name : state.runemetricsProfile.name;
                    if (this.currPlayerName != playerName) {
                        this.hasBeenLoaded = false;
                        this.series = [];
                        this.labels = [];
                        this.labels.push("ERLEDIGT");
                        this.labels.push("BEGONNEN");
                        this.labels.push("NICHT BEGONNEN");
    
                        questsDone = state.questResponse.quests.filter(quest => quest.status == Status.Completed).length;
                        questsStarted = state.questResponse.quests.filter(quest => quest.status == Status.Started).length;
                        questsNotStarted = state.questResponse.quests.filter(quest => quest.status == Status.NotStarted).length;

                        this.series.push(this.getPercentOfAndMax100(questsDone, state.questResponse.quests.length));
                        this.series.push(this.getPercentOfAndMax100(questsStarted, state.questResponse.quests.length));
                        this.series.push(this.getPercentOfAndMax100(questsNotStarted, state.questResponse.quests.length));
                        this.hasBeenLoaded = true;
                    }
                }
            }
        });

    }

    getPercentOfAndMax100(base: number, from: number) {
        let percent = (base / from) * 100;
        return (percent > 100) ? 100 : Math.round(percent);
    }

    getFormater(event: any) {
        return "";
    }
  
   
}