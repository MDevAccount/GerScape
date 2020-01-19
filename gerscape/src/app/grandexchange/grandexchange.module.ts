import { NgModule } from '@angular/core'

import { SharedModule } from 'src/app/shared/module/shared.module'
import { GrandExchangeRoutingModule } from './grandexchange.routing'
import { GrandExchangeComponent } from './grandexchange.component'
import { GrandExchangeItemListComponent } from './grandexchange-item-list/grandexchange-item-list.component'
import { GrandExchangeItemChartComponent } from './grandexchange-item-chart/grandexchange-item-chart.component'
import { GrandExchangeSearchDetailComponent } from './grandexchange-search-detail/grandexchange-search-detail.component'

@NgModule({
    declarations: [
        GrandExchangeComponent,
        GrandExchangeItemListComponent,
        GrandExchangeItemChartComponent,
        GrandExchangeSearchDetailComponent,
    ],
    imports: [SharedModule, GrandExchangeRoutingModule],
    exports: [GrandExchangeComponent],
})
export class GrandExchangeModule {}
