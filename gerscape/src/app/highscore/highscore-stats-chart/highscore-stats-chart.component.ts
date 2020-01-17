import { OnInit, Component, OnDestroy } from '@angular/core'
import { HighscoreService } from '../service/highscore.service'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { Subscription, Observable } from 'rxjs'
import { Skill } from '../model/skill.model'
import { HighscoreLightProfile } from '../model/highscore-light-profile.model'
import * as HighscoreActions from '../store/highscore.actions'

@Component({
    selector: 'app-highscore-stats-chart',
    templateUrl: 'highscore-stats-chart.component.html',
    styleUrls: ['highscore-stats-chart.component.css'],
})
export class HighscoreStatsChartComponent implements OnInit, OnDestroy {
    series: number[] = []
    labels: string[] = []
    plotOptions = {
        radialBar: {
            dataLabels: {
                total: {
                    show: true,
                    label: 'GESAMT',
                    color: '#43E226',
                    formatter: function(val: any) {
                        let avg = 0
                        val.config.series.forEach((element) => {
                            avg += element
                        })
                        return Math.round(avg / 4) + '%'
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
    highscoreLightCallState$: Observable<string>
    highscoreLight: HighscoreLightProfile = null

    constructor(private store: Store<AppState>, private highscoreService: HighscoreService) {}

    ngOnInit() {
        this.highscoreLightCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_LIGHT_HIGHSCORE
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.highscoreLightProfile)
            .subscribe((highscoreLight) => {
                if (highscoreLight) {
                    this.updateChart(highscoreLight)
                    this.highscoreLight = highscoreLight
                }
            })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
    }

    updateChart(highscoreLight: HighscoreLightProfile) {
        let level99s = highscoreLight.skills.filter((skill) => skill.level >= 99).length
        let level120s = highscoreLight.skills.filter(
            (skill) => this.highscoreService.getLevelForXp(skill.xp) >= 120
        ).length
        let epMaxSkillsCount = highscoreLight.skills.filter(
            (skill) => skill.xp == HighscoreService.MAX_SKILL_XP
        ).length
        let skills = highscoreLight.skills

        this.labels.push('ALLES 99')
        this.labels.push('COMP STATS')
        this.labels.push('ALLES 120')
        this.labels.push('ALLES 200M')
        this.series.push(this.getPercentOfAndMax100(level99s, HighscoreService.SKILL_AMOUNT))
        this.series.push(this.getCompPercentDone(skills))
        this.series.push(this.getPercentOfAndMax100(level120s, HighscoreService.SKILL_AMOUNT))
        this.series.push(
            this.getPercentOfAndMax100(epMaxSkillsCount, HighscoreService.SKILL_AMOUNT)
        )
    }

    getPercentOfAndMax100(base: number, from: number) {
        let percent = (base / from) * 100
        return percent > 100 ? 100 : Math.round(percent)
    }

    // ngOnInit() {
    // this.storeSubscription = this.store.select("highscore").subscribe(state => {
    //   this.highscoreLight = highscoreLight;
    //   this.isLoadingHighscoreLight = state.isLoadingHighscoreLight;
    //   let level120s;
    //   let level99s;
    //   let epMaxSkillsCount;
    //   let skills;
    //   if (!state.isLoadingHighscoreLight && highscoreLight) {
    //     let playerName = highscoreLight.name;
    //     if (this.currPlayerName != playerName) {
    //       this.currPlayerName = playerName;
    //       this.series = [];
    //       this.labels = [];
    //       this.labels.push("ALLES 99");
    //       this.labels.push("COMP STATS");
    //       this.labels.push("ALLES 120");
    //       this.labels.push("ALLES 200M");
    //       level99s = highscoreLight.skills.filter(
    //         skill => skill.level >= 99
    //       ).length;
    //       level120s = highscoreLight.skills.filter(
    //         skill => this.highscoreService.getLevelForXp(skill.xp) >= 120
    //       ).length;
    //       epMaxSkillsCount = highscoreLight.skills.filter(
    //         skill => skill.xp == HighscoreService.MAX_SKILL_XP
    //       ).length;
    //       skills = highscoreLight.skills;
    //       this.series.push(
    //         this.getPercentOfAndMax100(level99s, HighscoreService.SKILL_AMOUNT)
    //       );
    //       this.series.push(this.getCompPercentDone(skills));
    //       this.series.push(
    //         this.getPercentOfAndMax100(level120s, HighscoreService.SKILL_AMOUNT)
    //       );
    //       this.series.push(
    //         this.getPercentOfAndMax100(
    //           epMaxSkillsCount,
    //           HighscoreService.SKILL_AMOUNT
    //         )
    //       );
    //     }
    //   }
    // });
    // }

    // ngOnDestroy() {
    //     // this.storeSubscription.unsubscribe()
    // }

    getCompPercentDone(skills: Skill[]) {
        let the120Ids = [26, 24, 19, 18, 15]
        let requiredLevel99s = skills.filter(
            (skill, index) => !the120Ids[index] && skill.level >= 99
        ).length
        let requiredLevel120s = skills.filter(
            (skill, index) => the120Ids[index] && this.highscoreService.isSkill120(skill.xp)
        ).length

        return this.getPercentOfAndMax100(
            requiredLevel99s + requiredLevel120s,
            HighscoreService.SKILL_AMOUNT
        )
    }
}
