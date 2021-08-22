import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//
import { Button } from '@material-ui/core';
//
import { User } from "./definitions.ts";

declare const baseUrl: string;

const Index = (props: any) => {
  const [users, setUsers] = React.useState(
    null as User[]
  );

  const onGetUser = () => {
    axios.get(`${baseUrl}/getuser`, {
        params: {
          animeWebsite: 'MAL',
          username: 'derpmachine'
        }
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return <>
    <Button onClick={() => onGetUser()} variant="contained" color="primary">
      GetUser
    </Button>
  </>;
}

ReactDOM.render(
    <Index />,
    document.getElementById('react-root')
);