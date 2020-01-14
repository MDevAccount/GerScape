import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Activity } from '../model/runemetrics-profile.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-highscore-activities',
  templateUrl: 'highscore-activities.component.html',
  styleUrls: ['highscore-activities.component.css'],
})
export class HighscoreActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['date', 'text', 'details'];
  dataSource = new MatTableDataSource<Activity>([]);
  isRuneMetricsProfilePrivate = false;
  storeSubscription: Subscription;
  activitiesCount = 0;
  isLoadingRuneMetricsProfile = false;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.storeSubscription = this.store.select('highscore').subscribe(state => {
      this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
      this.isLoadingRuneMetricsProfile = state.isLoadingRuneMetricsProfile;

      if (state.runemetricsProfile) {
        this.dataSource.data = state.runemetricsProfile.activities;
        this.activitiesCount = state.runemetricsProfile.activities.length;
      }
    });
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }

 
}