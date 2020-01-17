import { NgModule } from '@angular/core'
import { HighscoreComponent } from './highscore.component'
import { HighscoreStatsComponent } from './highscore-stats/highscore-stats.component'
import { HighscoreQuestsComponent } from './highscore-quests/highscore-quests.component'
import { HighscoreActivitiesComponent } from './highscore-activities/highscore-activities.component'
import { HighscoreSesonalEventsComponent } from './highscore-sesonal/highscore-sesonal.component'
import { HighscoreStatsChartComponent } from './highscore-stats-chart/highscore-stats-chart.component'
import { HighscoreQuestsChartComponent } from './highscore-quests-chart/highscore-quests-chart.component'
import { SharedModule } from 'src/app/shared/module/shared.module'
import { HighscoreRoutingModule } from './highscore.routing'
import { HighscoreClanComponent } from './highscore-clan/highscore-clan.component'

@NgModule({
    declarations: [
        HighscoreComponent,
        HighscoreStatsComponent,
        HighscoreQuestsComponent,
        HighscoreClanComponent,
        HighscoreActivitiesComponent,
        HighscoreSesonalEventsComponent,
        HighscoreStatsChartComponent,
        HighscoreQuestsChartComponent,
    ],
    imports: [SharedModule, HighscoreRoutingModule],
    exports: [HighscoreComponent],
})
export class HighscoreModule {}
