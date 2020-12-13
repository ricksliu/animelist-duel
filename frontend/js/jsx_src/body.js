// Class that stores the name of a stat and how it should be compared
class StatInfo {
  constructor(stat, compare_type) {
    this.stat = stat;
    // 1 if bigger is better, 0 if incomparable, -1 if smaller is better
    this.compare_type = compare_type;
  }
}

// Following two arrays store the names (and additional info) of user data that the website handles
const info = [
  'username',
  'user_id',
  'last_updated',
  'user_image'
]
const stats = [
  new StatInfo('mean_score', 0),  // 0 because it doesn't make sense to compare mean score
  new StatInfo('days_watched', 1),
  new StatInfo('episodes_watched', 1),
  new StatInfo('total_entries', 1),
  new StatInfo('completed', 1),
  new StatInfo('watching', 1),
  new StatInfo('on_hold', -1),
  new StatInfo('rewatched', 1),
  new StatInfo('dropped', -1),
  new StatInfo('plan_to_watch', -1)
]

// Updates CSS of stats
function updateUserStatGraphics() {
  for (var i = 0; i < stats.length; i++) {
    // If a neutral stat, makes bars gray
    if (stats[i].compare_type == 0) {
      document.getElementById(`${stats[i].stat}_1_bar`).style.backgroundColor = '#999';
      document.getElementById(`${stats[i].stat}_2_bar`).style.backgroundColor = '#999';

    // If not a neutral stat, calculates bar widths and colours
    } else {
      // Gets stats
      const stat_1 = parseFloat(document.getElementById(`${stats[i].stat}_1`).textContent);
      const stat_2 = parseFloat(document.getElementById(`${stats[i].stat}_2`).textContent);

      // Scale is the percentage of the bar occupied by user 1
      var scale;
      if (stat_1 == stat_2) {
        scale = 50;
      } else {
        scale = 1 + 98 * stat_1 / (stat_1 + stat_2);

        // If a reversed stat (lower number is better), reverses the bar width
        if (stats[i].compare_type == -1) {
          scale = 100 - scale;
        }
      }

      // Sets bar widths
      document.getElementById(`${stats[i].stat}_1_bar`).style.width = `${scale.toString()}%`;
      document.getElementById(`${stats[i].stat}_2_bar`).style.width = `${(100 - scale).toString()}%`;

      // Updates bar colours to be green, red or gray depending on the numbers
      if (scale > 50.0) {
        document.getElementById(`${stats[i].stat}_1_bar`).style.backgroundColor = '#6C6';
        document.getElementById(`${stats[i].stat}_2_bar`).style.backgroundColor = '#C66';
      } else if (scale < 50.0) {
        document.getElementById(`${stats[i].stat}_1_bar`).style.backgroundColor = '#C66';
        document.getElementById(`${stats[i].stat}_2_bar`).style.backgroundColor = '#6C6';
      } else {
        document.getElementById(`${stats[i].stat}_1_bar`).style.backgroundColor = '#999';
        document.getElementById(`${stats[i].stat}_2_bar`).style.backgroundColor = '#999';
      }
    }
  }
}

// Given a string like 'mean_score', returns 'Mean Score'
function formatText(text) {
  text = text.replaceAll('_', ' ');

  for (var j = -1; j < text.length; j++) {
    if (j == -1 || text.charAt(j) == ' ') {
      text = text.slice(0, j + 1) + text.charAt(j + 1).toUpperCase() + text.slice(j + 2);
    }
  }

  return text;
}

// Component for inputting username and updating user data
class UserSection extends React.Component {
  constructor(props) {
    super(props);

    // username_input is necessary in order to keep the text inside the input form up to date
    // No need to be a prop passed from a parent since it's only needed by this component
    this.state = {
      username_input: ''
    };
    
    this.updateUsernameInput = this.updateUsernameInput.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }

  // Updates text in input form as user types
  updateUsernameInput(event) {
    this.setState({username_input: event.target.value});
  }

  // Sends HTTP request to backend server to get or update data for the user that this component is for
  sendRequest(request) {
    // Sends HTTP request
    const http_req = new XMLHttpRequest();
    http_req.open('GET', `http://localhost:3000/?username=${this.state.username_input.replace(' ', '+')}&request=${request}`);
    http_req.send();
  
    // Executes when a response (a JSON-encoded string) is recieved
    http_req.onload = () => {
      var user_data = JSON.parse(http_req.response);

      // If update was successful (backend sets user_id to an empty string if it was unsuccessful)
      if (user_data.user_id != '') {
        // Updates parent's state with info and stats using callback function in props
        for (var i = 0; i < info.length; i++) {
          this.props.sendInfo(info[i], this.props.user, user_data[info[i]]);
        }
        for (var i = 0; i < stats.length; i++) {
          this.props.sendStat(stats[i].stat, this.props.user, user_data[stats[i].stat]);
        }

        // Toggles error messages
        document.getElementById(`backend_error_${this.props.user}`).style.display = 'none';
        document.getElementById(`username_error_${this.props.user}`).style.display = 'none';
        // Shows user_update_status form
        document.querySelectorAll(`#user_${this.props.user}_section .user_update_status`).forEach(element => element.style.display = 'inherit');
        // Updates and shows stat graphics
        updateUserStatGraphics();
        document.getElementById('stats').style.display = 'inherit';
      
      // If update was unsuccessful
      } else {
        if (request == 'get') {
          this.sendRequest('update');
        } else {
          // Updates parent's state with blank strings and zeroes instead of actual stats
          for (var i = 0; i < info.length; i++) {
            this.props.sendInfo(info[i], this.props.user, '');
          }
          for (var i = 0; i < stats.length; i++) {
            this.props.sendStat(stats[i].stat, this.props.user, 0);  // Stat bars break if an empty string is sent instead of a number
          }

          // Toggles error messages
          document.getElementById(`backend_error_${this.props.user}`).style.display = 'none';
          document.getElementById(`username_error_${this.props.user}`).style.display = 'inherit';
          // Hides user_update_status form
          document.querySelectorAll(`#user_${this.props.user}_section .user_update_status`).forEach(element => element.style.display = 'none');
          // Updates stat graphics (no need to hide it; the other user may have stats to show)
          updateUserStatGraphics();
        }
      }
    }

    // Executes when backend is offline
    http_req.onerror = () => {
      // Updates parent's state with blank strings and zeroes instead of actual stats
      for (var i = 0; i < info.length; i++) {
        this.props.sendInfo(info[i], this.props.user, '');
      }
      for (var i = 0; i < stats.length; i++) {
        this.props.sendStat(stats[i].stat, this.props.user, 0);  // Stat bars break if an empty string is sent instead of a number
      }

      // Toggles error messages
      document.getElementById(`backend_error_${this.props.user}`).style.display = 'inherit';
      document.getElementById(`username_error_${this.props.user}`).style.display = 'none';
      // Hides user_update_status form
      document.querySelectorAll(`#user_${this.props.user}_section .user_update_status`).forEach(element => element.style.display = 'none');
      // Updates stat graphics (no need to hide it; the other user may have stats to show)
      updateUserStatGraphics();
    }
  }

  // The following functions are used as shortcuts for the function above
  getUser(event) {
    this.sendRequest('get');
    event.preventDefault();
  }
  updateUser(event) {
    this.sendRequest('update');
    event.preventDefault();
  }

  // Composed of three parts
  // form.username_input is for inputting and selecting a user to display
  // p.backend_error and p.username_error appear for self-explanatory reasons
  // form.user_update_status displays how up to date the current stats are, and a button to update them
  render() {
    return (
      <div id={`user_${this.props.user}_section`}>
        <form className='username_input' onSubmit={this.getUser}>
          <h3>{`User ${this.props.user}`}</h3>
          <input type='text' id={`username_${this.props.user}_input`} value={this.state.username_input} onChange={this.updateUsernameInput} />
          <input type='submit' id={`username_${this.props.user}_submit`} value='Select' />
        </form>
        <p className='backend_error' id={`backend_error_${this.props.user}`}>This Website Is Offline Right Now</p>
        <p className='username_error' id={`username_error_${this.props.user}`}>User Not Found</p>
        <form className='user_update_status' onSubmit={this.updateUser}>
          <h3 id={`username_${this.props.user}`}>{this.props.username}</h3>
          <img id={`user_image_${this.props.user}`} src={this.props.user_image} alt='' />
          <p id={`last_updated_${this.props.user}`}>Data From {this.props.last_updated}</p>
          <input type='submit' id={`user_${this.props.user}_update`} value='Update Data' />
        </form>
      </div>
    );
  }
}

// Component that displaying a stat (two numbers and a bar for each number)
class Stat extends React.Component {
  render() {
    return (
      <div className='stat' id={this.props.stat}>
        <h3>{`${formatText(this.props.stat)}:`}</h3>
        <div>
          <div className='stat_1_bar' id={`${this.props.stat}_1_bar`}></div>
          <p className='stat_1' id={`${this.props.stat}_1`}>{this.props.stat_values[0]}</p>
          <div className='stat_2_bar' id={`${this.props.stat}_2_bar`}></div>
          <p className='stat_2' id={`${this.props.stat}_2`}>{this.props.stat_values[1]}</p>
        </div>
      </div>
    );
  }
}

// Component for body of page; uses the two components above
class Body extends React.Component {
  constructor(props) {
    super(props);

    // State has a length 2 array corresponding to each item in the 'info' and 'stats' arrays
    // These arrays are used to store data for each user
    this.state = {};  
    for (var i = 0; i < info.length; i++) {
      this.state[info[i]] = ['', ''];
    }
    for (var i = 0; i < stats.length; i++) {
      this.state[stats[i].stat] = [0, 0];
    }
  }

  // Following two functions are used as callback function by UserSection components to update this component's state
  // Takes info/stat in question, which user to update, and the data itself
  getInfo(info, user, info_value) {
    if (user == 1) {
      this.setState({[info]: [info_value, this.state[info][1]]});
    } else {
      this.setState({[info]: [this.state[info][0], info_value]});
    }
  }
  getStat(stat, user, stat_value) {
    if (user == 1) {
      this.setState({[stat]: [stat_value, this.state[stat][1]]});
    } else {
      this.setState({[stat]: [this.state[stat][0], stat_value]});
    }
  }

  // Info for user passed down as props to UserSection components; getInfo() and getStat() passed to be used as callback functions
  // The map function inside div#stats creates a Stat component for each item in the array 'stats'
  // Corresponding stat passed down as prop to each Stat component
  render() {
    return (
      <div>
        <UserSection user={1} username={this.state.username[0]} user_id={this.state.user_id[0]} last_updated={this.state.last_updated[0]} user_image={this.state.user_image[0]} sendInfo={this.getInfo.bind(this)} sendStat={this.getStat.bind(this)} />
        <UserSection user={2} username={this.state.username[1]} user_id={this.state.user_id[1]} last_updated={this.state.last_updated[1]} user_image={this.state.user_image[1]} sendInfo={this.getInfo.bind(this)} sendStat={this.getStat.bind(this)} />
        <div id='stats'>
          {stats.map(stat => (
            <Stat key={stat.stat} stat={stat.stat} stat_values={this.state[stat.stat]} />
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Body />,
  document.querySelector('#body')
);