import React from 'react';
import ReactDOM from 'react-dom';
import GameList from './components/GameList';
import Header from './components/Header';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import './styles.css';
import '@babel/polyfill';

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

const trackingId = "UUA-156051540-1";
ReactGA.initialize(trackingId);
ReactGA.set({
  userId: auth.currentUserId(),
})

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      players: {},
    };
  }

  componentDidMount() {
    this.loadGames();
    this.loadPlayers();
    this.interval = setInterval(() => {
      this.loadGames();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async loadGames() {
    const response = await fetch('/api/games');
    const myJson = await response.json();
    const sortedJson = myJson.sort((a, b) =>
      a.spectators > b.spectators ? -1 : 1,
    );
    this.setState({ games: sortedJson });
  }

  async loadPlayers() {
    const response = await fetch('/api/players');
    const myJson = await response.json();
    this.setState({ players: myJson });
  }

  render() {
    return (
      <Router history={history}>
        <div>
          <Header />
          <GameList players={this.state.players} data={this.state.games} />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
