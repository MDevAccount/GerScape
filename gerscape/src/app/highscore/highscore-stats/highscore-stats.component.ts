import {Component, ViewChild, OnInit} from '@angular/core';
import { MatSort, MatTableDataSource, MatSortable } from '@angular/material';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { HighscoreService } from '../service/highscore.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { Skill } from '../model/highscore-light.model';

@Component({
  selector: 'app-highscore-stats',
  templateUrl: 'highscore-stats.component.html',
  styleUrls: ['highscore-stats.component.css'],
})
export class HighscoreStatsComponent implements OnInit {
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  displayedColumns: string[] = ['icon', 'level', 'xp', 'xpProgress', 'rank'];
  dataSource = new MatTableDataSource<Skill>([]);
  skillIcons = HighscoreService.SKILL_ICONS;
  skillNames = HighscoreService.SKILL_NAMES;
  firstDataSourceCall = true;
  smallScreen = false;

  constructor(
    private store: Store<AppState>,
    private highscoreService: HighscoreService,
    private breakpointObserver: BreakpointObserver,
    private numberPipe: DecimalPipe) {

  }

  ngOnInit() {

    this.breakpointObserver.observe(['(max-width: 850px)']).subscribe(result => {
      this.displayedColumns = result.matches ? 
          ['icon', 'level', 'xp', 'rank'] : 
          ['icon', 'level', 'xp', 'xpProgress', 'rank'];
      this.smallScreen = result.matches;
    });

    this.sort.sort(({ id: 'id', start: 'asc'}) as MatSortable);
    this.dataSource.sort = this.sort;

    this.store.select('highscore').subscribe(state => {
      if (state.highscoreLight)
        this.dataSource.data = state.highscoreLight.skills;
    });
  }

  getSkillProgressPercentage(skillXp: number) {
    return this.highscoreService.getPercentOfNextLevel(skillXp);
  }
  
  getToolTipText(skillXp: number) {
    let xpTillnextLevel = this.highscoreService.getXpTillNextLevel(skillXp);
    let nextLevel = this.highscoreService.getLevelForXp(skillXp) + 1;
    return skillXp < HighscoreService.MAX_SKILL_XP ? 
      this.numberPipe.transform(xpTillnextLevel, "1.0-0") + " Ep bis Level (" + this.numberPipe.transform(nextLevel, "1.0-0") + ")"  :
      '';
  }

  getPercentToNextLevel(xp: number) {
    return this.highscoreService.getPercentOfNextLevel(xp);
  }
}