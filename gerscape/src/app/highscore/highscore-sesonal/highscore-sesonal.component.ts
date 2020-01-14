import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { SesonalEvent } from '../model/sesonal-event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-highscore-sesonal',
  templateUrl: 'highscore-sesonal.component.html',
  styleUrls: ['highscore-sesonal.component.css'],
})
export class HighscoreSesonalEventsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['startDate', 'endDate', 'title', 'score_raw', 'rank'];
  dataSource = new MatTableDataSource<SesonalEvent>([]);
  isRuneMetricsProfilePrivate = false;
  storeSubscription: Subscription;
  sesonalEventsCount = 0;
  isLoadingSesonalEvents;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.storeSubscription = this.store.select('highscore').subscribe(state => {
      if (state.sesonalEvents) {
        this.dataSource.data = state.sesonalEvents;
        this.sesonalEventsCount = state.sesonalEvents.length;
      }
      this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
      this.isLoadingSesonalEvents = state.isLoadingSesonalEvents;
    });
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
 
}