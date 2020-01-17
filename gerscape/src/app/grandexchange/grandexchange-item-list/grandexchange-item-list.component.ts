import { OnInit, OnDestroy, Component, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ItemResponse } from '../model/grandexchange-item.model';

@Component({
    selector: 'app-grandexchange-item-list',
    templateUrl: 'grandexchange-item-list.component.html',
    styleUrls: ['grandexchange-item-list.component.css'],
  })
export class GrandExchangeItemListComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static:true}) sort: MatSort;
    dataSource = new MatTableDataSource<ItemResponse>([]);
    displayedColumns: string[] = ['member', 'icon', 'name', 'price', 'today', '30d', '90day', '180day'];
    storeSubscription: Subscription;
    routeSubscription: Subscription;
    isLoadingGrandExchangeItems = false;
    
    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.dataSource.sort = this.sort;

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