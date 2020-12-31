var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class that stores the name of a stat and how it should be compared
var StatInfo = function StatInfo(stat, compare_type) {
  _classCallCheck(this, StatInfo);

  this.stat = stat;
  this.compare_type = compare_type; // 1 if bigger is better, 0 if incomparable, -1 if smaller is better
};

// Following two arrays store the names (and additional info) of user data that the website handles


var info = ['username', 'user_id', 'last_updated', 'user_image'];
var stats = [new StatInfo('mean_score', 0), // 0 because it doesn't make sense to compare mean score
new StatInfo('days_watched', 1), new StatInfo('episodes_watched', 1), new StatInfo('total_entries', 1), new StatInfo('completed', 1), new StatInfo('watching', 1), new StatInfo('on_hold', -1), new StatInfo('rewatched', 1), new StatInfo('dropped', -1), new StatInfo('plan_to_watch', -1)];

// Updates CSS of stats
function updateUserStatGraphics() {
  for (var i = 0; i < stats.length; i++) {
    // If a neutral stat, makes bars gray
    if (stats[i].compare_type == 0) {
      document.getElementById(stats[i].stat + '_1_bar').style.backgroundColor = '#999';
      document.getElementById(stats[i].stat + '_2_bar').style.backgroundColor = '#999';

      // If not a neutral stat, calculates bar widths and colours
    } else {
      // Gets stats
      var stat_1 = parseFloat(document.getElementById(stats[i].stat + '_1').textContent);
      var stat_2 = parseFloat(document.getElementById(stats[i].stat + '_2').textContent);

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
      document.getElementById(stats[i].stat + '_1_bar').style.width = scale.toString() + '%';
      document.getElementById(stats[i].stat + '_2_bar').style.width = (100 - scale).toString() + '%';

      // Updates bar colours to be green, red or gray depending on the numbers
      if (scale > 50.0) {
        document.getElementById(stats[i].stat + '_1_bar').style.backgroundColor = '#6C6';
        document.getElementById(stats[i].stat + '_2_bar').style.backgroundColor = '#C66';
      } else if (scale < 50.0) {
        document.getElementById(stats[i].stat + '_1_bar').style.backgroundColor = '#C66';
        document.getElementById(stats[i].stat + '_2_bar').style.backgroundColor = '#6C6';
      } else {
        document.getElementById(stats[i].stat + '_1_bar').style.backgroundColor = '#999';
        document.getElementById(stats[i].stat + '_2_bar').style.backgroundColor = '#999';
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

var UserSection = function (_React$Component) {
  _inherits(UserSection, _React$Component);

  function UserSection(props) {
    _classCallCheck(this, UserSection);

    // username_input is necessary in order to keep the text inside the input form up to date
    // No need to be a prop passed from a parent since it's only needed by this component
    var _this = _possibleConstructorReturn(this, (UserSection.__proto__ || Object.getPrototypeOf(UserSection)).call(this, props));

    _this.state = {
      username_input: ''
    };

    _this.updateUsernameInput = _this.updateUsernameInput.bind(_this);
    _this.getUser = _this.getUser.bind(_this);
    _this.updateUser = _this.updateUser.bind(_this);
    _this.sendRequest = _this.sendRequest.bind(_this);
    return _this;
  }

  // Updates text in input form as user types


  _createClass(UserSection, [{
    key: 'updateUsernameInput',
    value: function updateUsernameInput(event) {
      this.setState({ username_input: event.target.value });
    }

    // Sends HTTP request to backend server to get or update data for the user that this component is for

  }, {
    key: 'sendRequest',
    value: function sendRequest(request) {
      var _this2 = this;

      // Sends HTTP request
      var http_req = new XMLHttpRequest();
      http_req.open('GET', 'http://localhost:3000/?username=' + this.state.username_input.replace(' ', '+') + '&request=' + request);
      http_req.send();

      // Executes when a response (a JSON-encoded string) is recieved
      http_req.onload = function () {
        var user_data = JSON.parse(http_req.response);

        // If update was successful (backend sets user_id to an empty string if it was unsuccessful)
        if (user_data.user_id != '') {
          // Updates parent's state with info and stats using callback function in props
          for (var i = 0; i < info.length; i++) {
            _this2.props.sendInfo(info[i], _this2.props.user, user_data[info[i]]);
          }
          for (var i = 0; i < stats.length; i++) {
            _this2.props.sendStat(stats[i].stat, _this2.props.user, user_data[stats[i].stat]);
          }

          // Toggles error messages
          document.getElementById('backend_error_' + _this2.props.user).style.display = 'none';
          document.getElementById('username_error_' + _this2.props.user).style.display = 'none';
          // Shows user_update_status form
          document.querySelectorAll('#user_' + _this2.props.user + '_section .user_update_status').forEach(function (element) {
            return element.style.display = 'inherit';
          });
          // Updates and shows stat graphics
          updateUserStatGraphics();
          document.getElementById('stats').style.display = 'inherit';

          // If update was unsuccessful
        } else {
          if (request == 'get') {
            _this2.sendRequest('update');
          } else {
            // Updates parent's state with blank strings and zeroes instead of actual stats
            for (var i = 0; i < info.length; i++) {
              _this2.props.sendInfo(info[i], _this2.props.user, '');
            }
            for (var i = 0; i < stats.length; i++) {
              _this2.props.sendStat(stats[i].stat, _this2.props.user, 0); // Stat bars break if an empty string is sent instead of a number
            }

            // Toggles error messages
            document.getElementById('backend_error_' + _this2.props.user).style.display = 'none';
            document.getElementById('username_error_' + _this2.props.user).style.display = 'inherit';
            // Hides user_update_status form
            document.querySelectorAll('#user_' + _this2.props.user + '_section .user_update_status').forEach(function (element) {
              return element.style.display = 'none';
            });
            // Updates stat graphics (no need to hide it; the other user may have stats to show)
            updateUserStatGraphics();
          }
        }
      };

      // Executes when backend is offline
      http_req.onerror = function () {
        // Updates parent's state with blank strings and zeroes instead of actual stats
        for (var i = 0; i < info.length; i++) {
          _this2.props.sendInfo(info[i], _this2.props.user, '');
        }
        for (var i = 0; i < stats.length; i++) {
          _this2.props.sendStat(stats[i].stat, _this2.props.user, 0); // Stat bars break if an empty string is sent instead of a number
        }

        // Toggles error messages
        document.getElementById('backend_error_' + _this2.props.user).style.display = 'inherit';
        document.getElementById('username_error_' + _this2.props.user).style.display = 'none';
        // Hides user_update_status form
        document.querySelectorAll('#user_' + _this2.props.user + '_section .user_update_status').forEach(function (element) {
          return element.style.display = 'none';
        });
        // Updates stat graphics (no need to hide it; the other user may have stats to show)
        updateUserStatGraphics();
      };
    }

    // The following functions are used as shortcuts for the function above

  }, {
    key: 'getUser',
    value: function getUser(event) {
      this.sendRequest('get');
      event.preventDefault();
    }
  }, {
    key: 'updateUser',
    value: function updateUser(event) {
      this.sendRequest('update');
      event.preventDefault();
    }

    // Composed of three parts
    // form.username_input is for inputting and selecting a user to display
    // p.backend_error and p.username_error appear for self-explanatory reasons
    // form.user_update_status displays how up to date the current stats are, and a button to update them

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'user_section', id: 'user_' + this.props.user + '_section' },
        React.createElement(
          'form',
          { className: 'username_input', onSubmit: this.getUser },
          React.createElement(
            'h3',
            null,
            'User ' + this.props.user + ':'
          ),
          React.createElement(
            'div',
            null,
            React.createElement('input', { type: 'text', id: 'username_' + this.props.user + '_input', value: this.state.username_input, onChange: this.updateUsernameInput }),
            React.createElement('input', { type: 'submit', id: 'username_' + this.props.user + '_submit', value: 'Select' })
          )
        ),
        React.createElement(
          'p',
          { className: 'backend_error', id: 'backend_error_' + this.props.user },
          'This Website Is Offline Right Now'
        ),
        React.createElement(
          'p',
          { className: 'username_error', id: 'username_error_' + this.props.user },
          'User Not Found'
        ),
        React.createElement(
          'form',
          { className: 'user_update_status', onSubmit: this.updateUser },
          React.createElement(
            'h3',
            { id: 'username_' + this.props.user },
            this.props.username
          ),
          React.createElement('img', { id: 'user_image_' + this.props.user, src: this.props.user_image, alt: '' }),
          React.createElement(
            'p',
            { id: 'last_updated_' + this.props.user },
            'Data From ',
            this.props.last_updated
          ),
          React.createElement('input', { type: 'submit', id: 'user_' + this.props.user + '_update', value: 'Update Data' })
        )
      );
    }
  }]);

  return UserSection;
}(React.Component);

// Component that displaying a stat (two numbers and a bar for each number)


var Stat = function (_React$Component2) {
  _inherits(Stat, _React$Component2);

  function Stat() {
    _classCallCheck(this, Stat);

    return _possibleConstructorReturn(this, (Stat.__proto__ || Object.getPrototypeOf(Stat)).apply(this, arguments));
  }

  _createClass(Stat, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'stat', id: this.props.stat },
        React.createElement(
          'h3',
          null,
          formatText(this.props.stat) + ':'
        ),
        React.createElement(
          'div',
          null,
          React.createElement('div', { className: 'stat_bar stat_1_bar', id: this.props.stat + '_1_bar' }),
          React.createElement(
            'p',
            { className: 'stat_value stat_1_value', id: this.props.stat + '_1' },
            this.props.stat_values[0]
          ),
          React.createElement('div', { className: 'stat_bar stat_2_bar', id: this.props.stat + '_2_bar' }),
          React.createElement(
            'p',
            { className: 'stat_value stat_2_value', id: this.props.stat + '_2' },
            this.props.stat_values[1]
          )
        )
      );
    }
  }]);

  return Stat;
}(React.Component);

// Component for body of page; uses the two components above


var Body = function (_React$Component3) {
  _inherits(Body, _React$Component3);

  function Body(props) {
    _classCallCheck(this, Body);

    // State has a length 2 array corresponding to each item in the 'info' and 'stats' arrays
    // These arrays are used to store data for each user
    var _this4 = _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, props));

    _this4.state = {};
    for (var i = 0; i < info.length; i++) {
      _this4.state[info[i]] = ['', ''];
    }
    for (var i = 0; i < stats.length; i++) {
      _this4.state[stats[i].stat] = [0, 0];
    }
    return _this4;
  }

  // Following two functions are used as callback functions by UserSection components to update this component's state
  // Takes info/stat in question, which user to update, and the data itself


  _createClass(Body, [{
    key: 'getInfo',
    value: function getInfo(info, user, info_value) {
      if (user == 1) {
        this.setState(_defineProperty({}, info, [info_value, this.state[info][1]]));
      } else {
        this.setState(_defineProperty({}, info, [this.state[info][0], info_value]));
      }
    }
  }, {
    key: 'getStat',
    value: function getStat(stat, user, stat_value) {
      if (user == 1) {
        this.setState(_defineProperty({}, stat, [stat_value, this.state[stat][1]]));
      } else {
        this.setState(_defineProperty({}, stat, [this.state[stat][0], stat_value]));
      }
    }

    // Info for user passed down as props to UserSection components; getInfo() and getStat() passed to be used as callback functions
    // The map function inside div#stats creates a Stat component for each item in the array 'stats'
    // Corresponding stat passed down as prop to each Stat component

  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(UserSection, { user: 1, username: this.state.username[0], user_id: this.state.user_id[0], last_updated: this.state.last_updated[0], user_image: this.state.user_image[0], sendInfo: this.getInfo.bind(this), sendStat: this.getStat.bind(this) }),
        React.createElement(UserSection, { user: 2, username: this.state.username[1], user_id: this.state.user_id[1], last_updated: this.state.last_updated[1], user_image: this.state.user_image[1], sendInfo: this.getInfo.bind(this), sendStat: this.getStat.bind(this) }),
        React.createElement(
          'div',
          { id: 'stats' },
          stats.map(function (stat) {
            return React.createElement(Stat, { key: stat.stat, stat: stat.stat, stat_values: _this5.state[stat.stat] });
          })
        )
      );
    }
  }]);

  return Body;
}(React.Component);

ReactDOM.render(React.createElement(Body, null), document.querySelector('#body'));