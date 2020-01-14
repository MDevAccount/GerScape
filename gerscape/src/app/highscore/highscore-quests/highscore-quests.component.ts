import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Quest, Status } from '../model/quest.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-highscore-quests',
  templateUrl: 'highscore-quests.component.html',
  styleUrls: ['highscore-quests.component.css'],
})
export class HighscoreQuestsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['title', 'status', 'difficulty', 'members', 'questPoints'];
  dataSource = new MatTableDataSource<Quest>([]);
  isRuneMetricsProfilePrivate = false;
  storeSubscription: Subscription;
  isFetchingData = false;
  questsCount = 0;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.storeSubscription = this.store.select('highscore').subscribe(state => {
      if (state.questResponse)  {
        this.dataSource.data = state.questResponse.quests;
        this.questsCount = state.questResponse.quests.length;
      }
      this.isRuneMetricsProfilePrivate = state.isRuneMetricsProfilePrivate;
      this.isFetchingData = state.isFetchingData;
    });
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
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