import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
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
  displayedColumns: string[] = ['startDate', 'endDate', 'title', 'score_raw', 'rank'];
  dataSource = new MatTableDataSource<SesonalEvent>([]);
  isRuneMetricsProfilePrivate = false;
  storeSubscription: Subscription;
  isFetchingData = false;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.storeSubscription = this.store.select('highscore').subscribe(state => {
      if (state.sesonalEvents)
        this.dataSource.data = state.sesonalEvents;
      this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
      this.isFetchingData = state.isFetchingData;
    });
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
 
}