// Class that stores the name of a stat and how it should be compared
class StatInfo {
  constructor(stat, compare_type) {
    this.stat = stat;
    // 1 if bigger is better, 0 if incomparable, -1 if smaller is better
    this.compare_type = compare_type;
  }
}

const stats = [
  new StatInfo('mean_score', 0),
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

      // Calculates percentage of user 1's bar
      var scale;
      if (stat_1 == stat_2) {
        scale = 50;
      } else {
        scale = 10 + 80 * stat_1 / (stat_1 + stat_2);

        // If a reversed stat, reverses the scale
        if (stats[i].compare_type == -1) {
          scale = 100 - scale;
        }
      }

      // Sets bar widths
      document.getElementById(`${stats[i].stat}_1_bar`).style.width = `${scale.toString()}%`;
      document.getElementById(`${stats[i].stat}_2_bar`).style.width = `${(100 - scale).toString()}%`;

      // Updates bar colours
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

  // Shows 'stats'
  document.getElementById('stats').style.display = 'inherit';
}

// Given 'mean_score', returns 'Mean Score'
function processText(text) {
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

    this.state = {
      username_input: '',
      username: ''
    };
    
    this.updateUsernameInput = this.updateUsernameInput.bind(this);
    this.submitUsername = this.submitUsername.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  // Updates text in input box
  updateUsernameInput(event) {
    this.setState({username_input: event.target.value});
  }

  // Updates selected user
  submitUsername(event) {
    this.setState({username: this.state.username_input});

    // Shows 'user_update_status' form
    document.querySelectorAll(`#user_${this.props.user}_section .user_update_status`).forEach(element => element.style.display = 'inherit');

    event.preventDefault();
  }

  // Updates user's data
  updateUser(event) {   
    var username = document.getElementById(`username_${this.props.user}`).textContent;
  
    // Sends http request to backend server
    const http_req = new XMLHttpRequest();
    http_req.open('GET', `http://localhost:3000/?username=${username.replace(' ', '+')}`);
    http_req.send();
  
    // Executes when a response (a JSON-encoded string) is recieved
    http_req.onload = () => {
      var user_data = JSON.parse(http_req.response);
      
      for (var i = 0; i < stats.length; i++) {
        this.props.sendStat(stats[i].stat, this.props.user, user_data[stats[i].stat]);
      }

      updateUserStatGraphics();
    }
    
    event.preventDefault();
  }

  render() {
    return (
      <div id={`user_${this.props.user}_section`}>
        <form className='username_input' onSubmit={this.submitUsername}>
          <h3>{`User ${this.props.user}`}</h3>
          <input type='text' id={`username_${this.props.user}_input`} value={this.state.username_input} onChange={this.updateUsernameInput} />
          <input type='submit' id={`username_${this.props.user}_submit`} value='Select' />
        </form>

        <form className='user_update_status' onSubmit={this.updateUser}>
          <p id={`username_${this.props.user}`}>{this.state.username}</p>
          <p id={`last_updated_${this.props.user}`}>[Last Updated]</p>
          <input type='submit' id={`user_${this.props.user}_update`} value='Update' />
        </form>
      </div>
    );
  }
}

// Component for displaying a stat
class Stat extends React.Component {
  render() {
    return (
      <div className='stat' id={this.props.stat}>
        <h3>{`${processText(this.props.stat)}:`}</h3>
        <div className='stat_1' id={`${this.props.stat}_1_bar`}><p id={`${this.props.stat}_1`}>{this.props.stat_values[0]}</p></div>
        <div className='stat_2' id={`${this.props.stat}_2_bar`}><p id={`${this.props.stat}_2`}>{this.props.stat_values[1]}</p></div>
      </div>
    );
  }
}

// Component for body of page
class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    for (var i = 0; i < stats.length; i++) {
      this.state[stats[i].stat] = [0, 0];
    }
  }

  // Gets stat (from UserSection component)
  getStat(stat, user, stat_value) {
    if (user == 1) {
      this.setState({[stat]: [stat_value, this.state[stat][1]]});
    } else {
      this.setState({[stat]: [this.state[stat][0], stat_value]});
    }

    console.log(this.state);
  }

  render() {
    return (
      <div>
        <UserSection user={1} sendStat={this.getStat.bind(this)} />
        <UserSection user={2} sendStat={this.getStat.bind(this)} />
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