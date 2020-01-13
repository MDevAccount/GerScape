import {Component, ViewChild, OnInit} from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
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
  isRuneMetricsProfilePrivate = false;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.store.select('highscore').subscribe(state => {
      if (state.questResponse) 
        this.dataSource.data = state.questResponse.quests;
        this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
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