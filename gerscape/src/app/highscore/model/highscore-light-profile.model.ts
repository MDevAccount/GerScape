import { Skill } from './skill.model'

export class HighscoreLightProfile {
    constructor(
        public name: string,
        public totalLevel: number,
        public totalXp: number,
        public totalRank: number,
        public combatLevel: number,
        public skills: Skill[]
    ) {}
}
