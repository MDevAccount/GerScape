import { NgModule, LOCALE_ID } from '@angular/core';
import { HighscoreService } from './highscore/service/highscore.service';
import { DecimalPipe, registerLocaleData } from '@angular/common';

import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

@NgModule({
    providers: [
        HighscoreService, 
        DecimalPipe,
        { provide: LOCALE_ID, useValue: "de" }
      ],
})
export class CoreModule { }
