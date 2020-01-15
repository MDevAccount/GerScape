import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/module/shared.module';
import { GrandExchangeRoutingModule } from './grandexchange.routing';
import { GrandExchangeComponent } from './grandexchange.component';
import { GrandExchangeItemDetailComponent } from './grandexchange-item-detail/grandexchange-item-detail.component';
import { GrandExchangeItemListComponent } from './grandexchange-item-list/grandexchange-item-list.component';
import { GrandExchangeListItemComponent } from './grandexchange-list-item/grandexchange-list-item.component';

@NgModule({
  declarations: [
    GrandExchangeComponent,
    GrandExchangeItemDetailComponent,
    GrandExchangeItemListComponent,
    GrandExchangeListItemComponent
  ],
  imports: [
    SharedModule,
    GrandExchangeRoutingModule,
  ],
  exports: [
    GrandExchangeComponent
  ]
})
export class GrandExchangeModule { }
