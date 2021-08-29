import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { Paper, Tooltip, Typography } from '@material-ui/core';
//
import { ThemeStyle } from "./definitions.ts";

export const UserStat = (props: { stats: number[], reversed: boolean, label: string, usernames: string[], theme: Function }) => {
  const total = props.reversed ? props.stats.reduce((a, b) => a + 1.0 / (b + 1.0), 0.0) : props.stats.reduce((a, b) => a + b, 0.0);

  const getWidth = (stat: number) => {
    switch (props.reversed) {
      case false:
        return 100.0 * stat / total;
      case true:
        return 100.0 * (1.0 / (stat + 1.0)) / total;
      default:
        return 100.0 / props.stats.length;
    }
  }

  const getColour = (ix: number) => {
    if (props.stats.length == 2) {
      if (props.reversed == null || props.stats[0] == props.stats[1]) {
        return '#BDC3C7';
      }
      if (props.stats[ix] > props.stats[1 - ix]) {
        return props.reversed ? '#EC7063' : '#52BE80';
      }
      return props.reversed ? '#52BE80' : '#EC7063';
    }

    return ix % 2 == 1 ? '#BDC3C7' : '#A6ACAF';
  }

  return <div className='user_stat_'>
    <Typography className='label_' variant='h6' style={{ ...props.theme() }}>
      {props.label}
    </Typography>

    <div className='bar_'>
      {props.stats.map((e, ix) => <Tooltip key={ix} title={`${props.usernames[ix]}'s ${props.label}: ${e}`}><Paper
        className='bar_section_'
        elevation={3}
        style={{ width: `${getWidth(e)}%` }}
      >
        <Typography className='stat_' variant='body1' style={{ ...props.theme(2), backgroundColor: getColour(ix) }}>
          {e}
        </Typography>
      </Paper></Tooltip>)}
    </div>
  </div>;
}