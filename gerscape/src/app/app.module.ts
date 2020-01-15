import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from './shared/module/shared.module';
import { CoreModule } from './core.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HighscoreEffects } from './highscore/store/highscore.effects';
import { HighscoreModule } from './highscore/highscore.module';
import { appReducer } from './store/app.reducer';
import { AppRoutingModule } from './app.routing';
import { GrandExchangeEffects } from './grandexchange/store/grandexchange.effects';
import { GrandExchangeModule } from './grandexchange/grandexchange.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    HighscoreModule,
    GrandExchangeModule,
    EffectsModule.forRoot(
      [
        HighscoreEffects,
        GrandExchangeEffects
      ]
    ),
    StoreModule.forRoot(appReducer),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
