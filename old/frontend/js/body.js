var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StatInfo = function () {
  function StatInfo(stat, compareType, factNotTied, factTied, factOneZero, factBothZero) {
    _classCallCheck(this, StatInfo);

    this.stat = stat;
    this.compareType = compareType; // How the bars are calculated; 1 = bigger is better, 0 = do not compare, -1 = smaller is better

    // Strings that will be displayed under stat bars under certain conditions
    this.factNotTied = factNotTied;
    this.factTied = factTied;
    this.factOneZero = factOneZero;
    this.factBothZero = factBothZero;
  }

  // Returns applicable fun fact about a stat


  _createClass(StatInfo, [{
    key: 'getFact',
    value: function getFact(user1, stat1, user2, stat2) {
      var diff = Math.abs(stat1 - stat2).toFixed(2);
      var diffInt = Math.abs(stat1 - stat2).toFixed(0);

      // Returns blank string if only one user is selected; although the string will be hidden, it will still affect the page layout
      if (user1 == '' || user2 == '') {
        return '';
      }

      if (this.factOneZero != '') {
        // Both stats are 0
        if (stat1 == 0 && stat2 == 0) {
          return this.factBothZero.replaceAll('user1', user1).replaceAll('user2', user2);
        }
        // One stat is 0
        if (stat1 == 0) {
          return this.factOneZero.replaceAll('user2', user1).replaceAll('user1', user2).replaceAll('statDiffInt', diffInt).replaceAll('statDiff', diff);
        }
        if (stat2 == 0) {
          return this.factOneZero.replaceAll('user1', user1).replaceAll('user2', user2).replaceAll('statDiffInt', diffInt).replaceAll('statDiff', diff);
        }
      }

      // Both stats are tied
      if (stat1 == stat2) {
        return this.factTied.replaceAll('user1', user1).replaceAll('user2', user2);
        // Stats are not tied
      } else if (parseFloat(stat1) < parseFloat(stat2)) {
        var prod = (stat2 / stat1).toFixed(2);
        return this.factNotTied.replaceAll('user2', user1).replaceAll('user1', user2).replaceAll('statDiffInt', diffInt).replaceAll('statDiff', diff).replaceAll('statProd', prod);
      } else {
        var _prod = (stat1 / stat2).toFixed(2);
        return this.factNotTied.replaceAll('user1', user1).replaceAll('user2', user2).replaceAll('statDiffInt', diffInt).replaceAll('statDiff', diff).replaceAll('statProd', _prod);
      }
    }
  }]);

  return StatInfo;
}();

// Following two arrays store the names (and additional info) of user data that the website handles


var info = ['username', 'user_id', 'last_updated', 'user_image'];

var stats = [new StatInfo('mean_score', 0, "user1's mean score is statDiff higher than user2's. Does user2 watch worse shows or is user1 just overly generous?", "user1 and user2 have the same mean score. Spooky.", "", ""), new StatInfo('days_watched', 1, "user1 has watched statProd times as much anime as user2. user1 desperately needs to get a life.", "user1 and user2 have watched the same amount of anime. It's anyone's game.", "user2 has never watched anime at all. user1 wins, but user2 is probably the true winner here.", "Both user1 and user2 have never watched anime. Let's hope it stays that way."), new StatInfo('episodes_watched', 1, "user1 has watched statProd times as many episodes as user2. Time for a statDiffInt episode binge, user2?", "user1 and user2 have watched the same number of episodes. Not all episodes are created equal though.", "user2 has never watched an episode of anime. Good or bad? Probably good.", "Both user1 and user2 have never watched an episode of anime. Good on them."), new StatInfo('total_entries', 1, "user1 has statProd times as many total entries as user2. Total entries is a meaningless stat anyways.", "user1 and user2 have the same number of total entries. Total entries is a meaningless stat anyways.", "", ""), new StatInfo('completed', 1, "user1 has completed statProd times as many entries as user2. Time for user2 to watch statDiffInt 1-minute shorts?", "user1 and user2 have completed the same number of entries. Commence the argument on how some entries are way larger than others.", "", ""), new StatInfo('watching', 1, "user1 is watching statProd times as many entries as user2. How does user1 do it?", "user1 and user2 are watching the same number of entries. We'll see how the situation develops next season.", "user2 is not watching any anime right now. They'll be back. They always come back.", "Both user1 and user2 are not watching any anime right now. They'll be back. They always come back."), new StatInfo('on_hold', -1, "user1 has statProd times as many entries on hold as user2. user1 bit off more than they could chew.", "user1 and user2 have the same number of entries on hold. They both have some work to do.", "user2 has no entries on hold. user1 has some work to do.", "Both user1 and user2 have no entries on hold. At least they commit all the way."), new StatInfo('rewatched', 1, "user1 has rewatched statProd times as many entries as user2. user1, don't you have anything better to do?", "user1 and user2 have rewatched the same number of entries. They both need something better to do.", "user2 has never rewatched anything. To user2, watching something twice is apparently too far.", "Both user1 and user2 have never rewatched anything. Watching something twice is apparently too far."), new StatInfo('dropped', -1, "user1 has dropped statProd times as many entries as user2. user1 really can't make up their mind.", "user1 and user2 have dropped the same number of entries. They really can't make up their mind.", "user2 has never dropped anything. Dedication or masochism?", "Both user1 and user2 have never dropped anything. Dedication or masochism?"), new StatInfo('plan_to_watch', -1, "user1 plans to watch statProd times as many entries as user2. user1 needs to get grinding.", "user1 and user2 plan to watch the same number of entries. Get grinding.", "user2 doesn't plan to watch anything. user2 has defeated anime (for now).", "Both user1 and user2 don't plan to watch anything. They've defeated anime (for now).")];

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

    // usernameInput is necessary in order to keep the text inside the input form up to date
    var _this = _possibleConstructorReturn(this, (UserSection.__proto__ || Object.getPrototypeOf(UserSection)).call(this, props));

    _this.state = {
      usernameInput: ''
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
      this.setState({ usernameInput: event.target.value });
    }

    // Sends HTTP request to backend server to get or update data for the user that this component is for

  }, {
    key: 'sendRequest',
    value: function sendRequest(request) {
      var _this2 = this;

      var httpReq = new XMLHttpRequest();
      // If request was 'get', uses (possibly newly entered) username in input form rather than username in parent's state
      if (request == 'get') {
        httpReq.open('GET', 'http://localhost:3000/?username=' + this.state.usernameInput.replace(' ', '+') + '&request=' + request);
      } else {
        httpReq.open('GET', 'http://localhost:3000/?username=' + this.props.usernames[this.props.user - 1].replace(' ', '+') + '&request=' + request);
      }
      httpReq.send();

      httpReq.onload = function () {
        var userData = JSON.parse(httpReq.response);

        // If update was successful (backend sets user_id to an empty string if it was unsuccessful)
        if (userData.user_id != '') {
          info.forEach(function (i) {
            return _this2.props.sendInfo(_this2.props.user, i, userData[i]);
          });
          stats.forEach(function (s) {
            return _this2.props.sendStat(_this2.props.user, s.stat, userData[s.stat]);
          });
          _this2.props.updateStatFacts();
          _this2.props.getScoreDiffs(request);

          document.getElementById('backend_error_' + _this2.props.user).style.display = 'none';
          document.getElementById('username_error_' + _this2.props.user).style.display = 'none';
          document.querySelectorAll('#user_' + _this2.props.user + '_section .user_update_status').forEach(function (e) {
            return e.style.display = 'inherit';
          });

          // If update was unsuccessful
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
        }
      };

      // Executes if backend is offline
      httpReq.onerror = function () {
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
            React.createElement('input', { type: 'text', className: 'input_text', id: 'username_' + this.props.user + '_input', value: this.state.usernameInput, onChange: this.updateUsernameInput }),
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
          React.createElement('img', { id: 'user_image_' + this.props.user, src: this.props.image, alt: '' }),
          React.createElement(
            'p',
            { id: 'last_updated_' + this.props.user },
            'Data From:',
            React.createElement('br', null),
            this.props.lastUpdated
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
        React.createElement('hr', null),
        React.createElement(
          'h3',
          null,
          '' + capitalize(this.props.stat)
        ),
        React.createElement(
          'div',
          null,
          React.createElement('div', { className: 'stat_bar stat_1_bar', id: this.props.stat + '_1_bar' }),
          React.createElement(
            'p',
            { className: 'stat_value stat_1_value', id: this.props.stat + '_1' },
            this.props.statValues[0]
          ),
          React.createElement('div', { className: 'stat_bar stat_2_bar', id: this.props.stat + '_2_bar' }),
          React.createElement(
            'p',
            { className: 'stat_value stat_2_value', id: this.props.stat + '_2' },
            this.props.statValues[1]
          )
        ),
        React.createElement(
          'p',
          { className: 'stat_fact', id: this.props.stat + '_fact' },
          this.props.statFact
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
        React.createElement('hr', null),
        React.createElement(
          'h3',
          null,
          '' + capitalize(this.props.title)
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            { className: 'score_diff_score score_diff_score_1', id: 'score_diff_score_' + this.props.id + '_1' },
            this.props.score1,
            '/10'
          ),
          React.createElement('img', { src: this.props.image, alt: '' }),
          React.createElement(
            'p',
            { className: 'score_diff_score score_diff_score_2', id: 'score_diff_score_' + this.props.id + '_2' },
            this.props.score2,
            '/10'
          )
        ),
        React.createElement(
          'p',
          { className: 'score_diff_diff', id: 'score_diff_' + this.props.id + '_diff' },
          'Difference: \xB1',
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
        'title_image': '',
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
        var httpReq = new XMLHttpRequest();
        // If request was 'get', requests old info
        if (request == 'get') {
          httpReq.open('GET', 'http://localhost:3000/?username1=' + this.state.username[0].replace(' ', '+') + '&username2=' + this.state.username[1].replace(' ', '+') + '&request=getdiff');
        } else {
          httpReq.open('GET', 'http://localhost:3000/?username1=' + this.state.username[0].replace(' ', '+') + '&username2=' + this.state.username[1].replace(' ', '+') + '&request=updatediff');
        }
        httpReq.send();

        httpReq.onload = function () {
          var results = JSON.parse(httpReq.response).results;
          // Adds empty entries if fewer than 5
          while (results.length < 5) {
            results.push({
              'title_id': 0,
              'title': '',
              'title_image': '',
              'score_1': 0,
              'score_2': 0,
              'score_difference': 0
            });
          }
          _this6.setState({ 'scoreDiffs': results });
          _this6.updateCSS();
        };

        httpReq.onerror = function () {
          _this6.updateCSS();
        };
      } else {
        this.updateCSS();
      }
    }
  }, {
    key: 'updateCSS',
    value: function updateCSS() {
      // Updates stat bars
      for (var i = 0; i < stats.length; i++) {
        // If a neutral stat, makes bars gray
        if (stats[i].compareType == 0) {
          document.getElementById(stats[i].stat + '_1_bar').style.backgroundColor = '#999';
          document.getElementById(stats[i].stat + '_2_bar').style.backgroundColor = '#999';

          // If not a neutral stat, calculates bar widths and colours
        } else {
          var scale = 50; // Percentage of bar occupied by user 1
          // Prevents division by 0
          if (Number(this.state[stats[i].stat][0]) != 0 || Number(this.state[stats[i].stat][1] != 0)) {
            scale = 1 + 98 * this.state[stats[i].stat][0] / (Number(this.state[stats[i].stat][0]) + Number(this.state[stats[i].stat][1]));
            // If a reversed stat, reverses the bar width
            if (stats[i].compareType == -1) {
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
      if (this.state.username[0] != '' && this.state.username[1] != '') {
        document.getElementById('vs').style.display = 'inherit';
        document.getElementById('stats').style.display = 'inherit';
        [].forEach.call(document.getElementsByClassName('stat_fact'), function (e) {
          return e.style.display = 'inherit';
        });
        document.getElementById('score_diffs').style.display = 'inherit';
        for (var _i3 = 0; _i3 < 5; _i3++) {
          if (this.state.scoreDiffs[_i3].title != '') {
            document.getElementById('score_diff_' + _i3).style.display = 'inherit';
            // Updates score colourrs to be green/red/gray
            if (parseInt(this.state.scoreDiffs[_i3].score_1) > parseInt(this.state.scoreDiffs[_i3].score_2)) {
              document.getElementById('score_diff_score_' + _i3 + '_1').style.color = '#6C6';
              document.getElementById('score_diff_score_' + _i3 + '_2').style.color = '#C66';
            } else if (parseInt(this.state.scoreDiffs[_i3].score_1) < parseInt(this.state.scoreDiffs[_i3].score_2)) {
              document.getElementById('score_diff_score_' + _i3 + '_1').style.color = '#C66';
              document.getElementById('score_diff_score_' + _i3 + '_2').style.color = '#6C6';
            } else {
              document.getElementById('score_diff_score_' + _i3 + '_1').style.color = '#999';
              document.getElementById('score_diff_score_' + _i3 + '_2').style.color = '#999';
            }
          } else {
            // Hides empty score difference entries
            document.getElementById('score_diff_' + _i3).style.display = 'none';
          }
        }
      } else if (this.state.username[0] != '' || this.state.username[1] != '') {
        document.getElementById('vs').style.display = 'none';
        document.getElementById('stats').style.display = 'inherit';
        [].forEach.call(document.getElementsByClassName('stat_fact'), function (e) {
          return e.style.display = 'none';
        });
        document.getElementById('score_diffs').style.display = 'none';
      } else {
        document.getElementById('vs').style.display = 'none';
        document.getElementById('stats').style.display = 'none';
        [].forEach.call(document.getElementsByClassName('stat_fact'), function (e) {
          return e.style.display = 'none';
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
          'div',
          null,
          React.createElement('hr', null)
        ),
        React.createElement(
          'div',
          { id: 'user_sections' },
          React.createElement(
            'h3',
            { id: 'vs' },
            'vs'
          ),
          React.createElement(UserSection, { user: 1, usernames: this.state.username, lastUpdated: this.state.last_updated[0], image: this.state.user_image[0], sendInfo: this.setInfo.bind(this), sendStat: this.setStat.bind(this), updateStatFacts: this.updateStatFacts.bind(this), getScoreDiffs: this.getScoreDiffs.bind(this) }),
          React.createElement(UserSection, { user: 2, usernames: this.state.username, lastUpdated: this.state.last_updated[1], image: this.state.user_image[1], sendInfo: this.setInfo.bind(this), sendStat: this.setStat.bind(this), updateStatFacts: this.updateStatFacts.bind(this), getScoreDiffs: this.getScoreDiffs.bind(this) })
        ),
        React.createElement(
          'div',
          { id: 'stats' },
          React.createElement('hr', null),
          React.createElement(
            'h2',
            null,
            'Stat Face-Off'
          ),
          React.createElement(
            'p',
            { className: 'main_p quote' },
            '"Starting Life From 0.0"'
          ),
          stats.map(function (stat) {
            return React.createElement(Stat, { key: stat.stat, stat: stat.stat, statValues: _this7.state[stat.stat], statFact: _this7.state[stat.stat + '_fact'] });
          })
        ),
        React.createElement(
          'div',
          { id: 'score_diffs' },
          React.createElement('hr', null),
          React.createElement(
            'h2',
            null,
            'Opinion Clash'
          ),
          React.createElement(
            'p',
            { className: 'main_p quote' },
            '"Your Opinion Is Wrong As I Expected"'
          ),
          [].concat(_toConsumableArray(Array(5).keys())).map(function (i) {
            return React.createElement(ScoreDiff, { key: 'scoreDiff' + i, id: i, title: _this7.state.scoreDiffs[i].title, image: _this7.state.scoreDiffs[i].title_image, score1: _this7.state.scoreDiffs[i].score_1, score2: _this7.state.scoreDiffs[i].score_2, diff: _this7.state.scoreDiffs[i].score_difference });
          })
        ),
        React.createElement(
          'div',
          null,
          React.createElement('hr', null)
        )
      );
    }
  }]);

  return Body;
}(React.Component);

ReactDOM.render(React.createElement(Body, null), document.querySelector('#body'));