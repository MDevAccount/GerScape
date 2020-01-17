import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HighscoreComponent } from './highscore.component'
import { HighscoreStatsComponent } from './highscore-stats/highscore-stats.component'
import { HighscoreActivitiesComponent } from './highscore-activities/highscore-activities.component'
import { HighscoreQuestsComponent } from './highscore-quests/highscore-quests.component'
import { HighscoreSesonalEventsComponent } from './highscore-sesonal/highscore-sesonal.component'
import { HighscoreClanComponent } from './highscore-clan/highscore-clan.component'

const routes: Routes = [
    //     {path: 'users', redirectTo: 'users/'},
    // {path: 'users/:filter', component: ItemsComponent}

    {
        path: '',
        component: HighscoreComponent,
        children: [
            {
                path: 'stats',
                component: HighscoreStatsComponent,
                children: [
                    {
                        path: ':playername',
                        component: HighscoreStatsComponent,
                    },
                ],
            },
            {
                path: 'activities/:playername',
                component: HighscoreActivitiesComponent,
                children: [
                    {
                        path: ':playername',
                        component: HighscoreStatsComponent,
                    },
                ],
            },
            {
                path: 'quests/:playername',
                component: HighscoreQuestsComponent,
                children: [
                    {
                        path: ':playername',
                        component: HighscoreStatsComponent,
                    },
                ],
            },
            {
                path: 'events/:playername',
                component: HighscoreSesonalEventsComponent,
                children: [
                    {
                        path: ':playername',
                        component: HighscoreStatsComponent,
                    },
                ],
            },
            {
                path: 'clan/:playername',
                component: HighscoreClanComponent,
                children: [
                    {
                        path: ':playername',
                        component: HighscoreStatsComponent,
                    },
                ],
            },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HighscoreRoutingModule {}
