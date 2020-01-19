import { OnInit, OnDestroy, Component, ViewChild, ElementRef } from '@angular/core'
import { Store } from '@ngrx/store'
import { Subscription, Observable, Subject } from 'rxjs'
import { AppState } from 'src/app/store/app.reducer'
import { GrandExchangeService } from '../service/grandexchange.service'
import * as GrandExchangeActions from '../store/grandexchange.actions'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
    selector: 'app-grandexchange-search-detail',
    templateUrl: 'grandexchange-search-detail.component.html',
    styleUrls: ['grandexchange-search-detail.component.css'],
})
export class GrandExchangeSearchDetailComponent implements OnInit, OnDestroy {
    onTextChange = new Subject()
    textChangeObs$ = this.onTextChange.asObservable()

    firstNameAutofilled: boolean
    storeSubscription: Subscription

    itemFetchedCallState$: Observable<string>

    constructor(
        private store: Store<AppState>,
        private grandExchangeService: GrandExchangeService
    ) {}

    ngOnInit() {
        this.textChangeObs$.pipe(debounceTime(500), distinctUntilChanged())
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
    }
}
