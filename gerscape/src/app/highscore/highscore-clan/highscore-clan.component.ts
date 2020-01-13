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
  isClanless = true;

  constructor(
    private store: Store<AppState>) {

  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.store.select('highscore').subscribe(state => {
      this.isClanless = state.isClanless;

      if (!state.isClanless)
        if (state.clanMembers)
          this.dataSource.data = state.clanMembers;
    });
  }

  getRole() {
    return "rolle";
  }
 
}