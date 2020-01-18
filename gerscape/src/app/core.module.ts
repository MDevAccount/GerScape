import { NgModule, LOCALE_ID } from '@angular/core'
import { HighscoreService } from './highscore/service/highscore.service'
import { DecimalPipe, registerLocaleData } from '@angular/common'

import localeDe from '@angular/common/locales/de'
import { GrandExchangeService } from './grandexchange/service/grandexchange.service'
import { SharedService } from './shared/service/shared.service'

registerLocaleData(localeDe)

@NgModule({
    providers: [
        HighscoreService,
        GrandExchangeService,
        SharedService,
        DecimalPipe,
        { provide: LOCALE_ID, useValue: 'de' },
    ],
})
export class CoreModule {}
