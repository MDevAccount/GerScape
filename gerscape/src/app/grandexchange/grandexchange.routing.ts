import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { GrandExchangeComponent } from './grandexchange.component'

const routes: Routes = [
    {
        path: '',
        component: GrandExchangeComponent,
    },
    {
        path: ':searchterm',
        component: GrandExchangeComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GrandExchangeRoutingModule {}
