import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { IconButton, LinearProgress, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
//
import { getTheme, ScoreComparison, Theme, ThemeStyle, User, userStatInfo } from "./definitions.ts";
import { UserTile } from "./UserTile.tsx";
import { UserStat } from "./UserStat.tsx";
import { ScoreComparisonTile } from "./ScoreComparisonTile.tsx";

declare const baseUrl: string;

const initialUserTiles = 1;
const numScoreComparisons = 3;

export const Index = (props: any) => {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState(null as User[]);
  const [loadedUsers, setLoadedUsers] = React.useState(null as User[]);
  const [scoreComparisons, setScoreComparisons] = React.useState(null as ScoreComparison[]);

  React.useEffect(() => {
    const newUsers = [];
    for (let i = 0; i < initialUserTiles; i++) {
      newUsers.push(null);
    }
    setUsers(newUsers);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (users == null || users.filter(e => e).length == 0) {
      setLoadedUsers(null);
    } else {
      setLoadedUsers(users.filter(e => e));
    }
  }, [users]);

  const theme = (variant: number = 3) => {
    return getTheme(Theme.MAL, variant);
  }

  const getUser = (ix: number, username: string) => {
    setLoading(true);
    axios.post(`${baseUrl}/getuser`, {
        animeWebsite: 'MAL',
        username: username,
        usernames: loadedUsers ? loadedUsers.map(e => e.username) : null
      })
      .then((response) => {
        const newUsers = [...users];
        newUsers[ix] = response.data.user as User;
        setUsers(newUsers);
        setScoreComparisons(response.data.scoreComparisons);
      })
      .catch((error) => {
        alert('Could not find user.');
      }).finally(() => {
        setLoading(false);
      });
  }

  const deleteUser = (ix: number) => {
    const newUsers = [...users];
    newUsers.splice(ix, 1);
    setUsers(newUsers);

    //delete score comparisons
  }

  const getScoreComparisons = () => {
    const diffs = scoreComparisons.map(e => Math.max(...e.scores.map(e => e.score)) - Math.min(...e.scores.map(e => e.score)));
    let diff = 10;

    let filteredScoreComparisons = [];
    while (filteredScoreComparisons.length < Math.min(scoreComparisons.length, numScoreComparisons)) {
      for (let i = 0; i < scoreComparisons.length; i++) {
        if (diffs[i] == diff) {
          filteredScoreComparisons.push(scoreComparisons[i]);
          if (filteredScoreComparisons.length < Math.min(scoreComparisons.length, numScoreComparisons)) {
            break;
          }
        }
      }
      diff--;
    }

    return filteredScoreComparisons;
  }

  return <div className='index_'>
    <div className='header_' style={{ ...theme(0) }}>
      <Typography variant='h2' style={{ ...theme(0) }}>
        AnimeList Duel
      </Typography>
      <Typography variant='body1' style={{ ...theme(0) }}>
        "Only the dead have seen the end of anime." —Sun Tzu
      </Typography>
    </div>

    {(!users || loading) ? <LinearProgress /> : <div style={{ height: '4px' }} />}

    {users && <div className='user_tiles_'>
      {users.map((e, ix) => <UserTile
        key={ix}
        ix={ix}
        user={e}
        getUser={getUser}
        deleteUser={deleteUser}
        theme={theme}
      />)}
      <Tooltip title='Add User'><IconButton
        onClick={() => setUsers([ ...users, null ])}
        size='small'
        color='primary'
      >
        <AddIcon />
      </IconButton></Tooltip>
    </div>}

    {loadedUsers && <div className='user_stats_'>
      <Typography variant='h4' style={{ ...theme(1) }}>
        Stat Face-Off
      </Typography>
      <Typography variant='caption' style={{ ...theme(1) }}>
        "Starting Life From 0.0"
      </Typography>
      {userStatInfo.map((e, ix) => <UserStat
        key={ix}
        stats={loadedUsers.map(f => f[e.name])}
        label={e.label}
        reversed={e.reversed}
        usernames={loadedUsers.map(e => e.username)}
        theme={theme}
      />)}
    </div>}

    {scoreComparisons && <div className='score_comparisons_'>
      <Typography variant='h4' style={{ ...theme(1) }}>
        Opinion Clash
      </Typography>
      <Typography variant='caption' style={{ ...theme(1) }}>
        "Your Opinion Is Wrong As I Expected"
      </Typography>
      {getScoreComparisons().map((e, ix) => <ScoreComparisonTile
        key={ix}
        info={e}
        theme={theme}
      />)}
    </div>}
  </div>;
}