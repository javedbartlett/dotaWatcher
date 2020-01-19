const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const rp = require('request-promise-native');
const db = require('../database/index.js');
const JSONbig = require('json-bigint');
const merge = require('lodash.merge');
const favicon = require('serve-favicon');
const cors = require('cors');
const {
  saveMatches,
  savePlayers,
  fetch,
  removeAll,
  removeOne,
  fetchHistory,
  fetchHeroHistory,
} = require('../database/Games.js');
const { saveImage, imageFetch } = require('../database/Images.js');
const { getGames, getLiveStats } = require('../helpers/steam.js');
const { playerIdList } = require('./playerIdList.js');

app.use(cors())

app.use(express.static(__dirname + '/../dist'));
app.use(favicon(path.join(__dirname, '../dist', 'Favicon.ico')))

const dist = express.static('dist');

app.use('/players/:id', dist)
app.use('/heroes/:id', dist)


app.get('/api/games', async (req, res) => {
  const games = await fetch();
  res.status(200).send(games);
});

app.get('/api/playerImage/:id', async (req, res) => {
  const id = JSON.parse(req.params.id)
  const playerName = playerIdList[id]
await axios.get(`https://liquipedia.net/dota2/${playerName}`)
  .then((resp) => {
    const $ = cheerio.load(resp.data)
    const image = $('.img-player').attr('src')
    res.send('');
  })
  .catch((err) => res.send('https://www.biiainsurance.com/wp-content/uploads/2015/05/no-image.jpg'))

})

app.get('/api/saveImage/:id', async (req, res) => {
  const id = JSON.parse(req.params.id)
  const imageData = await imageFetch(id)
  .catch(err => console.log('error at image fetch'))
  if (!imageData.length) {
    console.log('Scraping....')
    const playerName = playerIdList[id]
    const cleanPlayerName = playerName.replace(/\s+\d$/, '');
    const resp = await axios.get(`https://liquipedia.net/dota2/${cleanPlayerName}`)
    const $ = cheerio.load(resp.data)
    const image = "https://liquipedia.net/" + $('.image img').attr('src')
    const imageResult = await saveImage(image, id)
    .catch((err) => {
      console.log('error with cheerio thing')
      res.send(err)
    })
    console.log('result',imageResult)
    // const imageBase64 = imageResult[0].img.data.toString('base64').toString('base64');
    const imageBase64 = imageResult.img.data.toString('base64');
    // console.log('image base64 here', imageBase64);
    res.send(imageBase64)
  } else {
    const imageBase64 = imageData[0].img.data.toString('base64');
    // console.log('image here', imageBase64);
    res.send(imageBase64);
  }

})

app.get('/api/playersList', async (req, res) => {
  res.status(200).send(playerIdList);
});

app.get('/api/players/:id', async (req, res) => {
  const id = JSON.parse(req.params.id);
  const games = await fetchHistory(id)
  .catch(err => console.log('error from fetch history'))
  res.send(games);
});
app.get('/api/heroes/:id', async (req, res) => {
  const id = JSON.parse(req.params.id);
  const games = await fetchHeroHistory(id)
  .catch(err => console.log('error from fetch history heroes/:id'))
  const gamesToSend = games.reduce((gameArr, game) => {
    const playerId = game.players.filter(p => p.hero_id === +req.params.id)[0].account_id;
    if (playerIdList[playerId]) {
      gameArr.push(game);
    }

    return gameArr;
  }, []);
  res.send(gamesToSend);
});

app.get('/api/update', async (req, res) => {
  const data = await getGames();
  const dataJson = JSONbig.parse(data);

  if (dataJson.game_list) {
    for (let i = 0; i < dataJson.game_list.length; i++) {
      const game = dataJson.game_list[i];
    if (game.average_mmr > 0 && game.players) {
        const playersInTheGame = game.players
          .map(player => player.account_id)
          .filter(id => id);
        // const keys = Object.keys(playerIdList).map(Number);
        // console.log(keys);
        const proInTheGame =
          playersInTheGame.filter(player =>
            Object.keys(playerIdList)
              .map(p => +p)
              .includes(player),
          ).length > 0;
        if (proInTheGame) {
          const serverId = game.server_steam_id.toString();
          const liveStats = await getLiveStats(serverId)
          if (liveStats) {
          const liveStatsJson = JSONbig.parse(liveStats);
          if (liveStatsJson.teams.length && game.players) {
          for (let i = 0; i <= 10; i++) {
            if (i < 5) {
              await merge(game.players[i], liveStatsJson.teams[0].players[i]);
            } else if (i >= 5) {
              let j = i - 5;
              await merge(game.players[i], liveStatsJson.teams[1].players[j]);
            }
          }
          console.log('pro in this game');
          // console.log(liveStatsJson.match);
          await saveMatches({
            server_steam_id: serverId,
            match_id: game.match_id,
            players: game.players,
            game_time: liveStatsJson.match.game_time,
            game_state: liveStatsJson.match.game_state,
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
        } else {
          removeOne({"server_steam_id": serverId})
        }
      }
        }

    }
    }
    res.end();
  }
});

const update = async () => {
  console.log('updating')
  // await removeAll()
  await rp(`http://localhost:${process.env.PORT||'3222'}/api/update`)
  .catch(err => console.log('error from rp /api/update'))
}
// setInterval(removeAll, 600000);
setInterval(update, 10000);

// app.get('/*', (req,res) =>{
//   res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
// });

const port = process.env.PORT || 3222;
app.listen(port, () => console.log(`listening on port ${port}`));
