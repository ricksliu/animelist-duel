class StatInfo {
  constructor(stat, compare_type, fact_not_tied, fact_tied, fact_one_zero, fact_both_zero) {
    this.stat = stat;
    this.compare_type = compare_type;  // How the bars are calculated; 1 = bigger is better, 0 = do not compare, -1 = smaller is better

    // Strings that will be displayed under stat bars under certain conditions
    this.fact_not_tied = fact_not_tied;
    this.fact_tied = fact_tied;
    this.fact_one_zero = fact_one_zero;
    this.fact_both_zero = fact_both_zero;
  }

  // Returns applicable fun fact about a stat
  getFact(user_1, stat_1, user_2, stat_2) {
    const diff = Math.abs(stat_1 - stat_2).toFixed(2);
    const diff_int = Math.abs(stat_1 - stat_2).toFixed(0);

    // Only 1 user is selected
    if (user_1 == '' || user_2 == '') {
      return '';
    }

    if (this.fact_one_zero != '') {
      // Both stats are zero
      if (stat_1 == 0 && stat_2 == 0) {
        return this.fact_both_zero.replaceAll('user_1', user_1).replaceAll('user_2', user_2);
      }

      // One stat is zero
      if (stat_1 == 0) {
        return this.fact_one_zero.replaceAll('user_2', user_1).replaceAll('user_1', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff);
      }
      if (stat_2 == 0) {
        return this.fact_one_zero.replaceAll('user_1', user_1).replaceAll('user_2', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff);
      }
    }

    // Both stats are tied
    if (stat_1 == stat_2) {
      return this.fact_tied.replaceAll('user_1', user_1).replaceAll('user_2', user_2);
    // Stats are not tied
    } else if (parseFloat(stat_1) < parseFloat(stat_2)) {
      const prod = (stat_2 / stat_1).toFixed(2);
      return this.fact_not_tied.replaceAll('user_2', user_1).replaceAll('user_1', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff).replaceAll('stat_prod', prod);
    } else {
      const prod = (stat_1 / stat_2).toFixed(2);
      return this.fact_not_tied.replaceAll('user_1', user_1).replaceAll('user_2', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff).replaceAll('stat_prod', prod);
    }
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
  new StatInfo('mean_score', 0,
    "user_1's mean score is stat_diff higher than user_2's. Does user_2 watch worse shows or is user_1 just overly generous?",
    "user_1 and user_2 have the same mean score. Spooky.",
    "",
    ""
  ),
  new StatInfo('days_watched', 1,
    "user_1 has watched stat_prod times as much anime as user_2. user_1 desperately needs to get a life.",
    "user_1 and user_2 have watched the same amount of anime. It's anyone's game.",
    "user_2 has never watched anime at all. user_1 wins, but user_2 is probably the true winner here.",
    "Both user_1 and user_2 have never watched anime. Let's hope it stays that way."
  ),
  new StatInfo('episodes_watched', 1,
    "user_1 has watched stat_prod times as many episodes as user_2. Time for a stat_diff_int episode binge, user_2?",
    "user_1 and user_2 have watched the same number of episodes. Not all episodes are created equal though.",
    "user_2 has never watched an episode of anime. Good or bad? Probably good.",
    "Both user_1 and user_2 have never watched an episode of anime. Good on them."
  ),
  new StatInfo('total_entries', 1,
    "user_1 has stat_prod times as many total entries as user_2. Total entries is a meaningless stat anyways.",
    "user_1 and user_2 have the same number of total entries. Total entries is a meaningless stat anyways.",
    "",
    ""
  ),
  new StatInfo('completed', 1,
    "user_1 has completed stat_prod times as many entries as user_2. Time for user_2 to watch stat_diff_int 1-minute shorts?",
    "user_1 and user_2 have completed the same number of entries. Commence the argument on how some entries are way larger than others.",
    "",
    ""
  ),
  new StatInfo('watching', 1,
    "user_1 is watching stat_prod times as many entries as user_2. How does user_1 do it?",
    "user_1 and user_2 are watching the same number of entries. We'll see how the situation develops next season.",
    "user_2 is not watching any anime right now. They'll be back. They always come back.",
    "Both user_1 and user_2 are not watching any anime right now. They'll be back. They always come back."
  ),
  new StatInfo('on_hold', -1,
    "user_1 has stat_prod times as many entries on hold as user_2. user_1 bit off more than they could chew.",
    "user_1 and user_2 have the same number of entries on hold. They both have some work to do.",
    "user_2 has no entries on hold. user_1 has some work to do.",
    "Both user_1 and user_2 have no entries on hold. At least they commit all the way."
  ),
  new StatInfo('rewatched', 1,
    "user_1 has rewatched stat_prod times as many entries as user_2. user_1, don't you have anything better to do?",
    "user_1 and user_2 have rewatched the same number of entries. They both need something better to do.",
    "user_2 has never rewatched anything. To user_2, watching something twice is apparently too far.",
    "Both user_1 and user_2 have never rewatched anything. Watching something twice is apparently too far."
  ),
  new StatInfo('dropped', -1,
    "user_1 has dropped stat_prod times as many entries as user_2. user_1 really can't make up their mind.",
    "user_1 and user_2 have dropped the same number of entries. They really can't make up their mind.",
    "user_2 has never dropped anything. Dedication or masochism?",
    "Both user_1 and user_2 have never dropped anything. Dedication or masochism?"
  ),
  new StatInfo('plan_to_watch', -1,
    "user_1 plans to watch stat_prod times as many entries as user_2. user_1 needs to get grinding.",
    "user_1 and user_2 plan to watch the same number of entries. Get grinding.",
    "user_2 doesn't plan to watch anything. user_2 has defeated anime (for now).",
    "Both user_1 and user_2 don't plan to watch anything. They've defeated anime (for now)."
  ),
]

// Updates CSS of stats
function updateStatCSS() {
  // Updates each stat bar
  for (let i = 0; i < stats.length; i++) {
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
      let scale;
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

  // Shows/hides elements that only appear if 2 users have been inputted
  if (document.getElementById('username_1').textContent != '' && document.getElementById('username_2').textContent != '') {
    document.getElementById('vs').style.display = 'inherit';
    [].forEach.call(document.getElementsByClassName('stat_fact'), element => element.style.visibility = 'inherit');
    document.getElementById('score_differences').style.display = 'inherit';

  } else {
    document.getElementById('vs').style.display = 'none';
    [].forEach.call(document.getElementsByClassName('stat_fact'), element => element.style.visibility = 'hidden');
    document.getElementById('score_differences').style.display = 'none';
  }
}

// Given a string like 'mean_score', returns 'Mean Score'
function capitalize(text) {
  return text.replaceAll('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Component for inputting username and updating user data
class UserSection extends React.Component {
  constructor(props) {
    super(props);

    // username_input is necessary in order to keep the text inside the input form up to date
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
      let user_data = JSON.parse(http_req.response);

      // If update was successful (backend sets user_id to an empty string if it was unsuccessful)
      if (user_data.user_id != '') {
        // Updates parent's state with info and stats using callback function in props
        for (let i = 0; i < info.length; i++) {
          this.props.sendInfo(this.props.user, info[i], user_data[info[i]]);
        }
        for (let i = 0; i < stats.length; i++) {
          this.props.sendStat(this.props.user, i, user_data[stats[i].stat]);
        }
        this.props.updateStatFacts();

        // Toggles error messages
        document.getElementById(`backend_error_${this.props.user}`).style.display = 'none';
        document.getElementById(`username_error_${this.props.user}`).style.display = 'none';
        // Shows user_update_status form
        document.querySelectorAll(`#user_${this.props.user}_section .user_update_status`).forEach(element => element.style.display = 'inherit');
        // Updates and shows stat graphics
        updateStatCSS();
        document.getElementById('stats').style.display = 'inherit';
      
      // If update was unsuccessful
      } else {
        if (request == 'get') {
          this.sendRequest('update');
        } else {
          // Updates parent's state with blank strings and zeroes instead of actual stats
          for (let i = 0; i < info.length; i++) {
            this.props.sendInfo(this.props.user, info[i], '');
          }
          for (let i = 0; i < stats.length; i++) {
            this.props.sendStat(this.props.user, i, 0);
          }
          this.props.updateStatFacts();

          // Toggles error messages
          document.getElementById(`backend_error_${this.props.user}`).style.display = 'none';
          document.getElementById(`username_error_${this.props.user}`).style.display = 'inherit';
          // Hides user_update_status form
          document.querySelectorAll(`#user_${this.props.user}_section .user_update_status`).forEach(element => element.style.display = 'none');
          // Updates stat graphics (no need to hide it; the other user may have stats to show)
          updateStatCSS();
        }
      }
    }

    // Executes when backend is offline
    http_req.onerror = () => {
      // Updates parent's state with blank strings and zeroes instead of actual stats
      for (let i = 0; i < info.length; i++) {
        this.props.sendInfo(this.props.user, info[i], '');
      }
      for (let i = 0; i < stats.length; i++) {
        this.props.sendStat(this.props.user, i, 0);
      }
      this.props.updateStatFacts();

      // Toggles error messages
      document.getElementById(`backend_error_${this.props.user}`).style.display = 'inherit';
      document.getElementById(`username_error_${this.props.user}`).style.display = 'none';
      // Hides user_update_status form
      document.querySelectorAll(`#user_${this.props.user}_section .user_update_status`).forEach(element => element.style.display = 'none');
      // Updates stat graphics (no need to hide it; the other user may have stats to show)
      updateStatCSS();
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

  // 'form.username_input' is for inputting and selecting a user to display
  // 'p.backend_error' and 'p.username_error' are usually not displayed
  // 'form.user_update_status' displays how up to date the current stats are and a button to update them
  render() {
    return (
      <div className='user_section' id={`user_${this.props.user}_section`}>
        <form className='username_input' onSubmit={this.getUser}>
          <h3>{`User ${this.props.user}:`}</h3>
          <div>
            <input type='text' className='input_text' id={`username_${this.props.user}_input`} value={this.state.username_input} onChange={this.updateUsernameInput} />
            <input type='submit' className='input_submit' id={`username_${this.props.user}_submit`} value='Select' />
          </div>
        </form>
        <p className='backend_error' id={`backend_error_${this.props.user}`}>This Website Is Offline Right Now</p>
        <p className='username_error' id={`username_error_${this.props.user}`}>User Not Found</p>
        <form className='user_update_status' onSubmit={this.updateUser}>
          <h3 id={`username_${this.props.user}`}>{this.props.username}</h3>
          <img id={`user_image_${this.props.user}`} src={this.props.user_image} alt='' />
          <p id={`last_updated_${this.props.user}`}>Data From {this.props.last_updated}</p>
          <input type='submit' className='input_submit' id={`user_${this.props.user}_update`} value='Update Data' />
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
        <h3>{`${capitalize(this.props.stat)}:`}</h3>
        <div>
          <div className='stat_bar stat_1_bar' id={`${this.props.stat}_1_bar`}></div>
          <p className='stat_value stat_1_value' id={`${this.props.stat}_1`}>{this.props.stat_values[0]}</p>
          <div className='stat_bar stat_2_bar' id={`${this.props.stat}_2_bar`}></div>
          <p className='stat_value stat_2_value' id={`${this.props.stat}_2`}>{this.props.stat_values[1]}</p>
        </div>
        <p className='stat_fact' id={`${this.props.stat}_fact`}>{this.props.stat_fact}</p>
      </div>
    );
  }
}

// Component for body of page; uses the components above
class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};  
    for (let i = 0; i < info.length; i++) {
      this.state[info[i]] = ['', ''];
    }
    this.state.stats = [];
    for (let i = 0; i < stats.length; i++) {
      this.state.stats.push([0, 0]);
    }
    this.state.stat_facts = [];
    for (let i = 0; i < stats.length; i++) {
      this.state.stat_facts.push('');
    }
  }

  // Following functions are used as callback functions by UserSection components to update this component's state
  
  setInfo(user, i, info_value) {
    if (user == 1) {
      this.setState({[i]: [info_value, this.state[i][1]]});
    } else {
      this.setState({[i]: [this.state[i][0], info_value]});
    }
  }
  setStat(user, i, stat_value) {
    let new_stats = this.state.stats;
    if (user == 1) {
      new_stats[i] = [stat_value, this.state.stats[i][1]];
    } else {
      new_stats[i] = [this.state.stats[i][0], stat_value];
    }
    this.setState({stats: new_stats});
  }
  updateStatFacts() {
    let new_stat_facts = this.state.stat_facts;
    for (let i = 0; i < stats.length; i++) {
      new_stat_facts[i] = stats[i].getFact(this.state.username[0], this.state.stats[i][0], this.state.username[1], this.state.stats[i][1]);
    }
    this.setState({stat_facts: new_stat_facts});
  }

  // Info for user passed down as props to UserSection components; getInfo(), getStat(), updateStatFacts() passed to be used as callback functions
  // Map function inside div#stats creates a Stat component for each item in the array 'stats'
  // Corresponding stat passed down as prop to each Stat component
  render() {
    return (
      <div>
        <h3 id='vs'>VS</h3>
        <UserSection user={1} username={this.state.username[0]} user_id={this.state.user_id[0]} last_updated={this.state.last_updated[0]} user_image={this.state.user_image[0]} sendInfo={this.setInfo.bind(this)} sendStat={this.setStat.bind(this)} updateStatFacts={this.updateStatFacts.bind(this)} />
        <UserSection user={2} username={this.state.username[1]} user_id={this.state.user_id[1]} last_updated={this.state.last_updated[1]} user_image={this.state.user_image[1]} sendInfo={this.setInfo.bind(this)} sendStat={this.setStat.bind(this)} updateStatFacts={this.updateStatFacts.bind(this)} />
        
        <div id='stats'>
          <h2>Stat Face-Off</h2>
          <p className='main_p'>"Starting Life From 0.00"</p>
          {[...Array(stats.length).keys()].map(i => (
            <Stat key={stats[i].stat} stat={stats[i].stat} stat_values={this.state.stats[i]} stat_fact={this.state.stat_facts[i]} />
          ))}
        
        </div>
        <div id='score_differences'>
          <h2>Opinion Clash</h2>
          <p className='main_p'>"Your Opinion Is Wrong As I Expected"</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Body />,
  document.querySelector('#body')
);