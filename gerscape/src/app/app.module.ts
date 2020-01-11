import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule, MatSortModule, MatPaginatorModule, MatMenuModule, MatButtonModule, MatToolbarModule, MatTabsModule, MatSpinner, MatProgressSpinnerModule, MatCardModule } from '@angular/material';

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

@NgModule({
  declarations: [
    AppComponent,
    HighscoreComponent,
    HeaderComponent,
    HighscoreStatsComponent
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
    EffectsModule.forRoot([HighscoreEffects]),
    StoreModule.forRoot(appReducer)
  ],
  exports: [
    MatMenuModule
  ],
  providers: [HighscoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
