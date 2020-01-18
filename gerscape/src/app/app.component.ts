import { Component, OnInit } from '@angular/core'
import { AppState } from './store/app.reducer'
import { Store } from '@ngrx/store'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    constructor(private store: Store<AppState>) {}

    ngOnInit() {}
}
