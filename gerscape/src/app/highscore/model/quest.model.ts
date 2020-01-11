export class QuestResponse {
    constructor(    
        public quests:   Quest[],
        public loggedIn: string) {

    }

}

export class Quest {
    constructor(
        public title:        string,
        public status:       Status,
        public difficulty:   number,
        public members:      boolean,
        public questPoints:  number,
        public userEligible: boolean) {

    }
}

export enum Status {
    Completed = "COMPLETED",
    NotStarted = "NOT_STARTED",
}
