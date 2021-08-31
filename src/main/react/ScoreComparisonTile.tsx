import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { Paper, Tooltip, Typography } from '@material-ui/core';
//
import { ScoreComparison, ScoreComparisonScore, siteGreen, siteGreyDark, siteRed, ThemeStyle } from "./definitions.ts";

export const ScoreComparisonTile = (props: { info: ScoreComparison, theme: Function }) => {
  const getColour = (ix: number) => {
    if (props.info.scores.length == 2) {
      if (props.info.scores[0].score == props.info.scores[1].score) {
        return siteGreyDark;
      }
      if (props.info.scores[ix].score > props.info.scores[1 - ix].score) {
        return siteGreen;
      }
      return siteRed;
    }
    return siteGreyDark;
  }

  return <div className='score_comparison_'>
    <Typography className='label_' variant='h6' style={{ ...props.theme() }}>
      {props.info.name}
    </Typography>

    <div className='image_outer_'>
      <img className='image_' src={props.info.image} /> : <div className='image_' />
    </div>
    <div className='scores_'>
      {props.info.scores.map((e, ix) => <Typography
        className='score_'
        variant='body1'
        style={{ ...props.theme(), color: getColour(ix) }}
      >
        {`${e.userId}: ${e.score}`}
      </Typography>)}
    </div>
  </div>;
}