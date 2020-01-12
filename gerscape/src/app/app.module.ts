import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule, MatSortModule, MatPaginatorModule, MatMenuModule, MatButtonModule, MatToolbarModule, MatTabsModule, MatSpinner, MatProgressSpinnerModule, MatCardModule, MatProgressBarModule, MatTooltipModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { HighscoreEffects } from './highscore/store/highscore.effects';
import { HttpClientModule } from '@angular/common/http';
import { HighscoreService } from './highscore/service/highscore.service';
import { HighscoreComponent } from './highscore/highscore.component';
import { HighscoreStatsComponent } from './highscore/highscore-stats/highscore-stats.component';
import { HeaderComponent } from './header/header.component';
import { appReducer } from './store/app.reducer';
import { DecimalPipe } from '@angular/common';
import { HighscoreQuestsComponent } from './highscore/highscore-quests/highscore-quests.component';
import { HighscoreClanComponent } from './highscore/highscore-clan/highscore-clan.component';
import { HighscoreActivitiesComponent } from './highscore/highscore-activities/highscore-activities.component';

@NgModule({
  declarations: [
    AppComponent,
    HighscoreComponent,
    HeaderComponent,
    HighscoreStatsComponent,
    HighscoreQuestsComponent,
    HighscoreClanComponent,
    HighscoreActivitiesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTooltipModule,
    EffectsModule.forRoot([HighscoreEffects]),
    StoreModule.forRoot(appReducer)
  ],
  exports: [
    MatMenuModule
  ],
  providers: [HighscoreService, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
