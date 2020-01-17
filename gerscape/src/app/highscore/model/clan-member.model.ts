export class ClanMember {
    constructor(
        public name: string,
        public role: Role,
        public clanXp: number,
        public kills: number
    ) {}
}

export enum Role {
    Owner = 'Owner',
    DeputyOwner = 'Deputy Owner',
    General = 'General',
    Captain = 'Captain',
    Lieutenant = 'Lieutenant',
    Sergeant = 'Sergeant',
    Corporal = 'Corporal',
    Recruit = 'Recruit',
}
