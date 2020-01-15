import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { ClanMember } from '../model/clanmember.model';
import { Subscription } from 'rxjs';
import { FetchClanMembers } from '../store/highscore.actions';

@Component({
  selector: 'app-highscore-clan',
  templateUrl: 'highscore-clan.component.html',
  styleUrls: ['highscore-clan.component.css'],
})
export class HighscoreClanComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'role', 'clanXp', 'kills'];
  dataSource = new MatTableDataSource<ClanMember>([]);
  playerDetails;
  storeSubscription: Subscription;
  clanMembersCount = 0;
  isLoadingPlayerDetails = false;
  isLoadingClanMembers = false;
  isClanless = false;
  
  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.storeSubscription = this.store.select('highscore').subscribe(state => {
      this.isLoadingPlayerDetails = state.isLoadingPlayerDetails;
      this.isLoadingClanMembers = state.isLoadingClanMembers;
      this.isClanless = state.isClanless;

      if (state.playerDetails)
        this.playerDetails = state.playerDetails;

      if (state.clanMembers) {
        this.dataSource.data = state.clanMembers;
        this.clanMembersCount = state.clanMembers.length;
      }
       
    });
  }

  getRole(clanMember: ClanMember) {
    return "rolle";
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
 
}