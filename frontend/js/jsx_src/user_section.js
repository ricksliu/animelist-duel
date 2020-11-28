const stats = [
  'mean_score',
  'days_watched',
  'episodes_watched',
  'total_entries',
  'completed',
  'watching',
  'on_hold',
  'dropped',
  'plan_to_watch',
  'rewatched'
]
// Stats where lower numbers are better
const reversed_stats = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0];
// Stats where comparing doesn't apply
const neutral_stats = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0];

function updateUserStatGraphics() {
  for (var i = 0; i < stats.length; i++) {
    // If a neutral stat, makes bars gray
    if (neutral_stats[i] == 1) {
      document.getElementById(`${stats[i]}_1_bar`).style.backgroundColor = '#999';
      document.getElementById(`${stats[i]}_2_bar`).style.backgroundColor = '#999';

    // If not a neutral stat, calculates bar widths and colours
    } else {
      // Gets stats
      const stat_1 = parseFloat(document.getElementById(`${stats[i]}_1`).textContent);
      const stat_2 = parseFloat(document.getElementById(`${stats[i]}_2`).textContent);

      // Calculates percentage of user 1's bar
      var scale;
      if (stat_1 == stat_2) {
        scale = 50;
      } else {
        scale = 10 + 80 * stat_1 / (stat_1 + stat_2);

        // If a reversed stat, reverses the scale
        if (reversed_stats[i] == 1) {
          scale = 100 - scale;
        }
      }

      // Sets bar widths
      document.getElementById(`${stats[i]}_1_bar`).style.width = `${scale.toString()}%`;
      document.getElementById(`${stats[i]}_2_bar`).style.width = `${(100 - scale).toString()}%`;

      // Updates bar colours
      if (scale > 50.0) {
        document.getElementById(`${stats[i]}_1_bar`).style.backgroundColor = '#6C6';
        document.getElementById(`${stats[i]}_2_bar`).style.backgroundColor = '#C66';
      } else if (scale < 50.0) {
        document.getElementById(`${stats[i]}_1_bar`).style.backgroundColor = '#C66';
        document.getElementById(`${stats[i]}_2_bar`).style.backgroundColor = '#6C6';
      } else {
        document.getElementById(`${stats[i]}_1_bar`).style.backgroundColor = '#999';
        document.getElementById(`${stats[i]}_2_bar`).style.backgroundColor = '#999';
      }
    }
  }

  // Shows #stats
  document.getElementById('stats').style.display = 'inherit';
}

// Component for inputting username and updating user data
class UserSection extends React.Component {
  constructor(props) {
    super(props);
    this.user = props.user;

    this.state = {
      username_input: '',
      username: ''
    };
    
    this.updateUsernameInput = this.updateUsernameInput.bind(this);
    this.submitUsername = this.submitUsername.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  updateUsernameInput(event) {
    this.setState({username_input: event.target.value});
  }

  submitUsername(event) {
    this.setState({username: this.state.username_input});

    // Shows 'user_update_status' form
    document.querySelectorAll(`#user_${this.user}_section div .user_update_status`).forEach(element => element.style.display = 'inherit');

    event.preventDefault();
  }

  updateUser(event) {   
    var username = document.getElementById(`username_${this.user}`).textContent;
  
    // Sends http request to backend server
    const http_req = new XMLHttpRequest();
    http_req.open('GET', `http://localhost:3000/?username=${username.replace(' ', '+')}`);
    http_req.send();
  
    // Executes when a response (a JSON-encoded string) is recieved
    http_req.onload = () => {
      var user_data = JSON.parse(http_req.response);
      
      updateUserStatGraphics();
    }
    
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form className='username_input' onSubmit={this.submitUsername}>
          <h3>{`User ${this.user}`}</h3>
          <input type='text' id={`username_${this.user}_input`} value={this.state.username_input} onChange={this.updateUsernameInput} />
          <input type='submit' id={`username_${this.user}_submit`} value='Select' />
        </form>

        <form className='user_update_status' onSubmit={this.updateUser}>
          <p id={`username_${this.user}`}>{this.state.username}</p>
          <p id={`last_updated_${this.user}`}>[Last Updated]</p>
          <input type='submit' id={`user_${this.user}_update`} value='Update' />
        </form>
      </div>
    );
  }
}

// Adds UserSection components
for (var i = 1; i <= 2; i++) {
  ReactDOM.render(
    <UserSection user={i}/>,
    document.querySelector(`#user_${i}_section`)
  );
}
