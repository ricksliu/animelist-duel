// Component for top of page
class Top extends React.Component {
  render() {
    return (
      <div>
        <h1>AnimeList Duel</h1>
        <h3>"Only the dead have seen the end of anime." -Sun Tzu</h3>
      </div>
    );
  }
}

ReactDOM.render(
  <Top />,
  document.querySelector('#top')
);