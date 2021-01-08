var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StatInfo = function () {
  function StatInfo(stat, compare_type, fact_not_tied, fact_tied, fact_one_zero, fact_both_zero) {
    _classCallCheck(this, StatInfo);

    this.stat = stat;
    this.compare_type = compare_type; // How the bars are calculated; 1 = bigger is better, 0 = do not compare, -1 = smaller is better

    // Strings that will be displayed under stat bars under certain conditions
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

      // Returns blank string if only one user is selected; although the string will be hidden, it will still affect the page layout
      if (user_1 == '' || user_2 == '') {
        return '';
      }

      if (this.fact_one_zero != '') {
        // Both stats are 0
        if (stat_1 == 0 && stat_2 == 0) {
          return this.fact_both_zero.replaceAll('user_1', user_1).replaceAll('user_2', user_2);
        }
        // One stat is 0
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
        var prod = (stat_2 / stat_1).toFixed(2);
        return this.fact_not_tied.replaceAll('user_2', user_1).replaceAll('user_1', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff).replaceAll('stat_prod', prod);
      } else {
        var _prod = (stat_1 / stat_2).toFixed(2);
        return this.fact_not_tied.replaceAll('user_1', user_1).replaceAll('user_2', user_2).replaceAll('stat_diff_int', diff_int).replaceAll('stat_diff', diff).replaceAll('stat_prod', _prod);
      }
    }
  }]);

  return StatInfo;
}();

// Following two arrays store the names (and additional info) of user data that the website handles


var info = ['username', 'user_id', 'last_updated', 'user_image'];

var stats = [new StatInfo('mean_score', 0, "user_1's mean score is stat_diff higher than user_2's. Does user_2 watch worse shows or is user_1 just overly generous?", "user_1 and user_2 have the same mean score. Spooky.", "", ""), new StatInfo('days_watched', 1, "user_1 has watched stat_prod times as much anime as user_2. user_1 desperately needs to get a life.", "user_1 and user_2 have watched the same amount of anime. It's anyone's game.", "user_2 has never watched anime at all. user_1 wins, but user_2 is probably the true winner here.", "Both user_1 and user_2 have never watched anime. Let's hope it stays that way."), new StatInfo('episodes_watched', 1, "user_1 has watched stat_prod times as many episodes as user_2. Time for a stat_diff_int episode binge, user_2?", "user_1 and user_2 have watched the same number of episodes. Not all episodes are created equal though.", "user_2 has never watched an episode of anime. Good or bad? Probably good.", "Both user_1 and user_2 have never watched an episode of anime. Good on them."), new StatInfo('total_entries', 1, "user_1 has stat_prod times as many total entries as user_2. Total entries is a meaningless stat anyways.", "user_1 and user_2 have the same number of total entries. Total entries is a meaningless stat anyways.", "", ""), new StatInfo('completed', 1, "user_1 has completed stat_prod times as many entries as user_2. Time for user_2 to watch stat_diff_int 1-minute shorts?", "user_1 and user_2 have completed the same number of entries. Commence the argument on how some entries are way larger than others.", "", ""), new StatInfo('watching', 1, "user_1 is watching stat_prod times as many entries as user_2. How does user_1 do it?", "user_1 and user_2 are watching the same number of entries. We'll see how the situation develops next season.", "user_2 is not watching any anime right now. They'll be back. They always come back.", "Both user_1 and user_2 are not watching any anime right now. They'll be back. They always come back."), new StatInfo('on_hold', -1, "user_1 has stat_prod times as many entries on hold as user_2. user_1 bit off more than they could chew.", "user_1 and user_2 have the same number of entries on hold. They both have some work to do.", "user_2 has no entries on hold. user_1 has some work to do.", "Both user_1 and user_2 have no entries on hold. At least they commit all the way."), new StatInfo('rewatched', 1, "user_1 has rewatched stat_prod times as many entries as user_2. user_1, don't you have anything better to do?", "user_1 and user_2 have rewatched the same number of entries. They both need something better to do.", "user_2 has never rewatched anything. To user_2, watching something twice is apparently too far.", "Both user_1 and user_2 have never rewatched anything. Watching something twice is apparently too far."), new StatInfo('dropped', -1, "user_1 has dropped stat_prod times as many entries as user_2. user_1 really can't make up their mind.", "user_1 and user_2 have dropped the same number of entries. They really can't make up their mind.", "user_2 has never dropped anything. Dedication or masochism?", "Both user_1 and user_2 have never dropped anything. Dedication or masochism?"), new StatInfo('plan_to_watch', -1, "user_1 plans to watch stat_prod times as many entries as user_2. user_1 needs to get grinding.", "user_1 and user_2 plan to watch the same number of entries. Get grinding.", "user_2 doesn't plan to watch anything. user_2 has defeated anime (for now).", "Both user_1 and user_2 don't plan to watch anything. They've defeated anime (for now).")];

// Given a string like 'mean_score', returns 'Mean Score'
function capitalize(text) {
  return text.replaceAll('_', ' ').split(' ').map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

// Component for inputting username and updating user data

var UserSection = function (_React$Component) {
  _inherits(UserSection, _React$Component);

  function UserSection(props) {
    _classCallCheck(this, UserSection);

    // username_input is necessary in order to keep the text inside the input form up to date
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

      var http_req = new XMLHttpRequest();
      // If request was 'get', uses (possibly newly entered) username in input form rather than username in parent's state
      if (request == 'get') {
        http_req.open('GET', 'http://localhost:3000/?username=' + this.state.username_input.replace(' ', '+') + '&request=' + request);
      } else {
        http_req.open('GET', 'http://localhost:3000/?username=' + this.props.usernames[this.props.user - 1].replace(' ', '+') + '&request=' + request);
      }
      http_req.send();

      http_req.onload = function () {
        var user_data = JSON.parse(http_req.response);

        // If update was successful (backend sets user_id to an empty string if it was unsuccessful)
        if (user_data.user_id != '') {
          info.forEach(function (i) {
            return _this2.props.sendInfo(_this2.props.user, i, user_data[i]);
          });
          stats.forEach(function (s) {
            return _this2.props.sendStat(_this2.props.user, s.stat, user_data[s.stat]);
          });
          _this2.props.updateStatFacts();
          _this2.props.getScoreDiffs(request);

          document.getElementById('backend_error_' + _this2.props.user).style.display = 'none';
          document.getElementById('username_error_' + _this2.props.user).style.display = 'none';
          document.querySelectorAll('#user_' + _this2.props.user + '_section .user_update_status').forEach(function (e) {
            return e.style.display = 'inherit';
          });
          _this2.props.updateCSS();

          // If update was unsuccessful
        } else {
          if (request == 'get') {
            _this2.sendRequest('update');
          } else {
            info.forEach(function (i) {
              return _this2.props.sendInfo(_this2.props.user, i, '');
            });
            stats.forEach(function (s) {
              return _this2.props.sendStat(_this2.props.user, s.stat, 0);
            });
            _this2.props.updateStatFacts();
            _this2.props.getScoreDiffs(request);

            document.getElementById('backend_error_' + _this2.props.user).style.display = 'none';
            document.getElementById('username_error_' + _this2.props.user).style.display = 'inherit';
            document.querySelectorAll('#user_' + _this2.props.user + '_section .user_update_status').forEach(function (e) {
              return e.style.display = 'none';
            });
            _this2.props.updateCSS();
          }
        }
      };

      // Executes if backend is offline
      http_req.onerror = function () {
        info.forEach(function (i) {
          return _this2.props.sendInfo(_this2.props.user, i, '');
        });
        stats.forEach(function (s) {
          return _this2.props.sendStat(_this2.props.user, s.stat, 0);
        });
        _this2.props.updateStatFacts();
        _this2.props.getScoreDiffs(request);

        document.getElementById('backend_error_' + _this2.props.user).style.display = 'inherit';
        document.getElementById('username_error_' + _this2.props.user).style.display = 'none';
        document.querySelectorAll('#user_' + _this2.props.user + '_section .user_update_status').forEach(function (e) {
          return e.style.display = 'none';
        });
        _this2.props.updateCSS();
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

    // 'form.username_input' is for inputting and selecting a user to display
    // 'p.backend_error' and 'p.username_error' are usually not displayed
    // 'form.user_update_status' displays how up to date the current stats are and a button to update them

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
            this.props.usernames[this.props.user - 1]
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

// Component that displays two numbers and a bar for each number


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
          capitalize(this.props.stat) + ':'
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

// Component that displays a title and the scores that each user gave it


var ScoreDiff = function (_React$Component3) {
  _inherits(ScoreDiff, _React$Component3);

  function ScoreDiff() {
    _classCallCheck(this, ScoreDiff);

    return _possibleConstructorReturn(this, (ScoreDiff.__proto__ || Object.getPrototypeOf(ScoreDiff)).apply(this, arguments));
  }

  _createClass(ScoreDiff, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'score_diff', id: 'score_diff_' + this.props.id },
        React.createElement(
          'h3',
          null,
          '' + capitalize(this.props.title)
        ),
        React.createElement(
          'p',
          { className: 'score_diff_score score_diff_score_1', id: 'score_diff_score_' + this.props.id + '_1' },
          this.props.score_1,
          '/10'
        ),
        React.createElement(
          'p',
          { className: 'score_diff_score score_diff_score_2', id: 'score_diff_score_' + this.props.id + '_2' },
          this.props.score_2,
          '/10'
        ),
        React.createElement('img', { src: 'https://i.kym-cdn.com/entries/icons/mobile/000/027/108/anime.jpg', alt: '' }),
        React.createElement(
          'p',
          { className: 'score_diff_diff', id: 'score_diff_' + this.props.id + '_diff' },
          '\xB1',
          this.props.diff
        )
      );
    }
  }]);

  return ScoreDiff;
}(React.Component);

// Component for body of page; uses the components above


var Body = function (_React$Component4) {
  _inherits(Body, _React$Component4);

  function Body(props) {
    _classCallCheck(this, Body);

    var _this5 = _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, props));

    _this5.state = {};
    for (var i = 0; i < info.length; i++) {
      _this5.state[info[i]] = ['', ''];
    }
    for (var _i = 0; _i < stats.length; _i++) {
      _this5.state[stats[_i].stat] = [0, 0];
      _this5.state[stats[_i].stat + '_fact'] = '';
    }
    _this5.state.scoreDiffs = [];
    for (var _i2 = 0; _i2 < 5; _i2++) {
      _this5.state.scoreDiffs.push({
        'title_id': 0,
        'title': '',
        'score_1': 0,
        'score_2': 0,
        'score_difference': 0
      });
    }
    return _this5;
  }

  // Sets specific info for specific user


  _createClass(Body, [{
    key: 'setInfo',
    value: function setInfo(user, info, value) {
      if (user == 1) {
        this.setState(_defineProperty({}, info, [value, this.state[info][1]]));
      } else {
        this.setState(_defineProperty({}, info, [this.state[info][0], value]));
      }
    }

    // Sets specific stat for specific user

  }, {
    key: 'setStat',
    value: function setStat(user, stat, value) {
      if (user == 1) {
        this.setState(_defineProperty({}, stat, [value, this.state[stat][1]]));
      } else {
        this.setState(_defineProperty({}, stat, [this.state[stat][0], value]));
      }
    }
  }, {
    key: 'updateStatFacts',
    value: function updateStatFacts() {
      for (var i = 0; i < stats.length; i++) {
        this.setState(_defineProperty({}, stats[i].stat + '_fact', stats[i].getFact(this.state.username[0], this.state[stats[i].stat][0], this.state.username[1], this.state[stats[i].stat][1])));
      }
    }
  }, {
    key: 'getScoreDiffs',
    value: function getScoreDiffs(request) {
      var _this6 = this;

      if (this.state.username[0] != '' && this.state.username[1] != '') {
        var http_req = new XMLHttpRequest();
        // If request was 'get', requests old info
        if (request == 'get') {
          http_req.open('GET', 'http://localhost:3000/?username1=' + this.state.username[0].replace(' ', '+') + '&username2=' + this.state.username[1].replace(' ', '+') + '&request=getdiff');
        } else {
          http_req.open('GET', 'http://localhost:3000/?username1=' + this.state.username[0].replace(' ', '+') + '&username2=' + this.state.username[1].replace(' ', '+') + '&request=updatediff');
        }
        http_req.send();

        http_req.onload = function () {
          var results = JSON.parse(http_req.response);
          _this6.setState({ 'scoreDiffs': results.results });
        };

        http_req.onerror = function () {};
      }
    }
  }, {
    key: 'updateCSS',
    value: function updateCSS() {
      // Updates stat bars
      for (var i = 0; i < stats.length; i++) {
        // If a neutral stat, makes bars gray
        if (stats[i].compare_type == 0) {
          document.getElementById(stats[i].stat + '_1_bar').style.backgroundColor = '#999';
          document.getElementById(stats[i].stat + '_2_bar').style.backgroundColor = '#999';

          // If not a neutral stat, calculates bar widths and colours
        } else {
          var scale = 50; // Percentage of bar occupied by user 1
          // Prevents division by 0
          if (Number(this.state[stats[i].stat][0]) != 0 || Number(this.state[stats[i].stat][1] != 0)) {
            scale = 1 + 98 * this.state[stats[i].stat][0] / (Number(this.state[stats[i].stat][0]) + Number(this.state[stats[i].stat][1]));
            // If a reversed stat, reverses the bar width
            if (stats[i].compare_type == -1) {
              scale = 100 - scale;
            }
          }

          // Sets bar widths
          document.getElementById(stats[i].stat + '_1_bar').style.width = scale.toString() + '%';
          document.getElementById(stats[i].stat + '_2_bar').style.width = (100 - scale).toString() + '%';

          // Updates bar colours to be green/red/gray
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

      // Shows/hides elements based on how many valid users have been entered (2, 1, 0)
      if (document.getElementById('username_1').textContent != '' && document.getElementById('username_2').textContent != '') {
        document.getElementById('vs').style.display = 'inherit';
        document.getElementById('stats').style.display = 'inherit';
        [].forEach.call(document.getElementsByClassName('stat_fact'), function (e) {
          return e.style.visibility = 'inherit';
        });
        document.getElementById('score_diffs').style.display = 'inherit';
      } else if (document.getElementById('username_1').textContent != '' || document.getElementById('username_2').textContent != '') {
        document.getElementById('vs').style.display = 'none';
        document.getElementById('stats').style.display = 'inherit';
        [].forEach.call(document.getElementsByClassName('stat_fact'), function (e) {
          return e.style.visibility = 'hidden';
        });
        document.getElementById('score_diffs').style.display = 'none';
      } else {
        document.getElementById('vs').style.display = 'none';
        document.getElementById('stats').style.display = 'none';
        [].forEach.call(document.getElementsByClassName('stat_fact'), function (e) {
          return e.style.visibility = 'hidden';
        });
        document.getElementById('score_diffs').style.display = 'none';
      }
    }

    // Info for user passed down as props to UserSection components; getInfo(), getStat(), updateStatFacts() passed to be used as callback functions
    // Map function inside div#stats creates a Stat component for each item in the array 'stats'
    // Corresponding stat passed down as prop to each Stat component

  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          { id: 'vs' },
          'VS'
        ),
        React.createElement(UserSection, { user: 1, usernames: this.state.username, user_id: this.state.user_id[0], last_updated: this.state.last_updated[0], user_image: this.state.user_image[0], sendInfo: this.setInfo.bind(this), sendStat: this.setStat.bind(this), updateStatFacts: this.updateStatFacts.bind(this), getScoreDiffs: this.getScoreDiffs.bind(this), updateCSS: this.updateCSS.bind(this) }),
        React.createElement(UserSection, { user: 2, usernames: this.state.username, user_id: this.state.user_id[1], last_updated: this.state.last_updated[1], user_image: this.state.user_image[1], sendInfo: this.setInfo.bind(this), sendStat: this.setStat.bind(this), updateStatFacts: this.updateStatFacts.bind(this), getScoreDiffs: this.getScoreDiffs.bind(this), updateCSS: this.updateCSS.bind(this) }),
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
            '"Starting Life From 0.00"'
          ),
          stats.map(function (stat) {
            return React.createElement(Stat, { key: stat.stat, stat: stat.stat, stat_values: _this7.state[stat.stat], stat_fact: _this7.state[stat.stat + '_fact'] });
          })
        ),
        React.createElement(
          'div',
          { id: 'score_diffs' },
          React.createElement(
            'h2',
            null,
            'Opinion Clash'
          ),
          React.createElement(
            'p',
            { className: 'main_p' },
            '"Your Opinion Is Wrong As I Expected"'
          ),
          [].concat(_toConsumableArray(Array(5).keys())).map(function (i) {
            return React.createElement(ScoreDiff, { key: 'score_diff_' + i, id: i, title: _this7.state.scoreDiffs[i].title, score_1: _this7.state.scoreDiffs[i].score_1, score_2: _this7.state.scoreDiffs[i].score_2, diff: _this7.state.scoreDiffs[i].score_difference });
          })
        )
      );
    }
  }]);

  return Body;
}(React.Component);

ReactDOM.render(React.createElement(Body, null), document.querySelector('#body'));