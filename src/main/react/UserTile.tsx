import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { IconButton, Paper, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
//
import { User } from "./definitions.ts";

declare const baseUrl: string;

export const UserTile = (props: { ix: number, user: User, setUser: Function }) => {
  const [username, setUsername] = React.useState('' as string);

  const onGetUser = () => {
    axios.get(`${baseUrl}/getuser`, {
        params: {
          animeWebsite: 'MAL',
          username: username
        }
      })
      .then(function (response) {
        const user = response.data as User;
        props.setUser(props.ix, user);
      })
      .catch(function (error) {
        alert(error);
      });
  }

  return <Paper className='user_tile_' elevation={3} >
    <TextField
      value={username}
      onChange={e => setUsername(e.target.value)}
      label='Username'
      size='small'
      margin='dense'
      InputLabelProps={{
        shrink: true
      }}
    />
    <IconButton
      className='button_'
      onClick={() => onGetUser()}
      size='small'
      color='primary'
    >
      <SearchIcon />
    </IconButton>
  </Paper>;
}