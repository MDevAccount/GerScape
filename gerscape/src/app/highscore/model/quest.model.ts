export class Quest {
    constructor(
        public name: string,
        public status: Status,
        public difficulty: number,
        public members: boolean,
        public questPoints: number,
        public userEligible: boolean
    ) {}
}

export enum Status {
    Completed = 'COMPLETED',
    NotStarted = 'NOT_STARTED',
    Started = 'STARTED',
}
