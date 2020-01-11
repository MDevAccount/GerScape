export class SesonalEvent {

    constructor(
        public score_raw:       number,
        public endDate:         string,
        public score_formatted: string,
        public rank:            number,
        public hiscoreId:       number,
        public title:           string,
        public startDate:       string) {

    }
}
