//LORE, BACKSTORY and QUESTS should grab from theme  mix and match templates that have things to fill
// in mad lib style (noun, adj, object, etc) and then have little frame parts that make things work
//like "long long ago".
/*
To make a new menu you need to tie it in two places in the MENU, make its typescript file ,
make its observerbot level
and also wire the first time you go there into the achievement system
(and also possibly the levels of the menu);
*/
export const SKILLGRAPH = "SKILLGRAPH"; //???
export const LOADING = "LOADING"; //just what kind of tips are in the loading screen?
export const STATUS = "STATUS"; //this obviously is gonna get upgraded.
export const STATISTICS = "STATISTICS"; //not all statistics are available at once
export const ACHIEVEMENTS = "ACHIEVEMENTS"; //can you see the achivements you haven't unlocked yet? are they black? readable?
export const OPTIONS = "OPTIONS"; //can you alter the menu opacity? activate hax mode? etc
export const QUESTS = "QUESTS"; //some quests get unlocked as the game progresses, obvs
export const COMPANIONS = "COMPANIONS"; //a title and a bit of backstory, plus what they think about you.
export const GODS = "GODS"; //do you have a patron? any curses by rival gods?
export const CITYBUILDING = "CITYBUILDING"; //what level is your smithy? are your people happy? sad?
export const INVENTORY = "INVENTORY"; //weapons, alchemy ingredients, scrolls, etc (each theme should have at least one associated object)
export const LORE = "LORE"; //whats the actual setting you're in? who is the big bad?
export const BACKSTORY = "BACKSTORY"; //does your char have amnesia? are you a stranger?
export const RESISTANCES = "RESISTANCES"; //are you weak to blunt? strong against heresy?
export const CODE = "CODE"; //have a fake error console that prints out all the fake errors (such as when you hit escape)
//only accessible if in RAGE MODE
export const TRUTH = "TRUTH";
export interface numbermap {
    [details: string] : number;
}


export const max_values_for_menus:numbermap = {
    SKILLGRAPH: 1, 
    LOADING: 1,
    STATUS: 1,
    STATISTICS: 1,
    ACHIEVEMENTS: 1,
    OPTIONS: 3,
    QUESTS: 1,
    COMPANIONS: 2,
    GODS: 4,
    CITYBUILDING: 3, //level 2 shows all possible buildings, level 3 shows options
    INVENTORY: 1,
    LORE: 1,
    BACKSTORY: 3,
    RESISTANCES: 1,
    CODE: 1,
    TRUTH:1,
}