import { HighscoreLightProfile } from './highscore-light-profile.model'
import { Quest } from './quest.model'
import { SesonalEvent } from './sesonal-event.model'
import { RuneMetricsProfile } from './runemetrics-profile.model'
import { ClanMember } from './clan-member.model'
import { Activity } from './activity.model'

export class PlayerProfile {
    constructor(
        public runeMetricsProfile: RuneMetricsProfile,
        public highscoreLightProfile: HighscoreLightProfile,
        public clanName: string,
        public clanMembers: ClanMember[],
        public quests: Quest[],
        public activities: Activity[],
        public sesonalEvents: SesonalEvent[]
    ) {}
}
