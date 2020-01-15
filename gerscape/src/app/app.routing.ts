import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
    {
        path: '', 
        redirectTo: '/highscore', 
        pathMatch: 'full'
    },
    {
        path: 'highscore', 
        loadChildren: () => import('./highscore/highscore.module')
        .then(m => m.HighscoreModule)
    },
    {
        path: 'grandexchange', 
        loadChildren: () => import('./grandexchange/grandexchange.module')
        .then(m => m.GrandExchangeModule)
    },
    {
        path: '**', 
        redirectTo: '/highscore'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}  