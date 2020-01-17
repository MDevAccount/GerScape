import { Activity } from './activity.model'
import { Skill } from './skill.model'

export class RuneMetricsProfile {
    constructor(
        public name: string,
        public totalLevel: number,
        public totalXp: number,
        public totalRank: number,
        public combatLevel: number,
        public questsStarted: number,
        public questsComplete: number,
        public questsNotStarted: number,
        public activities: Activity[],
        public skills: Skill[]
    ) {}
}
