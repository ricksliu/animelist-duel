import { AnimeWebsite, Theme } from "./enums.ts";

export interface ThemeStyle {
  fontWeight: any;
  fontFamily: string;
  color: string;
  backgroundColor: string;
}

export function getTheme(theme: Theme, variant: number = 3): ThemeStyle {
  switch (theme) {
    case Theme.MAL:
      return {
        fontWeight: ['bold', 'bold', 'normal', 'normal'][variant],
        fontFamily:  'Verdana, sans-serif',
        color: ['white', '#2E51A2', 'white', 'black'][variant],
        backgroundColor: ['#2E51A2', null, null, null][variant],
      };
    case Theme.None:
    default:
      return {
        fontWeight: ['bold', 'bold', 'normal', 'normal'][variant],
        fontFamily:  'Roboto, sans-serif',
        color: ['white', '#2E86C1', 'white', 'black'][variant],
        backgroundColor: ['#2E86C1', null, null, null][variant],
      };
  }
}

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

export interface UserStatInfo {
  name: string;
  label: string;
  reversed: boolean;
}

export const userStatInfo: UserStatInfo[] = [
  {
    name: 'meanScore',
    label: 'Mean Score',
    reversed: null,
  },
  {
    name: 'daysWatched',
    label: 'Days Watched',
    reversed: false,
  },
  {
    name: 'episodesWatched',
    label: 'Episodes Watched',
    reversed: false,
  },
  {
    name: 'entriesTotal',
    label: 'Total Entries',
    reversed: false,
  },
  {
    name: 'entriesCompleted',
    label: 'Completed',
    reversed: false,
  },
  {
    name: 'entriesWatching',
    label: 'Watching',
    reversed: false,
  },
  {
    name: 'entriesOnHold',
    label: 'On Hold',
    reversed: true,
  },
  {
    name: 'entriesDropped',
    label: 'Dropped',
    reversed: true,
  },
  {
    name: 'entriesPlanToWatch',
    label: 'Plan to Watch',
    reversed: true,
  },
  {
    name: 'entriesRewatched',
    label: 'Rewatched',
    reversed: false,
  },
];