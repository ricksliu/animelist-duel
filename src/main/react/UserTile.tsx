import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { IconButton, Paper, TextField, Tooltip, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
//
import { ThemeStyle, User } from "./definitions.ts";

declare const baseUrl: string;

export const UserTile = (props: { ix: number, user: User, setLoading: Function, setUser: Function, deleteUser: Function, theme: Function }) => {
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
        alert('Could not find user.');
      }).finally(() => {
        props.setLoading(false);
      });
  }

  return <Paper className='user_tile_' elevation={3}>
    <TextField
      className='text_field_'
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

    <Tooltip title='Delete'><IconButton
      className='button_'
      onClick={() => props.deleteUser(props.ix)}
      size='small'
      color='secondary'
    >
      <DeleteIcon />
    </IconButton></Tooltip>

    <br />
    {props.user ? <img className='profile_photo_' src={props.user.profilePhoto} /> : <div className='profile_photo_' />}
    <Typography className='last_updated_' variant='caption' display='block' style={{ ...props.theme() }}>
      {props.user ? `Last Updated: ${props.user.lastUpdated.toString().split('T')[0]}` : ''}
    </Typography>
  </Paper>;
}