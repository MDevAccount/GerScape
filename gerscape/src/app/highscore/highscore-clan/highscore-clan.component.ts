import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { ClanMember } from '../model/clanmember.model';

@Component({
  selector: 'app-highscore-clan',
  templateUrl: 'highscore-clan.component.html',
  styleUrls: ['highscore-clan.component.css'],
})
export class HighscoreClanComponent implements OnInit {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  displayedColumns: string[] = ['name', 'role', 'clanXp', 'kills'];
  dataSource = new MatTableDataSource<ClanMember>([]);
  playerDetails;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.store.select('highscore').subscribe(state => {
      if (state.playerDetails)
        this.playerDetails = state.playerDetails;
      if (state.clanMembers)
        this.dataSource.data = state.clanMembers;
    });
  }

  getRole(clanMember: ClanMember) {
    return "rolle";
  }
 
}