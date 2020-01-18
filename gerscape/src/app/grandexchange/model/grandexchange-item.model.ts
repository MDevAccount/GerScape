export class GrandExchangeItem {
    constructor(
        public icon: string,
        public icon_large: string,
        public id: number,
        public type: string,
        public typeIcon: string,
        public name: string,
        public description: string,
        public members: boolean,
        public priceToday: string,
        public trendToday: Trend,
        public day30Trend: Trend,
        public day30Change: string,
        public day90Trend: Trend,
        public day90Change: string,
        public day180Trend: Trend,
        public day180Change: string
    ) {}
}

export enum Trend {
    Positive = 'positive',
    Neutral = 'neutral',
    Negative = 'negative',
}
