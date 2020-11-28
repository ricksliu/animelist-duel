var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

// Component for displaying a stat

var Stat = function (_React$Component) {
  _inherits(Stat, _React$Component);

  function Stat(props) {
    _classCallCheck(this, Stat);

    var _this = _possibleConstructorReturn(this, (Stat.__proto__ || Object.getPrototypeOf(Stat)).call(this, props));

    _this.stat = props.stat;

    _this.state = {
      stat_1: 0,
      stat_2: 0
    };
    return _this;
  }

  _createClass(Stat, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          processText(this.stat) + ':'
        ),
        React.createElement(
          'div',
          { className: 'stat_1', id: this.stat + '_1_bar' },
          React.createElement(
            'p',
            { id: this.stat + '_1' },
            this.state.stat_1
          )
        ),
        React.createElement(
          'div',
          { className: 'stat_2', id: this.stat + '_2_bar' },
          React.createElement(
            'p',
            { id: this.stat + '_2' },
            this.state.stat_2
          )
        )
      );
    }
  }]);

  return Stat;
}(React.Component);

// Adds Stat components


for (var i = 0; i < stats.length; i++) {
  ReactDOM.render(React.createElement(Stat, { stat: stats[i] }), document.querySelector('#' + stats[i]));
}