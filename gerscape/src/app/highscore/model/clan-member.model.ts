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
    Admin = 'Admin',
    Overseer = 'Overseer',
    Coordinator = 'Coordinator',
    DeputyOwner = 'Deputy Owner',
    General = 'General',
    Organiser = 'Organiser',
    Captain = 'Captain',
    Lieutenant = 'Lieutenant',
    Sergeant = 'Sergeant',
    Corporal = 'Corporal',
    Recruit = 'Recruit',
    Unknown = 'Unknown',
}
