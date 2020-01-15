import { OnInit, OnDestroy, Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';

@Component({
    selector: 'app-grandexchange-item-list',
    templateUrl: 'grandexchange-item-list.component.html',
    styleUrls: ['grandexchange-item-list.component.css'],
  })
export class GrandExchangeItemListComponent implements OnInit, OnDestroy {
    storeSubscription: Subscription;
    routeSubscription: Subscription;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            //TODO add last request sent to reducer so we can check here..
        
        });

        this.storeSubscription = this.store.select('grandExchange').subscribe(state => {
            
        });
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

}