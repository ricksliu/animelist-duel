import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { LinearProgress } from '@material-ui/core';
//
import { User } from "./definitions.ts";
import { UserTile } from "./UserTile.tsx";

const numUsers = 3;

export const Index = (props: any) => {
  const [users, setUsers] = React.useState(null as User[]);

  React.useEffect(() => {
    const newUsers = [];
    for (let i = 0; i < numUsers; i++) {
      newUsers.push(null);
    }
    setUsers(newUsers);
  }, []);

  const setUser = (ix: number, user: User) => {
    const newUsers = users;
    newUsers[ix] = user;
    setUsers(newUsers);
  }

  if (!users) {
    return <LinearProgress />;
  }

  return <div className='index_'>
    {users.map((e, ix) => <UserTile key={ix} ix={ix} user={e} setUser={setUser} />)}
  </div>;
}