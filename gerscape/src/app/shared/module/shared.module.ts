import { NgModule } from '@angular/core'
import {
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatGridTile,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
} from '@angular/material'
import { FlexLayoutModule } from '@angular/flex-layout'

import { registerLocaleData, CommonModule } from '@angular/common'
import localeDe from '@angular/common/locales/de'

import { NgApexchartsModule } from 'ng-apexcharts'
import { HttpClientModule } from '@angular/common/http'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { TextFieldModule } from '@angular/cdk/text-field'

registerLocaleData(localeDe)

@NgModule({
    exports: [
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
        ScrollingModule,
        TextFieldModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        NgApexchartsModule,
        CommonModule,
        HttpClientModule,
    ],
})
export class SharedModule {}
