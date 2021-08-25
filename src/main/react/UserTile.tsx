import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { IconButton, Paper, TextField, Tooltip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
//
import { User } from "./definitions.ts";

declare const baseUrl: string;

export const UserTile = (props: { ix: number, user: User, setLoading: Function, setUser: Function }) => {
  const [username, setUsername] = React.useState('' as string);

  const onGetUser = () => {
    props.setLoading(true);
    axios.get(`${baseUrl}/getuser`, {
        params: {
          animeWebsite: 'MAL',
          username: username
        }
      })
      .then((response) => {
        const user = response.data as User;
        props.setUser(props.ix, user);
      })
      .catch((error) => {
        alert(error);
      }).finally(() => {
        props.setLoading(false);
      });
  }

  return <Paper className='user_tile_' elevation={3}>
    <TextField
      value={username}
      onChange={e => setUsername(e.target.value)}
      onKeyUp={e => { if (e.key == 'Enter') { onGetUser() } }}
      label='Username'
      size='small'
      margin='dense'
      InputLabelProps={{
        shrink: true
      }}
    />
    <Tooltip title='Search'><IconButton
      className='button_'
      onClick={() => onGetUser()}
      size='small'
      color='primary'
    >
      <SearchIcon />
    </IconButton></Tooltip>
  </Paper>;
}