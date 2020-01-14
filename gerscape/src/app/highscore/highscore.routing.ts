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
        component: HighscoreComponent,
        children: [
            {
                path: ':playername/stats', 
                component: HighscoreStatsComponent
            },
            {
                path: ':playername/activities', 
                component: HighscoreActivitiesComponent
            },
            {
                path: ':playername/quests', 
                component: HighscoreQuestsComponent
            },
            {
                path: ':playername/events', 
                component: HighscoreSesonalEventsComponent
            },
            {
                path: ':playername/clan', 
                component: HighscoreClanComponent
            }
        ]    
    },
    {
        path: ':playername', 
        redirectTo: ":playername/stats"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HighscoreRoutingModule {

}