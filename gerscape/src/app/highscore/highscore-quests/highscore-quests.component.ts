import {Component, ViewChild, OnInit} from '@angular/core';
import { MatSort, MatTableDataSource, MatSortable } from '@angular/material';
import { Skillvalue, RuneMetricsProfile } from '../model/runemetrics-profile.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { HighscoreService } from '../service/highscore.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { HighscoreLight, Skill } from '../model/highscore-light.model';
import { Quest, Status } from '../model/quest.model';

@Component({
  selector: 'app-highscore-quests',
  templateUrl: 'highscore-quests.component.html',
  styleUrls: ['highscore-quests.component.css'],
})
export class HighscoreQuestsComponent implements OnInit {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  displayedColumns: string[] = ['title', 'status', 'difficulty', 'members', 'questPoints'];
  dataSource = new MatTableDataSource<Quest>([]);


  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.store.select('highscore').subscribe(state => {
      this.dataSource.data = state.questResponse.quests;
    });
  }

  getStatus(quest: Quest) {
    switch(quest.status) {
      case Status.Completed: 
        return "Abgeschlossen";
      case Status.NotStarted:
        return "Nicht angefangen";
      case Status.Started:
        return "Angefangen";
      default:
        return '';
    }
  }
}