import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { Subscription, Observable } from 'rxjs'
import * as HighscoreActions from '../store/highscore.actions'
import { HighscoreService } from '../service/highscore.service'
import { ClanMember, Role } from '../model/clan-member.model'

@Component({
    selector: 'app-highscore-clan',
    templateUrl: 'highscore-clan.component.html',
    styleUrls: ['highscore-clan.component.css'],
})
export class HighscoreClanComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, { static: true }) sort: MatSort
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator

    displayedColumns: string[] = ['name', 'role', 'clanXp', 'kills']
    dataSource = new MatTableDataSource<ClanMember>()

    storeSubscription: Subscription

    clanName$: Observable<string>
    clanMembersCallState$: Observable<string>
    clanNameCallState$: Observable<string>
    clanMembersCount = 0

    constructor(private store: Store<AppState>, private highscoreService: HighscoreService) {}

    ngOnInit() {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator

        this.clanName$ = this.highscoreService.getClanName$()

        this.clanMembersCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_CLAN_MEMBERS_OF_CLAN
        )
        this.clanNameCallState$ = this.highscoreService.getCallStateOfActionX$(
            HighscoreActions.FETCH_PLAYERS_CLAN_NAME
        )

        this.storeSubscription = this.store
            .select((state: AppState) => state.highscore.clanMembers)
            .subscribe((clanMembers) => {
                if (clanMembers) {
                    this.dataSource.data = clanMembers
                    this.clanMembersCount = clanMembers.length
                }
            })
    }

    ngOnDestroy() {
        if (this.storeSubscription) this.storeSubscription.unsubscribe()
    }

    getRoleImage(role: Role) {
        if (role) return HighscoreService.ROLE_ICONS.filter((data) => data.engRole == role)[0].image
    }

    getRoleName(role: Role) {
        if (role) {
            const wtfBug = HighscoreService.ROLE_ICONS.filter((data) => data.engRole == role)
            return wtfBug.length > 0 ? wtfBug[0].gerRole : ''
        } else {
            return ''
        }
    }
}
