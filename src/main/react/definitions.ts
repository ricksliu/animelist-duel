import { AnimeWebsite } from "./enums.ts";

export interface User {
    animeWebsite: AnimeWebsite;
    userId: string;
    username: string;
    lastUpdated: Date;
    profilePhoto: string;
    daysWatched: number;
    meanScore: number;
    entriesWatching: number;
    entriesCompleted: number;
    entriesOnHold: number;
    entriesDropped: number;
    entriesPlanToWatch: number;
    entriesTotal: number;
    entriesRewatched: number;
    episodesWatched: number;
}