import { OnInit, Component, OnDestroy } from '@angular/core';
import { HighscoreService } from '../service/highscore.service';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Skillvalue } from '../model/runemetrics-profile.model';
import { Skill } from '../model/highscore-light.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-highscore-stats-chart',
    templateUrl: 'highscore-stats-chart.component.html',
    styleUrls: ['highscore-stats-chart.component.css'],
})
export class HighscoreStatsChartComponent implements OnInit, OnDestroy {
    series: number[] = [];
    labels: string[] = [];
    highscoreLight;
    currPlayerName = "";
    isLoadingHighscoreLight = false;
    storeSubscription: Subscription;
    plotOptions = {
        radialBar: {
            dataLabels: {
                total: {
                    show: true,
                    label: 'GESAMT',
                    color: '#43E226',
                    formatter: function(val: any) {
                        let avg = 0;
                        val.config.series.forEach(element => {
                            avg += element;
                        });
                        return Math.round(avg / 4) + '%';
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

    constructor(
        private store: Store<AppState>,
        private highscoreService: HighscoreService) {

    }

    ngOnInit() {
        this.storeSubscription = this.store.select('highscore').subscribe(state => {

            this.highscoreLight = state.highscoreLight;
            this.isLoadingHighscoreLight = state.isLoadingHighscoreLight;

            let level120s;
            let level99s;
            let epMaxSkillsCount;
            let skills;

            if (!state.isLoadingHighscoreLight && state.highscoreLight) {
                let playerName = state.highscoreLight.name;

                if (this.currPlayerName != playerName) {

                    this.currPlayerName = playerName;

                    this.series = [];
                    this.labels = [];

                    this.labels.push("ALLES 99");
                    this.labels.push("COMP STATS");
                    this.labels.push("ALLES 120");
                    this.labels.push("ALLES 200M");

                    level99s = state.highscoreLight.skills.filter(skill => skill.level >= 99).length;
                    level120s = state.highscoreLight.skills.filter(skill => this.highscoreService.getLevelForXp(skill.xp) >= 120).length;
                    epMaxSkillsCount = state.highscoreLight.skills.filter(skill => skill.xp == HighscoreService.MAX_SKILL_XP).length;
                    skills = state.highscoreLight.skills;

                    this.series.push(this.getPercentOfAndMax100(level99s, HighscoreService.SKILL_AMOUNT));
                    this.series.push(this.getCompPercentDone(skills));
                    this.series.push(this.getPercentOfAndMax100(level120s, HighscoreService.SKILL_AMOUNT));
                    this.series.push(this.getPercentOfAndMax100(epMaxSkillsCount, HighscoreService.SKILL_AMOUNT));
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

    getCompPercentDone(skillValues?: Skillvalue[], skills?: Skill[]) {
        let requiredLevel99s;
        let requiredLevel120s;
        let the120Ids = [26, 24, 19, 18, 15];
        if (skills) {
            requiredLevel99s = skills.filter(skill => !the120Ids[skill.id] && skill.level >= 99).length;
            requiredLevel120s = skills.filter(skill => the120Ids[skill.id] && this.highscoreService.isSkill120(skill.xp)).length;
        } else if (skillValues) {
            requiredLevel99s = skillValues.filter(skill => !the120Ids[skill.id] && skill.level >= 99).length;
            requiredLevel120s = skillValues.filter(skill => the120Ids[skill.id] && this.highscoreService.isSkill120(skill.xp)).length;
        }
        return this.getPercentOfAndMax100(requiredLevel99s + requiredLevel120s, HighscoreService.SKILL_AMOUNT);
    }

    
  
   
}