export class RuneMetricsProfile {

    constructor(
        public magic:            number,
        public questsstarted:    number,
        public totalskill:       number,
        public questscomplete:   number,
        public questsnotstarted: number,
        public totalxp:          number,
        public ranged:           number,
        public activities:       Activity[],
        public skillvalues:      Skillvalue[],
        public name:             string,
        public rank:             string,
        public melee:            number,
        public combatlevel:      number,
        public loggedIn:         string
    ) {

    }
}

export class Activity {
    constructor(
        public date:    string,
        public details: string,
        public text:    string) {

    }

}

export class Skillvalue {
    constructor(
        public level: number,
        public xp:    number,
        public rank:  number,
        public id:    number) {

    }
 
}
