import { OnInit, Component, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Status } from '../model/quest.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-highscore-quests-chart',
    templateUrl: 'highscore-quests-chart.component.html',
    styleUrls: ['highscore-quests-chart.component.css'],
})
export class HighscoreQuestsChartComponent implements OnInit, OnDestroy {
    series: number[] = [];
    labels: string[] = [];
    currPlayerName = "";
    isRuneMetricsProfilePrivate = false;
    questResponse;
    stats;
    isLoadingQuests = false;
    storeSubscription: Subscription; 
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
        this.storeSubscription = this.store.select('highscore').subscribe(state => {

            this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
            this.isLoadingQuests = state.isLoadingQuestResponse;
            
            if (state.highscoreLight) {
                this.stats = state.highscoreLight;
            } else if (state.runemetricsProfile) {
                this.stats = state.runemetricsProfile;
            }

            let questsDone;
            let questsStarted;
            let questsNotStarted;

            if (state.questResponse) {
                this.questResponse = this.questResponse;
                if (state.highscoreLight || state.runemetricsProfile && state.isLoadingQuestResponse == false) {
                    let playerName = state.highscoreLight ? state.highscoreLight.name : state.runemetricsProfile.name;
                    if (this.currPlayerName != playerName) {
                        this.currPlayerName = playerName;
                        this.series = [];
                        this.labels = [];
                        this.labels.push("ERLEDIGT");
                        this.labels.push("GESTARTET");
                        this.labels.push("NICHT GESTARTET");
    
                        questsDone = state.questResponse.quests.filter(quest => quest.status == Status.Completed).length;
                        questsStarted = state.questResponse.quests.filter(quest => quest.status == Status.Started).length;
                        questsNotStarted = state.questResponse.quests.filter(quest => quest.status == Status.NotStarted).length;

                        this.series.push(this.getPercentOfAndMax100(questsDone, state.questResponse.quests.length));
                        this.series.push(this.getPercentOfAndMax100(questsStarted, state.questResponse.quests.length));
                        this.series.push(this.getPercentOfAndMax100(questsNotStarted, state.questResponse.quests.length));
                    }
                }
            }

        });

    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
    }

    getPercentOfAndMax100(base: number, from: number) {
        let percent = (base / from) * 100;
        return (percent > 100) ? 100 : Math.round(percent);
    }
  
   
}