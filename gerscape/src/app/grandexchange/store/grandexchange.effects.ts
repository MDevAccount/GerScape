import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import * as GrandExchangeActions from './grandexchange.actions'
import { switchMap, map, catchError } from 'rxjs/operators'
import { GrandExchangeService } from '../service/grandexchange.service'
import { SharedService } from 'src/app/shared/service/shared.service'
import { LoadingState } from 'src/app/shared/model/call-state.model'
import { of } from 'rxjs'
import { GrandExchangeItem, Trend } from '../model/grandexchange-item.model'
import { HttpClient } from '@angular/common/http'

export interface ItemResponse {
    item: Item
}

export interface Item {
    icon: string
    icon_large: string
    id: number
    type: string
    typeIcon: string
    name: string
    description: string
    current: Current
    today: Current
    members: string
    day30: Day
    day90: Day
    day180: Day
}

export interface Current {
    trend: string
    price: string
}

export interface Day {
    trend: string
    change: string
}

@Injectable()
export class GrandExchangeEffects {
    constructor(
        private actions$: Actions,
        private grandExchangeService: GrandExchangeService,
        private http: HttpClient
    ) {}

    @Effect()
    fetchClanMembers = this.actions$.pipe(
        ofType(GrandExchangeActions.GRANDEXCHANGE_FETCH_ITEM),
        switchMap((action: GrandExchangeActions.FetchGrandExchangeItem) => {
            const url = SharedService.getCompleteUrl(
                GrandExchangeService.URL_ITEM,
                '' + action.payload
            )
            this.grandExchangeService.dispatchCallStateOfActionX(LoadingState.LOADING, action.type)

            return this.http.get<ItemResponse>(url).pipe(
                map((itemResponse) => {
                    this.grandExchangeService.dispatchCallStateOfActionX(
                        LoadingState.LOADED,
                        action.type
                    )
                    return new GrandExchangeActions.AddGrandExchangeItem(
                        this.handleItemResponse(itemResponse)
                    )
                }),
                catchError((error) => {
                    console.log(error)
                    this.grandExchangeService.dispatchCallStateOfActionX(
                        LoadingState.ERROR,
                        action.type,
                        error
                    )

                    return of(new GrandExchangeActions.AddGrandExchangeItem(null))
                })
            )
        })
    )

    handleItemResponse(res: ItemResponse) {
        if (!res) return null
        return new GrandExchangeItem(
            res.item.icon,
            res.item.icon_large,
            res.item.id,
            res.item.type,
            res.item.typeIcon,
            res.item.name,
            res.item.description,
            res.item.members == 'true' ? true : false,
            res.item.today.price,
            Trend[res.item.today.trend],
            Trend[res.item.day30.trend],
            res.item.day30.change,
            Trend[res.item.day90.trend],
            res.item.day90.change,
            Trend[res.item.day180.trend],
            res.item.day180.change
        )
    }
}
