import {Component, ViewChild, OnInit} from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Activity } from '../model/runemetrics-profile.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-highscore-activities',
  templateUrl: 'highscore-activities.component.html',
  styleUrls: ['highscore-activities.component.css'],
})
export class HighscoreActivitiesComponent implements OnInit {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  displayedColumns: string[] = ['date', 'text', 'details'];
  dataSource = new MatTableDataSource<Activity>([]);
  isRuneMetricsProfilePrivate = false;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.store.select('highscore').subscribe(state => {
      if (state.runemetricsProfile) 
        this.dataSource.data = state.runemetricsProfile.activities;
      this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
    });
  }

 
}