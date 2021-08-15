import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';

declare const baseUrl: string;

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  onGetUser() {
    axios.get(`${baseUrl}/getuser`, {
        params: {
          username: 'derpmachine'
        }
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        alert(error);
      });
  }

  render() {
    return <>
      <Button onClick={() => this.onGetUser()} variant="contained" color="primary">
        GetUser
      </Button>
    </>;
  }
}

ReactDOM.render(
    <Index />,
    document.getElementById('react-root')
);