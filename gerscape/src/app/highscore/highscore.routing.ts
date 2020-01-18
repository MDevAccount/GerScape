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
        redirectTo: 'stats/',
        pathMatch: 'full',
    },
    {
        path: 'stats',
        redirectTo: 'stats/',
    },
    {
        path: 'activities',
        redirectTo: 'activities/',
    },
    {
        path: 'quests',
        redirectTo: 'quests/',
    },
    {
        path: 'clan',
        redirectTo: 'clan/',
    },
    {
        path: 'sesonal',
        redirectTo: 'sesonal/',
    },
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
                path: 'clan/:playername',
                component: HighscoreClanComponent,
            },
            {
                path: 'events/:playername',
                component: HighscoreSesonalEventsComponent,
            },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HighscoreRoutingModule {}
