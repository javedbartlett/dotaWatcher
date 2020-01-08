const express = require('express');
const app = express();
const request = require('request');
const rp = require('request-promise-native');
const db = require('../database/index.js');
const save = require('../database/Games.js').save;
const fetch = require('../database/Games.js').fetch;
const removeOne = require('../database/Games.js').removeOne;
const steam = require('../helpers/steam.js');
const playerIdList = require('./playerIdList.js').playerIdList;

app.use(express.static(__dirname + '/../dist'));

app.get('/api/games', async (req, res) => {
  const games = await fetch();
  res.status(200).send(games);
});

app.get('/api/players', async (req, res) => {
  res.status(200).send(playerIdList);
});

app.get('/api/update', async (req, res) => {
  const data = await steam.getGames();
  const dataJson = JSON.parse(data);

  for (let i = 0; i < dataJson.game_list.length; i++) {
    const game = dataJson.game_list[i];
    if (game.players) {
    const playersInTheGame = game.players
      .map(player => player.account_id)
      .filter(id => id);
    // const keys = Object.keys(playerIdList).map(Number);
    // console.log(keys);
    const proInTheGame =
      playersInTheGame.filter(player =>
        Object.keys(playerIdList).map(p => +p).includes(player),
      ).length > 0;
    if (proInTheGame) {
      console.log('pro in this game');
      await save({
        server_steam_id: game.server_steam_id,
        match_id: game.match_id,
        players: game.players,
        game_time: game.game_time,
        building_state: game.building_state,
        radiant_score: game.radiant_score,
        dire_score: game.dire_score,
        radiant_lead: game.radiant_lead,
        last_update_time: game.last_update_time,
        average_mmr: game.average_mmr,
        game_mode: game.game_mode,
        sort_score: game.sort_score,
        delay: game.delay,
        spectators: game.spectators,
      });
    }
  }
  }
  res.end();
});

const update = async () => {
  console.log('updating')
  await removeOne()
  await rp('http://localhost:3222/api/update')
  .catch(err => console.log(err, 'error from fetch'));
}
setInterval(update, 10000)
const port = process.env.PORT || 3222;
app.listen(port, () => console.log(`listening on port ${port}`));
