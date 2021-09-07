import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { IconButton, Paper, TextField, Tooltip, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
//
import { ThemeStyle, User } from "./definitions.ts";

export const UserTile = (props: { ix: number, user: User, getUser: Function, deleteUser: Function, theme: Function }) => {
  const [username, setUsername] = React.useState('' as string);

  return <Paper className='user_tile_' elevation={3}>
    <TextField
      className='text_field_'
      value={username}
      onChange={e => setUsername(e.target.value)}
      onKeyUp={e => { if (e.key == 'Enter') { props.getUser(props.ix, username) } }}
      label='Username'
      size='small'
      margin='dense'
      InputLabelProps={{
        shrink: true
      }}
    />

    <Tooltip title='Search'><IconButton
      className='button_'
      onClick={() => props.getUser(props.ix, username, false)}
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
    <br />
    <Typography className='last_updated_' variant='caption' style={{ ...props.theme() }}>
      {props.user ? `Updated: ${props.user.lastUpdated.toString().split('.')[0].replace('T', ' ')}` : ''}
    </Typography>
    {props.user && <Tooltip title='Update'><IconButton
      onClick={() => props.getUser(props.ix, username, true)}
      size='small'
    >
      <RefreshIcon />
    </IconButton></Tooltip>}
  </Paper>;
}