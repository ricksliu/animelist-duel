var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class that stores some info about a stat
var StatInfo = function () {
  function StatInfo(stat, compare_type, fact_not_tied, fact_tied, fact_one_zero, fact_both_zero) {
    _classCallCheck(this, StatInfo);

    this.stat = stat;
    this.compare_type = compare_type; // 1 if bigger is better, 0 if incomparable, -1 if smaller is better

    // Strings that will be displayed under stat bars
    this.fact_not_tied = fact_not_tied;
    this.fact_tied = fact_tied;
    this.fact_one_zero = fact_one_zero;
    this.fact_both_zero = fact_both_zero;
  }

  // Returns applicable fun fact about a stat


  _createClass(StatInfo, [{
    key: 'getFact',
    value: function getFact(user_1, stat_1, user_2, stat_2) {
      var diff = Math.abs(stat_1 - stat_2).toFixed(2);
      var diff_int = Math.abs(stat_1 - stat_2).toFixed(0);

      // Only 1 user is selected
      if (user_1 == '' || user_2 == '') {
        return '';
      }

      // Both zero
      if (stat_1 == 0 && stat_2 == 0 && this.fact_both_zero != '') {
        return this.fact_both_zero.replaceAll('user_1', user_1).replaceAll('user_2', user_2);
      }

      // One zero
      if (this.fact_one_zero != '') {
        if (stat_1 == 0) {
          return this.fact_one_zero.replaceAll('user_2', user_1).replaceAll('user_1', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff);
        }
        if (stat_2 == 0) {
          return this.fact_one_zero.replaceAll('user_1', user_1).replaceAll('user_2', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff);
        }
      }

      // Tied
      if (stat_1 == stat_2 && this.fact_tied != '') {
        return this.fact_tied.replaceAll('user_1', user_1).replaceAll('user_2', user_2);
      }

      // Not tied
      if (this.fact_not_tied != '') {
        if (parseFloat(stat_1) < parseFloat(stat_2)) {
          var prod = (stat_2 / stat_1).toFixed(2);
          return this.fact_not_tied.replaceAll('user_2', user_1).replaceAll('user_1', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff).replaceAll('stat_prod', prod);
        }
        if (parseFloat(stat_1) > parseFloat(stat_2)) {
          var _prod = (stat_1 / stat_2).toFixed(2);
          return this.fact_not_tied.replaceAll('user_1', user_1).replaceAll('user_2', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff).replaceAll('stat_prod', _prod);
        }
      }

      return "...cool.";
    }
  }]);

  return StatInfo;
}();

// Following two arrays store the names (and additional info) of user data that the website handles


var info = ['username', 'user_id', 'last_updated', 'user_image'];
var stats = [new StatInfo('mean_score', 0, "user_1's mean score is stat_diff higher than user_2's. Does user_2 watch worse shows or is user_1 just overly generous?", "user_1 and user_2 have the same mean score. Spooky.", "", ""), new StatInfo('days_watched', 1, "user_1 has watched stat_prod times as much anime as user_2. user_1 desperately needs to get a life.", "user_1 and user_2 have watched the same amount of anime. It's anyone's game.", "user_2 has never watched anime at all. user_1 wins, but user_2 is probably the true winner here.", "Both user_1 and user_2 have never watched anime. Let's hope it stays that way."), new StatInfo('episodes_watched', 1, "user_1 has watched stat_prod times as many episodes as user_2. Time for a stat_diff_int episode binge, user_2?", "user_1 and user_2 have watched the same number of episodes. Not all episodes are created equal though.", "user_2 has never watched an episode of anime. Good or bad? Probably good.", "Both user_1 and user_2 have never watched an episode of anime. Good on them."), new StatInfo('total_entries', 1, "user_1 has stat_prod times as many total entries as user_2. Total entries is a meaningless stat anyways.", "user_1 and user_2 have the same number of total entries. Total entries is a meaningless stat anyways.", "", ""), new StatInfo('completed', 1, "user_1 has completed stat_prod times as many entries as user_2. Time for user_2 to watch stat_diff_int 1-minute shorts?", "user_1 and user_2 have completed the same number of entries. Commence the argument on how some entries are way larger than others.", "", ""), new StatInfo('watching', 1, "user_1 is watching stat_prod times as many entries as user_2. How does user_1 do it?", "user_1 and user_2 are watching the same number of entries. We'll see how the situation develops next season.", "user_2 is not watching any anime right now. They'll be back. They always come back.", "Both user_1 and user_2 are not watching any anime right now. They'll be back. They always come back."), new StatInfo('on_hold', -1, "user_1 has stat_prod times as many entries on hold as user_2. user_1 bit off more than they could chew.", "user_1 and user_2 have the same number of entries on hold. They both have some work to do.", "user_2 has no entries on hold. user_1 has some work to do.", "Both user_1 and user_2 have no entries on hold. At least they commit all the way."), new StatInfo('rewatched', 1, "user_1 has rewatched stat_prod times as many entries as user_2. user_1, don't you have anything better to do?", "user_1 and user_2 have rewatched the same number of entries. They both need something better to do.", "user_2 has never rewatched anything. To user_2, watching something twice is apparently too far.", "Both user_1 and user_2 have never rewatched anything. Watching something twice is apparently too far."), new StatInfo('dropped', -1, "user_1 has dropped stat_prod times as many entries as user_2. user_1 really can't make up their mind.", "user_1 and user_2 have dropped the same number of entries. They really can't make up their mind.", "user_2 has never dropped anything. Dedication or masochism?", "Both user_1 and user_2 have never dropped anything. Dedication or masochism?"), new StatInfo('plan_to_watch', -1, "user_1 plans to watch stat_prod times as many entries as user_2. user_1 needs to get grinding.", "user_1 and user_2 plan to watch the same number of entries. Get grinding.", "user_2 doesn't plan to watch anything. user_2 has defeated anime (for now).", "Both user_1 and user_2 don't plan to watch anything. They've defeated anime (for now).")];

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
      var scale = void 0;
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

  // Shows/hides elements that only appear if 2 users have been inputted
  var stat_facts = document.getElementsByClassName('stat_fact');
  if (document.getElementById('username_1').textContent != '' && document.getElementById('username_2').textContent != '') {
    document.getElementById('vs').style.display = 'inherit';

    for (var _i = 0; _i < stat_facts.length; _i++) {
      stat_facts[_i].style.visibility = 'inherit';
    }
  } else {
    document.getElementById('vs').style.display = 'none';

    for (var _i2 = 0; _i2 < stat_facts.length; _i2++) {
      stat_facts[_i2].style.visibility = 'hidden';
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
          for (var _i3 = 0; _i3 < stats.length; _i3++) {
            _this2.props.sendStat(_i3, _this2.props.user, user_data[stats[_i3].stat]);
          }
          _this2.props.updateStatFacts();

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
            for (var _i4 = 0; _i4 < info.length; _i4++) {
              _this2.props.sendInfo(info[_i4], _this2.props.user, '');
            }
            for (var _i5 = 0; _i5 < stats.length; _i5++) {
              _this2.props.sendStat(_i5, _this2.props.user, 0); // Stat bars break if an empty string is sent instead of a number
            }
            _this2.props.updateStatFacts();

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
        for (var _i6 = 0; _i6 < stats.length; _i6++) {
          _this2.props.sendStat(_i6, _this2.props.user, 0); // Stat bars break if an empty string is sent instead of a number
        }
        _this2.props.updateStatFacts();

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
            React.createElement('input', { type: 'text', className: 'input_text', id: 'username_' + this.props.user + '_input', value: this.state.username_input, onChange: this.updateUsernameInput }),
            React.createElement('input', { type: 'submit', className: 'input_submit', id: 'username_' + this.props.user + '_submit', value: 'Select' })
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
          React.createElement('input', { type: 'submit', className: 'input_submit', id: 'user_' + this.props.user + '_update', value: 'Update Data' })
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
        ),
        React.createElement(
          'p',
          { className: 'stat_fact', id: this.props.stat + '_fact' },
          this.props.stat_fact
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

    var _this4 = _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, props));

    _this4.state = {};
    for (var i = 0; i < info.length; i++) {
      _this4.state[info[i]] = ['', ''];
    }
    _this4.state.stats = [];
    for (var _i7 = 0; _i7 < stats.length; _i7++) {
      _this4.state.stats.push([0, 0]);
    }
    _this4.state.stat_facts = [];
    for (var _i8 = 0; _i8 < stats.length; _i8++) {
      _this4.state.stat_facts.push('');
    }
    return _this4;
  }

  // Following functions are used as callback functions by UserSection components to update this component's state


  _createClass(Body, [{
    key: 'setInfo',
    value: function setInfo(info, user, info_value) {
      if (user == 1) {
        this.setState(_defineProperty({}, info, [info_value, this.state[info][1]]));
      } else {
        this.setState(_defineProperty({}, info, [this.state[info][0], info_value]));
      }
    }
  }, {
    key: 'setStat',
    value: function setStat(i, user, stat_value) {
      var new_stats = this.state.stats;
      if (user == 1) {
        new_stats[i] = [stat_value, this.state.stats[i][1]];
      } else {
        new_stats[i] = [this.state.stats[i][0], stat_value];
      }
      this.setState({ stats: new_stats });
    }
  }, {
    key: 'updateStatFacts',
    value: function updateStatFacts() {
      var new_stat_facts = this.state.stat_facts;
      for (var i = 0; i < stats.length; i++) {
        new_stat_facts[i] = stats[i].getFact(this.state.username[0], this.state.stats[i][0], this.state.username[1], this.state.stats[i][1]);
      }
      this.setState({ stat_facts: new_stat_facts });
    }

    // Info for user passed down as props to UserSection components; getInfo(), getStat(), updateStatFacts() passed to be used as callback functions
    // The map function inside div#stats creates a Stat component for each item in the array 'stats'
    // Corresponding stat passed down as prop to each Stat component

  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          { id: 'vs' },
          'VS'
        ),
        React.createElement(UserSection, { user: 1, username: this.state.username[0], user_id: this.state.user_id[0], last_updated: this.state.last_updated[0], user_image: this.state.user_image[0], sendInfo: this.setInfo.bind(this), sendStat: this.setStat.bind(this), updateStatFacts: this.updateStatFacts.bind(this) }),
        React.createElement(UserSection, { user: 2, username: this.state.username[1], user_id: this.state.user_id[1], last_updated: this.state.last_updated[1], user_image: this.state.user_image[1], sendInfo: this.setInfo.bind(this), sendStat: this.setStat.bind(this), updateStatFacts: this.updateStatFacts.bind(this) }),
        React.createElement(
          'div',
          { id: 'stats' },
          React.createElement(
            'h2',
            null,
            'Stat Face-Off'
          ),
          React.createElement(
            'p',
            { className: 'main_p' },
            '"Starting Life From 0.0"'
          ),
          [].concat(_toConsumableArray(Array(stats.length).keys())).map(function (i) {
            return React.createElement(Stat, { key: stats[i].stat, stat: stats[i].stat, stat_values: _this5.state.stats[i], stat_fact: _this5.state.stat_facts[i] });
          })
        ),
        React.createElement(
          'div',
          { id: 'score_differences' },
          React.createElement(
            'h2',
            null,
            'Opinion Clash'
          ),
          React.createElement(
            'p',
            { className: 'main_p' },
            '"Your Opinion Is Wrong As I Expected"'
          )
        )
      );
    }
  }]);

  return Body;
}(React.Component);

ReactDOM.render(React.createElement(Body, null), document.querySelector('#body'));