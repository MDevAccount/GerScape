import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'
import { MatSort, MatTableDataSource, MatSortable } from '@angular/material'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { HighscoreService } from '../service/highscore.service'
import { BreakpointObserver } from '@angular/cdk/layout'
import { DecimalPipe } from '@angular/common'
import { Subscription, of, Observable } from 'rxjs'
import { switchMap, mergeMap, map, flatMap, tap } from 'rxjs/operators'
import { Skill } from '../model/skill.model'
import * as HighscoreActions from '../store/highscore.actions'

@Component({
    selector: 'app-highscore-stats',
    templateUrl: 'highscore-stats.component.html',
    styleUrls: ['highscore-stats.component.css'],
})
export class HighscoreStatsComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, { static: true }) sort: MatSort
    displayedColumns: string[] = ['icon', 'level', 'xp', 'xpProgress', 'rank']
    dataSource = new MatTableDataSource<Skill>([])
    skillIcons = HighscoreService.SKILL_ICONS
    skillNames = HighscoreService.SKILL_NAMES
    smallScreen = false

    storeSubscription: Subscription
    highscoreLightCallState$: Observable<string>
    skillsCount = 0

    constructor(
        private store: Store<AppState>,
        private highscoreService: HighscoreService,
        private breakpointObserver: BreakpointObserver,
        private numberPipe: DecimalPipe
    ) {}

    ngOnInit() {
        this.dataSource.sort = this.sort

        this.breakpointObserver.observe(['(max-width: 850px)']).subscribe((result) => {
            this.displayedColumns = result.matches
                ? ['icon', 'level', 'xp', 'rank']
                : ['icon', 'level', 'xp', 'xpProgress', 'rank']
            this.smallScreen = result.matches
        })

        this.highscoreLightCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_LIGHT_HIGHSCORE
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.highscoreLightProfile)
            .subscribe((highscoreLight) => {
                if (highscoreLight) {
                    this.dataSource.data = highscoreLight.skills
                    this.skillsCount = highscoreLight.skills.length
                }
            })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
    }

    getSkillProgressPercentage(skillXp: number) {
        return this.highscoreService.getPercentOfNextLevel(skillXp)
    }

    getToolTipText(skillXp: number) {
        let xpTillnextLevel = this.highscoreService.getXpTillNextLevel(skillXp)
        let nextLevel = this.highscoreService.getLevelForXp(skillXp) + 1
        return skillXp < HighscoreService.MAX_SKILL_XP
            ? this.numberPipe.transform(xpTillnextLevel, '1.0-0') +
                  ' Ep bis Level (' +
                  this.numberPipe.transform(nextLevel, '1.0-0') +
                  ')'
            : ''
    }

    getPercentToNextLevel(xp: number) {
        return this.highscoreService.getPercentOfNextLevel(xp)
    }
}
