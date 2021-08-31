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
declare const initialUsers: number;
declare const maxScoreComparisons: number;
declare const maxUsers: number;

export const Index = (props: any) => {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState(null as User[]);
  const [loadedUsers, setLoadedUsers] = React.useState(null as User[]);
  const [scoreComparisons, setScoreComparisons] = React.useState([] as ScoreComparison[]);

  React.useEffect(() => {
    const newUsers = [];
    for (let i = 0; i < initialUsers; i++) {
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
    const usernames = loadedUsers ? loadedUsers.map(e => e.username).filter(e => (!users[ix] || e != users[ix].username) && e.toLowerCase() != username.toLowerCase()) : null;
    axios.post(`${baseUrl}/getuser`, {
        animeWebsite: 'MAL',
        username: username,
        usernames: usernames
      })
      .then((response) => {
        const newUsers = [...users];
        newUsers[ix] = response.data.user as User;
        setUsers(newUsers);
        if (response.data.scoreComparisons) {
          setScoreComparisons([...scoreComparisons, ...response.data.scoreComparisons]);
        }
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      }).finally(() => {
        setLoading(false);
      });
  }

  const deleteUser = (ix: number) => {
    const newScoreComparisons = [...scoreComparisons].filter(e => !e.scores.map(f => f.username).includes(users[ix].username));
    setScoreComparisons(newScoreComparisons);

    const newUsers = [...users];
    newUsers.splice(ix, 1);
    setUsers(newUsers);
  }

  const getFilteredScoreComparisons = () => {
    const diffs = scoreComparisons.map(e => Math.max(...e.scores.map(f => f.score)) - Math.min(...e.scores.map(f => f.score)));
    let diff = 10;

    let filteredScoreComparisons = [];
    while (filteredScoreComparisons.length < Math.min(scoreComparisons.length, maxScoreComparisons)) {
      for (let i = 0; i < scoreComparisons.length; i++) {
        if (diffs[i] == diff) {
          filteredScoreComparisons.push(scoreComparisons[i]);
          if (filteredScoreComparisons.length >= Math.min(scoreComparisons.length, maxScoreComparisons)) {
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
      {users.length < maxUsers && <Tooltip title='Add User'><IconButton
        onClick={() => setUsers([ ...users, null ])}
        size='small'
        color='primary'
      >
        <AddIcon />
      </IconButton></Tooltip>}
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

    {scoreComparisons && scoreComparisons.length > 0 && <div className='score_comparisons_'>
      <Typography variant='h4' style={{ ...theme(1) }}>
        Opinion Clash
      </Typography>
      <Typography variant='caption' style={{ ...theme(1) }}>
        "Your Opinion Is Wrong As I Expected"
      </Typography>
      {getFilteredScoreComparisons().map((e, ix) => <ScoreComparisonTile
        key={ix}
        info={e}
        theme={theme}
      />)}
    </div>}
  </div>;
}