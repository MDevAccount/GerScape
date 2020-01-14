import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HighscoreComponent } from './highscore.component';
import { HighscoreStatsComponent } from './highscore-stats/highscore-stats.component';
import { HighscoreActivitiesComponent } from './highscore-activities/highscore-activities.component';
import { HighscoreQuestsComponent } from './highscore-quests/highscore-quests.component';
import { HighscoreSesonalEventsComponent } from './highscore-sesonal/highscore-sesonal.component';
import { HighscoreClanComponent } from './highscore-clan/highscore-clan.component';

const routes: Routes = [  
    {
        path: '', 
        component: HighscoreComponent
    },
    {
        path: ':playername', 
        redirectTo: ":playername/stats"
    },
    {
        path: ':playername/stats', 
        component: HighscoreComponent
    },
    {
        path: ':playername/activities', 
        component: HighscoreComponent
    },
    {
        path: ':playername/quests', 
        component: HighscoreComponent
    },
    {
        path: ':playername/events', 
        component: HighscoreComponent
    },
    {
        path: ':playername/clan', 
        component: HighscoreComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HighscoreRoutingModule {

}