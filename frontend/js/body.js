var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class that stores the name of a stat and how it should be compared
var StatInfo = function StatInfo(stat, compare_type) {
  _classCallCheck(this, StatInfo);

  this.stat = stat;
  // 1 if bigger is better, 0 if incomparable, -1 if smaller is better
  this.compare_type = compare_type;
};

var stats = [new StatInfo('mean_score', 0), new StatInfo('days_watched', 1), new StatInfo('episodes_watched', 1), new StatInfo('total_entries', 1), new StatInfo('completed', 1), new StatInfo('watching', 1), new StatInfo('on_hold', -1), new StatInfo('rewatched', 1), new StatInfo('dropped', -1), new StatInfo('plan_to_watch', -1)];

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
      document.getElementById(stats[i].stat + '_1_bar').style.width = scale.toString() + '%';
      document.getElementById(stats[i].stat + '_2_bar').style.width = (100 - scale).toString() + '%';

      // Updates bar colours
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

var UserSection = function (_React$Component) {
  _inherits(UserSection, _React$Component);

  function UserSection(props) {
    _classCallCheck(this, UserSection);

    var _this = _possibleConstructorReturn(this, (UserSection.__proto__ || Object.getPrototypeOf(UserSection)).call(this, props));

    _this.state = {
      username_input: '',
      username: ''
    };

    _this.updateUsernameInput = _this.updateUsernameInput.bind(_this);
    _this.submitUsername = _this.submitUsername.bind(_this);
    _this.updateUser = _this.updateUser.bind(_this);
    return _this;
  }

  // Updates text in input box


  _createClass(UserSection, [{
    key: 'updateUsernameInput',
    value: function updateUsernameInput(event) {
      this.setState({ username_input: event.target.value });
    }

    // Updates selected user

  }, {
    key: 'submitUsername',
    value: function submitUsername(event) {
      this.setState({ username: this.state.username_input });

      // Shows 'user_update_status' form
      document.querySelectorAll('#user_' + this.props.user + '_section .user_update_status').forEach(function (element) {
        return element.style.display = 'inherit';
      });

      event.preventDefault();
    }

    // Updates user's data

  }, {
    key: 'updateUser',
    value: function updateUser(event) {
      var _this2 = this;

      var username = document.getElementById('username_' + this.props.user).textContent;

      // Sends http request to backend server
      var http_req = new XMLHttpRequest();
      http_req.open('GET', 'http://localhost:3000/?username=' + username.replace(' ', '+'));
      http_req.send();

      // Executes when a response (a JSON-encoded string) is recieved
      http_req.onload = function () {
        var user_data = JSON.parse(http_req.response);

        for (var i = 0; i < stats.length; i++) {
          _this2.props.sendStat(stats[i].stat, _this2.props.user, user_data[stats[i].stat]);
        }

        updateUserStatGraphics();
      };

      event.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'user_' + this.props.user + '_section' },
        React.createElement(
          'form',
          { className: 'username_input', onSubmit: this.submitUsername },
          React.createElement(
            'h3',
            null,
            'User ' + this.props.user
          ),
          React.createElement('input', { type: 'text', id: 'username_' + this.props.user + '_input', value: this.state.username_input, onChange: this.updateUsernameInput }),
          React.createElement('input', { type: 'submit', id: 'username_' + this.props.user + '_submit', value: 'Select' })
        ),
        React.createElement(
          'form',
          { className: 'user_update_status', onSubmit: this.updateUser },
          React.createElement(
            'p',
            { id: 'username_' + this.props.user },
            this.state.username
          ),
          React.createElement(
            'p',
            { id: 'last_updated_' + this.props.user },
            '[Last Updated]'
          ),
          React.createElement('input', { type: 'submit', id: 'user_' + this.props.user + '_update', value: 'Update' })
        )
      );
    }
  }]);

  return UserSection;
}(React.Component);

// Component for displaying a stat


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
          processText(this.props.stat) + ':'
        ),
        React.createElement(
          'div',
          { className: 'stat_1', id: this.props.stat + '_1_bar' },
          React.createElement(
            'p',
            { id: this.props.stat + '_1' },
            this.props.stat_values[0]
          )
        ),
        React.createElement(
          'div',
          { className: 'stat_2', id: this.props.stat + '_2_bar' },
          React.createElement(
            'p',
            { id: this.props.stat + '_2' },
            this.props.stat_values[1]
          )
        )
      );
    }
  }]);

  return Stat;
}(React.Component);

// Component for body of page


var Body = function (_React$Component3) {
  _inherits(Body, _React$Component3);

  function Body(props) {
    _classCallCheck(this, Body);

    var _this4 = _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, props));

    _this4.state = {};
    for (var i = 0; i < stats.length; i++) {
      _this4.state[stats[i].stat] = [0, 0];
    }
    return _this4;
  }

  // Gets stat (from UserSection component)


  _createClass(Body, [{
    key: 'getStat',
    value: function getStat(stat, user, stat_value) {
      if (user == 1) {
        this.setState(_defineProperty({}, stat, [stat_value, this.state[stat][1]]));
      } else {
        this.setState(_defineProperty({}, stat, [this.state[stat][0], stat_value]));
      }

      console.log(this.state);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(UserSection, { user: 1, sendStat: this.getStat.bind(this) }),
        React.createElement(UserSection, { user: 2, sendStat: this.getStat.bind(this) }),
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