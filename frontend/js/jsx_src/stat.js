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
class Stat extends React.Component {
  constructor(props) {
    super(props);
    this.stat = props.stat;

    this.state = {
      stat_1: 0,
      stat_2: 0
    };
  }

  render() {
    return (
      <div>
        <h3>{`${processText(this.stat)}:`}</h3>
        <div className='stat_1' id={`${this.stat}_1_bar`}><p id={`${this.stat}_1`}>{this.state.stat_1}</p></div>
        <div className='stat_2' id={`${this.stat}_2_bar`}><p id={`${this.stat}_2`}>{this.state.stat_2}</p></div>
      </div>
    );
  }
}

// Adds Stat components
for (var i = 0; i < stats.length; i++) {
  ReactDOM.render(
    <Stat stat={stats[i]}/>,
    document.querySelector(`#${stats[i]}`)
  );
}
