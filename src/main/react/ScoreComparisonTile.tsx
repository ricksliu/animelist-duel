import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { Tooltip, Typography } from '@material-ui/core';
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

    <div className='scores_'>
      {props.info.scores.sort((a, b) => b.score - a.score).map((e, ix) => <Typography
        key={ix}
        className='score_'
        variant='h6'
        style={{ ...props.theme(1), color: getColour(ix) }}
      >
        {`${e.username}: ${e.score}/10`}
      </Typography>)}
    </div>

    <div className='image_outer_'>
      <img className='image_' src={props.info.image} />
    </div>
  </div>;
}