export class HighscoreLight {
    constructor(
        public name: string,
        public totalXp: number,
        public totalLevel: number,
        public totalRank: number,
        public combatLevel: number,
        public skills: Skill[],
        public minigames: Minigame[]) {

    }
}

export class Skill {
    constructor(   
        public id: number, 
        public level: number,
        public xp:    number,
        public rank:  number) {

    }

}

export class Minigame {
    constructor(
        public score: number,
        public rank: number) {

    }
}
