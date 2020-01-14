import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { ClanMember } from '../model/clanmember.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-highscore-clan',
  templateUrl: 'highscore-clan.component.html',
  styleUrls: ['highscore-clan.component.css'],
})
export class HighscoreClanComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  displayedColumns: string[] = ['name', 'role', 'clanXp', 'kills'];
  dataSource = new MatTableDataSource<ClanMember>([]);
  playerDetails;
  storeSubscription: Subscription;
  isFetchingData = false;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.storeSubscription = this.store.select('highscore').subscribe(state => {
      if (state.playerDetails)
        this.playerDetails = state.playerDetails;
      if (state.clanMembers)
        this.dataSource.data = state.clanMembers;
      this.isFetchingData = state.isFetchingData;
    });
  }

  getRole(clanMember: ClanMember) {
    return "rolle";
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
 
}