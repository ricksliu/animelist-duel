var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stats = ['mean_score', 'days_watched', 'episodes_watched', 'total_entries', 'completed', 'watching', 'on_hold', 'dropped', 'plan_to_watch', 'rewatched'];
// Stats where lower numbers are better
var reversed_stats = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0];
// Stats where comparing doesn't apply
var neutral_stats = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0];

function updateUserStatGraphics() {
  for (var i = 0; i < stats.length; i++) {
    // If a neutral stat, makes bars gray
    if (neutral_stats[i] == 1) {
      document.getElementById(stats[i] + '_1_bar').style.backgroundColor = '#999';
      document.getElementById(stats[i] + '_2_bar').style.backgroundColor = '#999';

      // If not a neutral stat, calculates bar widths and colours
    } else {
      // Gets stats
      var stat_1 = parseFloat(document.getElementById(stats[i] + '_1').textContent);
      var stat_2 = parseFloat(document.getElementById(stats[i] + '_2').textContent);

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
      document.getElementById(stats[i] + '_1_bar').style.width = scale.toString() + '%';
      document.getElementById(stats[i] + '_2_bar').style.width = (100 - scale).toString() + '%';

      // Updates bar colours
      if (scale > 50.0) {
        document.getElementById(stats[i] + '_1_bar').style.backgroundColor = '#6C6';
        document.getElementById(stats[i] + '_2_bar').style.backgroundColor = '#C66';
      } else if (scale < 50.0) {
        document.getElementById(stats[i] + '_1_bar').style.backgroundColor = '#C66';
        document.getElementById(stats[i] + '_2_bar').style.backgroundColor = '#6C6';
      } else {
        document.getElementById(stats[i] + '_1_bar').style.backgroundColor = '#999';
        document.getElementById(stats[i] + '_2_bar').style.backgroundColor = '#999';
      }
    }
  }

  // Shows #stats
  document.getElementById('stats').style.display = 'inherit';
}

// Component for inputting username and updating user data

var UserSection = function (_React$Component) {
  _inherits(UserSection, _React$Component);

  function UserSection(props) {
    _classCallCheck(this, UserSection);

    var _this = _possibleConstructorReturn(this, (UserSection.__proto__ || Object.getPrototypeOf(UserSection)).call(this, props));

    _this.user = props.user;

    _this.state = {
      username_input: '',
      username: ''
    };

    _this.updateUsernameInput = _this.updateUsernameInput.bind(_this);
    _this.submitUsername = _this.submitUsername.bind(_this);
    _this.updateUser = _this.updateUser.bind(_this);
    return _this;
  }

  _createClass(UserSection, [{
    key: 'updateUsernameInput',
    value: function updateUsernameInput(event) {
      this.setState({ username_input: event.target.value });
    }
  }, {
    key: 'submitUsername',
    value: function submitUsername(event) {
      this.setState({ username: this.state.username_input });

      // Shows 'user_update_status' form
      document.querySelectorAll('#user_' + this.user + '_section div .user_update_status').forEach(function (element) {
        return element.style.display = 'inherit';
      });

      event.preventDefault();
    }
  }, {
    key: 'updateUser',
    value: function updateUser(event) {
      var username = document.getElementById('username_' + this.user).textContent;

      // Sends http request to backend server
      var http_req = new XMLHttpRequest();
      http_req.open('GET', 'http://localhost:3000/?username=' + username.replace(' ', '+'));
      http_req.send();

      // Executes when a response (a JSON-encoded string) is recieved
      http_req.onload = function () {
        var user_data = JSON.parse(http_req.response);

        updateUserStatGraphics();
      };

      event.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'form',
          { className: 'username_input', onSubmit: this.submitUsername },
          React.createElement(
            'h3',
            null,
            'User ' + this.user
          ),
          React.createElement('input', { type: 'text', id: 'username_' + this.user + '_input', value: this.state.username_input, onChange: this.updateUsernameInput }),
          React.createElement('input', { type: 'submit', id: 'username_' + this.user + '_submit', value: 'Select' })
        ),
        React.createElement(
          'form',
          { className: 'user_update_status', onSubmit: this.updateUser },
          React.createElement(
            'p',
            { id: 'username_' + this.user },
            this.state.username
          ),
          React.createElement(
            'p',
            { id: 'last_updated_' + this.user },
            '[Last Updated]'
          ),
          React.createElement('input', { type: 'submit', id: 'user_' + this.user + '_update', value: 'Update' })
        )
      );
    }
  }]);

  return UserSection;
}(React.Component);

// Adds UserSection components


for (var i = 1; i <= 2; i++) {
  ReactDOM.render(React.createElement(UserSection, { user: i }), document.querySelector('#user_' + i + '_section'));
}