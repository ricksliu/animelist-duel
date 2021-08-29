import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { IconButton, LinearProgress, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
//
import { Theme } from "./enums.ts";
import { getTheme, ThemeStyle, User, userStatInfo } from "./definitions.ts";
import { UserTile } from "./UserTile.tsx";
import { UserStat } from "./UserStat.tsx";

const initialUserTiles = 1;

export const Index = (props: any) => {
  const [users, setUsers] = React.useState(null as User[]);
  const [loadedUsers, setLoadedUsers] = React.useState(null as User[]);
  const [loading, setLoading] = React.useState(true);

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

  const setUser = (ix: number, user: User) => {
    const newUsers = [...users];
    newUsers[ix] = user;
    setUsers(newUsers);
  }

  const deleteUser = (ix: number) => {
    const newUsers = [...users];
    newUsers.splice(ix, 1);
    setUsers(newUsers);
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
        setLoading={setLoading}
        setUser={setUser}
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
        Objectively determining your power levels.
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
  </div>;
}