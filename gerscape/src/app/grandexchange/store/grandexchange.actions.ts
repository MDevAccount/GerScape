import { Action } from '@ngrx/store';

export const TEST = "[Highscore] Set is loading clan members";

export class test implements Action {
    readonly type = TEST;

    constructor(public payload: boolean) {

    }
}
export type GrandExchangeActions = test;