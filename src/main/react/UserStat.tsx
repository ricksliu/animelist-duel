import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { Tooltip, Typography } from '@material-ui/core';
//
import { siteGreen, siteGreyDark, siteGreyLight, siteRed, ThemeStyle } from "./definitions.ts";

export const UserStat = (props: { stats: number[], reversed: boolean, label: string, usernames: string[], theme: Function }) => {
  const modifier = props.stats.length + 1.0;
  const total = props.reversed
    ? props.stats.reduce((a, b) => a + 1.0 / (b + modifier), 0.0)
    : props.stats.reduce((a, b) => a + b + modifier, 0.0);

  const getWidth = (stat: number) => {
    switch (props.reversed) {
      case false:
        return 100.0 * (stat + modifier) / total;
      case true:
        return 100.0 * (1.0 / (stat + modifier)) / total;
      default:
        return 100.0 / props.stats.length;
    }
  }

  const getColour = (ix: number) => {
    if (props.stats.length == 2) {
      if (props.reversed == null || props.stats[0] == props.stats[1]) {
        return ix % 2 == 1 ? siteGreyDark : siteGreyLight;
      }
      if (props.stats[ix] > props.stats[1 - ix]) {
        return props.reversed ? siteRed : siteGreen;
      }
      return props.reversed ? siteGreen : siteRed;
    }
    return ix % 2 == 1 ? siteGreyDark : siteGreyLight;
  }

  return <div className='user_stat_'>
    <Typography className='label_' variant='h6' style={{ ...props.theme() }}>
      {props.label}
    </Typography>

    <div className='bar_'>
      {props.stats.map((e, ix) => <Tooltip key={ix} title={`${props.usernames[ix]}'s ${props.label}: ${e}`}><div
        className='bar_section_'
        style={{ width: `${getWidth(e)}%` }}
      >
        <Typography className='stat_' variant='h6' style={{ ...props.theme(0), backgroundColor: getColour(ix) }}>
          {e}
        </Typography>
      </div></Tooltip>)}
    </div>
  </div>;
}