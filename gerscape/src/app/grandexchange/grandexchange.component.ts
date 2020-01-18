import { OnInit, OnDestroy, Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.reducer'
import { Subscription } from 'rxjs'
import { FetchGrandExchangeItem } from './store/grandexchange.actions'

@Component({
    selector: 'app-grandexchange',
    templateUrl: 'grandexchange.component.html',
    styleUrls: ['grandexchange.component.css'],
})
export class GrandExchangeComponent implements OnInit, OnDestroy {
    storeSubscription: Subscription
    routeSubscription: Subscription

    constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe((params) => {
            //TODO add last request sent to reducer so we can check here..
        })

        this.storeSubscription = this.store.select('grandExchange').subscribe((state) => {})

        this.store.dispatch(new FetchGrandExchangeItem(123))
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe()
        this.routeSubscription.unsubscribe()
    }
}
