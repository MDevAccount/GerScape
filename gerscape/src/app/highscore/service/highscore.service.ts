import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuneMetricsProfile } from 'src/app/highscore/model/runemetrics-profile.model';
import { HighscoreLight } from 'src/app/highscore/model/highscore-light.model';

@Injectable()
export class HighscoreService {

    public static URL_CORS_ANYWHERE = "https://cors-anywhere.herokuapp.com/";

    public static URL_PLAYER_HIGHSCORE_LIGHT = "https://secure.runescape.com/m=hiscore/index_lite.ws?player=#VAR#";
    public static URL_RUNEMETRICS_PROFILE = "https://apps.runescape.com/runemetrics/profile/profile?user=#VAR#&activities=20";
    public static URL_PLAYER_QUESTS = "https://apps.runescape.com/runemetrics/quests?user=#VAR#";
    public static URL_PLAYER_DETAILS = "http://services.runescape.com/m=website-data/playerDetails.ws?names=%5B%22#VAR#%22%5D&callback=jQuery000000000000000_0000000000&_=0";
    public static URL_CLANMEMBERS = "services.runescape.com/m=clan-hiscores/members_lite.ws?clanName=#VAR#"
    public static URL_SESONAL_EVENTS = "http://services.runescape.com/m=temp-hiscores/getRankings.json?player=#VAR#&status=archived";

    public static MAX_TOTAL_XP = 5400000000;
    public static MAX_SKILL_XP = 200000000;
    public static MAX_LEVEL = 2673;
    public static COMP_LEVEL = 2778;
    public static ALL_120_TOTAL_LEVEL = 3240;
    public static XP_AT_120 = 104273167;

    public static SKILL_NAMES = [
        'Angriff',
        'Verteidigung',
        'Stärke',
        'Lebenspunkte',
        'Fernkampf',
        'Gebet',
        'Magie',
        'Kochen',
        'Holzfällerei',
        'Bognerei',
        'Fischen',
        'Funkenschlagen',
        'Handwerk',
        'Schmieden',
        'Bergbau',
        'Pflanzenkunde',
        'Gewandheit',
        'Diebstahl',
        'Berserker',
        'Landwirtschaft',
        'Runenfertigung',
        'Jagen',
        'Baukunst',
        'Beschwörung',
        'Kerkerkunde',
        'Mystik',
        'Erfinden'];

    static SKILL_ICONS = [
        'attack',
        'defence',
        'strength',
        'constitution',
        'ranged',
        'prayer',
        'magic',
        'cooking',
        'woodcutting',
        'fletching',
        'fishing',
        'firemaking',
        'crafting',
        'smithing',
        'mining',
        'herblore',
        'agility',
        'thieving',
        'slayer',
        'farming',
        'runecrafting',
        'hunter',
        'construction',
        'summoning',
        'dungeoneering',
        'divination',
        'invention'];

    skillXps: number[] = [];
    
    constructor(
        private http: HttpClient) {
            this.createSkillXpArray();
    }

    private createSkillXpArray() {
        for (let level = 0; level <= 127; level++) {
            this.skillXps[level] = (1/8*level*(level-1))+75*((Math.pow(2, (level -1)/7)-1)/(1-Math.pow(2, -1/7)));
        }
    } 
    

    public getLevelForXp(xp: number) {
        if (xp && xp > 0) {
            for (let level = 0; level < this.skillXps.length; level++) {
                if (this.skillXps[level] > xp) {
                    return level - 1;
                }
            }
        }
        return -1;
    }

    public createHttpGetRequest<T>(param: string, url: string, reponseTypeText?: boolean) {
        if (reponseTypeText)
            return this.http.get<T>(
                HighscoreService.URL_CORS_ANYWHERE + url.replace("#VAR#",  param), 
                    {
                        responseType: 'text' as  'json'
                    }
                );
                
        return this.http.get<T>(HighscoreService.URL_CORS_ANYWHERE + url.replace("#VAR#",  param))
    }

    hasMaxXp(rsData: RuneMetricsProfile | HighscoreLight) {
        if (!rsData)
            return false;

        if (rsData instanceof RuneMetricsProfile)
            return rsData.totalxp == HighscoreService.MAX_TOTAL_XP;

        if (rsData instanceof HighscoreLight)
            return rsData.skills[0].xp == HighscoreService.MAX_TOTAL_XP;
    }

    hasCompLevel(rsData: RuneMetricsProfile) {
        if (!rsData)
            return false;

        return rsData.totalskill == HighscoreService.COMP_LEVEL;
    }

    hasCompLevelLight(rsData: HighscoreLight) {
        if (!rsData)
            return false;

        return rsData.skills[0].level == HighscoreService.COMP_LEVEL;
    }

    hasMaxLevel(rsData: RuneMetricsProfile | HighscoreLight) {
        if (!rsData)
            return false;

        if (rsData instanceof RuneMetricsProfile)
            return rsData.totalskill == HighscoreService.MAX_LEVEL;

        if (rsData instanceof HighscoreLight)
            return rsData.skills[0].level == HighscoreService.MAX_LEVEL;
    }

    hasAll120s(rsData: RuneMetricsProfile | HighscoreLight) {
        if (!rsData)
            return false;

        if (rsData instanceof RuneMetricsProfile)
            return rsData.skillvalues.filter(skillValue => !this.isSkill120(skillValue.xp)).length > 0;

        if (rsData instanceof HighscoreLight)
            return rsData.skills.filter((skillValue, index) => index != 0 && !this.isSkill120(skillValue.xp)).length > 1;
    }

    isSkill120(xp: number) {
        return xp > HighscoreService.XP_AT_120;
    }

    getPercentOfNextLevel(xp: number) {
        let currLevelXp = this.skillXps[this.getLevelForXp(xp)];
        let nextLevelXp = this.skillXps[this.getNextLevel(xp)];
        let difXpFromLevelToLevel = nextLevelXp - currLevelXp;
        let xpProgress = xp - currLevelXp;
        return (xp === HighscoreService.MAX_SKILL_XP) ? 100 :  Math.round(( xpProgress / difXpFromLevelToLevel) * 100);
    }

    getXpTillNextLevel(xp: number) {
        if (this.getNextLevel(xp) == 126)
            return HighscoreService.MAX_SKILL_XP - xp; 
        return this.skillXps[this.getNextLevel(xp)] - xp;
    }

    getNextLevel(xp: number) {
        return this.getLevelForXp(xp) + 1;
    }


}