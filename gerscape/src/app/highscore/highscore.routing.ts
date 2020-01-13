import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HighscoreComponent } from './highscore.component';

const routes: Routes = [    
    {
        path: '', 
        component: HighscoreComponent
        // children: [
        //     {
        //         path: '', 
        //         component: RecipeDetailMessageComponent
        //     },
        //     {
        //         path: 'new', 
        //         component: RecipeEditComponent},
        //     {
        //         path: ':id', 
        //         component: RecipeDetailComponent, 
        //         resolve: [RecipesResolverService]
        //     },
        //     {
        //         path: ':id/edit', 
        //         component: RecipeEditComponent,
        //         resolve: [RecipesResolverService]
        //     }
        // ]
    }    

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HighscoreRoutingModule {

}