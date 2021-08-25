import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { LinearProgress } from '@material-ui/core';
//
import { User } from "./definitions.ts";
import { UserTile } from "./UserTile.tsx";
import { UserStat } from "./UserStat.tsx";

const numUsers = 3;

export const Index = (props: any) => {
  const [users, setUsers] = React.useState(null as User[]);
  const [loadedUsers, setLoadedUsers] = React.useState(null as User[]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const newUsers = [];
    for (let i = 0; i < numUsers; i++) {
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

  const setUser = (ix: number, user: User) => {
    const newUsers = [...users];
    newUsers[ix] = user;
    setUsers(newUsers);
  }

  return <div className='index_'>
    {users && <div className='user_tiles_'>
      {users.map((e, ix) => <UserTile key={ix} ix={ix} user={e} setLoading={setLoading} setUser={setUser} />)}
    </div>}
    {loadedUsers && <div className='user_stats_'>
      <UserStat stats={loadedUsers.map(e => e.meanScore)} reversed={null} label='Mean Score' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.daysWatched)} reversed={false} label='Days Watched' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.episodesWatched)} reversed={false} label='Episodes Watched' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.entriesTotal)} reversed={false} label='Total Entries' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.entriesCompleted)} reversed={false} label='Completed' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.entriesWatching)} reversed={false} label='Watching' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.entriesOnHold)} reversed={true} label='On Hold' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.entriesDropped)} reversed={true} label='Dropped' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.entriesPlanToWatch)} reversed={true} label='Plan to Watch' usernames={loadedUsers.map(e => e.username)} />
      <UserStat stats={loadedUsers.map(e => e.entriesRewatched)} reversed={false} label='Rewatched' usernames={loadedUsers.map(e => e.username)} />
    </div>}
    {(!users || loading) && <LinearProgress />}
  </div>;
}