import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Typography } from '@material-ui/core';

class Button extends React.Component {
  render() {
    return <Typography>aaa</Typography>;
  }
}

ReactDOM.render(
    <Button />,
    document.getElementById('react-root')
);