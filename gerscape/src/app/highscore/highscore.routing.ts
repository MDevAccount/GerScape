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
                path: 'stats/:playername',
                component: HighscoreStatsComponent,
            },
            {
                path: 'activities/:playername',
                component: HighscoreActivitiesComponent,
            },
            {
                path: 'quests/:playername',
                component: HighscoreQuestsComponent,
            },
            {
                path: 'events/:playername',
                component: HighscoreSesonalEventsComponent,
            },
            {
                path: 'clan/:playername',
                component: HighscoreClanComponent,
            },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HighscoreRoutingModule {}
