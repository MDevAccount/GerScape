import {Component, ViewChild, OnInit} from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Activity } from '../model/runemetrics-profile.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { SesonalEvent } from '../model/sesonal-event.model';

@Component({
  selector: 'app-highscore-sesonal',
  templateUrl: 'highscore-sesonal.component.html',
  styleUrls: ['highscore-sesonal.component.css'],
})
export class HighscoreSesonalEventsComponent implements OnInit {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  displayedColumns: string[] = ['startDate', 'endDate', 'title', 'score_raw', 'rank'];
  dataSource = new MatTableDataSource<SesonalEvent>([]);
  isRuneMetricsProfilePrivate = false;
  
  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.store.select('highscore').subscribe(state => {
      if (state.sesonalEvents)
        this.dataSource.data = state.sesonalEvents;
      this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
    });
  }

 
}