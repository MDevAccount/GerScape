import { OnInit, OnDestroy, Component, ViewChild, HostListener } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { Subscription, Observable, Subject, of } from 'rxjs'
import { AppState } from 'src/app/store/app.reducer'
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material'
import { GrandExchangeItem } from '../model/grandexchange-item.model'
import { GrandExchangeService } from '../service/grandexchange.service'
import * as GrandExchangeActions from '../store/grandexchange.actions'
import {
    withLatestFrom,
    map,
    switchMap,
    debounce,
    debounceTime,
    distinctUntilChanged,
} from 'rxjs/operators'
import { GrandExchangeItemGraphData } from '../model/grandexchange-item-graph-data.model'

@Component({
    selector: 'app-grandexchange-item-list',
    templateUrl: 'grandexchange-item-list.component.html',
    styleUrls: ['grandexchange-item-list.component.css'],
})
export class GrandExchangeItemListComponent implements OnInit, OnDestroy {
    clickRow = new Subject()
    tableRowClick$ = this.clickRow.asObservable()

    @ViewChild(MatSort, { static: true }) sort: MatSort
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
    dataSource = new MatTableDataSource<GrandExchangeItem>([])
    displayedColumns: string[] = [
        'members',
        'icon',
        'name',
        'priceToday',
        'day30Change',
        'day90Change',
        'day180Change',
    ]
    storeSubscription: Subscription
    routeSubscription: Subscription

    fetchGrandExchangeItemSetCallState$: Observable<string>
    itemCount = 0

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private grandExchangeService: GrandExchangeService
    ) {}

    ngOnInit() {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator

        this.fetchGrandExchangeItemSetCallState$ = this.grandExchangeService.getCallStateOfActionX$(
            GrandExchangeActions.FETCH_GRAND_EXCHANGE_ITEM
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.grandExchange.grandExchangeItems)
            .subscribe((grandExchangeItems) => {
                if (grandExchangeItems && grandExchangeItems.length > 0) {
                    this.dataSource.data = grandExchangeItems
                    this.itemCount = grandExchangeItems.length
                }
            })

        this.tableRowClick$
            .pipe(
                map((row) => {
                    let rowItem = <GrandExchangeItem>row
                    return rowItem.id
                }),
                debounceTime(1000),
                distinctUntilChanged(),
                withLatestFrom(this.store.select((state: AppState) => state.grandExchange)),
                map(([rowItemId, grandExchange]) => {
                    let geItem = grandExchange.grandExchangeItems.filter(
                        (item) => item.id == rowItemId
                    )[0]
                    this.store.dispatch(
                        new GrandExchangeActions.SetCurrentDetailGrandExchangeItem(geItem)
                    )
                    if (
                        grandExchange.grandExchangeItemGraphsData.filter(
                            (graph) => graph.id == rowItemId
                        ).length == 0
                    )
                        this.store.dispatch(
                            new GrandExchangeActions.FetchGrandExchangeItemGraphData(geItem.id)
                        )
                    return geItem.id
                }),
                switchMap((getItemId) => {
                    return this.store
                        .select(
                            (state: AppState) => state.grandExchange.grandExchangeItemGraphsData
                        )
                        .pipe(
                            map((grandExchangeItemGraphsData) => {
                                let graphsForId = grandExchangeItemGraphsData.filter(
                                    (graph) => graph.id == getItemId
                                )
                                let graph: GrandExchangeItemGraphData
                                if (graphsForId.length > 0) graph = graphsForId[0]
                                return graph
                            })
                        )
                })
            )
            .subscribe((graph) => {
                if (graph)
                    this.store.dispatch(
                        new GrandExchangeActions.SetCurrentDetailGrandExchangeItemGraphData(graph)
                    )
            })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
        if (this.routeSubscription) this.routeSubscription.unsubscribe()
    }

    getColorForCell(trend: string) {
        return trend.startsWith('+') ? '#54e01f' : trend.startsWith('-') ? '#e94545' : '#00C86D'
    }
}
