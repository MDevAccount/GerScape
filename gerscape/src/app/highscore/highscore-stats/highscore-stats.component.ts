import {Component, ViewChild, OnInit} from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Skillvalue } from '../model/runemetrics-profile.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-highscore-stats',
  templateUrl: 'highscore-stats.component.html',
  styleUrls: ['highscore-stats.component.css'],
})
export class HighscoreStatsComponent implements OnInit {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  displayedColumns: string[] = ['level', 'xp', 'rank'];
  dataSource = new MatTableDataSource<Skillvalue>();
  runeMetricsProfile = null;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.store.select('highscore').subscribe(state => {
      this.dataSource.data = state.runemetricsProfile.skillvalues;
      this.runeMetricsProfile = state.runemetricsProfile;
      console.log(this.runeMetricsProfile);
    });
  }

}