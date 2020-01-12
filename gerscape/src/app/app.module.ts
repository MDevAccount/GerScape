import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { MatTableModule, MatSortModule, MatPaginatorModule, MatMenuModule, MatButtonModule, MatToolbarModule, MatTabsModule, MatSpinner, MatProgressSpinnerModule, MatCardModule, MatProgressBarModule, MatTooltipModule, MatGridTile, MatGridListModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

import { NgApexchartsModule } from 'ng-apexcharts';

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

import { HighscoreQuestsComponent } from './highscore/highscore-quests/highscore-quests.component';
import { HighscoreClanComponent } from './highscore/highscore-clan/highscore-clan.component';
import { HighscoreActivitiesComponent } from './highscore/highscore-activities/highscore-activities.component';
import { HighscoreSesonalEventsComponent } from './highscore/highscore-sesonal/highscore-sesonal.component';
import { HighscoreOverviewComponent } from './highscore/highscore-overview/highscore-overview.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    HighscoreComponent,
    HeaderComponent,
    HighscoreStatsComponent,
    HighscoreQuestsComponent,
    HighscoreClanComponent,
    HighscoreActivitiesComponent,
    HighscoreSesonalEventsComponent,
    HighscoreOverviewComponent,
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
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    EffectsModule.forRoot([HighscoreEffects]),
    StoreModule.forRoot(appReducer)
  ],
  exports: [
    MatMenuModule
  ],
  providers: [
    HighscoreService, 
    DecimalPipe,
    { provide: LOCALE_ID, useValue: "de" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
