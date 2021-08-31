export const siteBlue = '#2E86C1';
export const MALBlue = '#2E51A2';

export const siteRed = '#EC7063';
export const siteGreen = '#52BE80';
export const siteGreyDark = '#BDC3C7';
export const siteGreyLight = '#A6ACAF';

export enum AnimeWebsite {
  MAL,
}

export enum Theme {
  None,
  MAL,
}

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
        color: ['white', MALBlue, 'white', 'black'][variant],
        backgroundColor: [MALBlue, null, null, null][variant],
      };
    case Theme.None:
    default:
      return {
        fontWeight: ['bold', 'bold', 'normal', 'normal'][variant],
        fontFamily:  'Roboto, sans-serif',
        color: ['white', siteBlue, 'white', 'black'][variant],
        backgroundColor: [siteBlue, null, null, null][variant],
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

export interface ScoreComparison {
  name: string;
  image: string;
  scores: ScoreComparisonScore[];
}

export interface ScoreComparisonScore {
  username: string;
  score: number;
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