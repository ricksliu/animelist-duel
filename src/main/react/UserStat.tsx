import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { Paper, Tooltip, Typography } from '@material-ui/core';
//

export const UserStat = (props: { stats: number[], reversed: boolean, label: string, usernames: string[] }) => {
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

  return <div className='user_stat_'>
    <Typography className='label_'>
      {props.label}
    </Typography>
    <div className='bar_'>
      {props.stats.map((e, ix) => <Tooltip key={ix} title={`${props.usernames[ix]}'s ${props.label}: ${e}`}><Paper
        className='bar_section_'
        elevation={3}
        style={{ width: `${getWidth(e)}%` }}
      >
        <Typography className='stat_'>
          {e}
        </Typography>
      </Paper></Tooltip>)}
    </div>
  </div>;
}