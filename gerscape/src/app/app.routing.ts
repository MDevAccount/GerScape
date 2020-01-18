import { NgModule } from '@angular/core'
import { RouterModule, Routes, PreloadAllModules } from '@angular/router'

const appRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'highscore',
                loadChildren: () =>
                    import('./highscore/highscore.module').then((m) => m.HighscoreModule),
            },
            {
                path: 'grandexchange',
                loadChildren: () =>
                    import('./grandexchange/grandexchange.module').then(
                        (m) => m.GrandExchangeModule
                    ),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/highscore/stats',
    },
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            paramsInheritanceStrategy: 'always',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
