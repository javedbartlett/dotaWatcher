const mongoose = require('mongoose');
const db = require('./index.js')
const { playerIdList } = require('../server/playerIdList.js');
const { getMatchDetails } = require('../helpers/steam.js');

const gameSchema = mongoose.Schema({
  // TODO: your schema here!
  server_steam_id: {type: String, unique: true},
  match_id: { type: Number, unique: true },
  players: [],
  game_time: Number,
  game_state: Number,
  building_state: Number,
  radiant_score: Number,
  dire_score: Number,
  radiant_lead: Number,
  last_update_time: Number,
  average_mmr: Number,
  game_mode: Number,
  sort_score: Number,
  delay: Number,
  spectators: Number,
  radiant_win: Boolean,

}
,{timestamps: true }
);

const playerSchema = mongoose.Schema({
  player_id: Number,
  Matches: [ Number ]
})

const Game = mongoose.model('Game', gameSchema);
const Players = mongoose.model('Players', playerSchema);

const removeAll = async () => {
  await Game.remove({}, err => console.log('Game DB wiped'))
  }
const removeOne = async (serverId) => {
  await Game.deleteOne(serverId, err => console.log('RemoveOne worked!!!'))
  }

const saveMatches = async data => {
  const { match_id } = data;

  await Game.findOneAndUpdate({ match_id }, data, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  })
  .catch(err => console.log('err with findOneAndUpdate - saveMatches'))
};

const savePlayers = async data => {
  const { match_id } = data;

  await Players.findOneAndUpdate({ match_id }, match_id, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  })
  .catch(err => console.log('err with findOneAndUpdate - savePlayers'))
}

const fetch = async (maxRecords = 25) => {
  var d = new Date();
  d.setMinutes(d.getMinutes()-2);
  return await Game.find({updatedAt: {$gte: d}}).sort('-date').exec()
  .catch(err => console.log('err with Game.find - fetch'))
};

const fetchHistory = async (playerId) => {
  const games = await Game.find({"players.account_id": playerId}).exec()
  .catch(err => console.log(err))

  return games.reverse();
}
const fetchHeroHistory = async (heroId) => {
  const games = await Game.find({$and:[{"players.hero_id": heroId},
  {"createdAt":{$gt:new Date(Date.now() - 336*60*60 * 1000)}}]}).exec()
  .catch(err => console.log(err))
  return games.reverse();
}

const getDetails = async () => {
  let allData = await Game.find(
  {"createdAt":{$gt:new Date(Date.now() - 2*60*60 * 1000)}}).exec()
  .catch(err => console.log(err))
  for (let i = 0; i < allData.length; i++) {
    let game = allData[i];
    console.log(game.match_id)
    if (game.radiant_win === undefined) {
      // console.log(game.match_id)
      const radiant_win =  await getMatchDetails(game.match_id)
      console.log(radiant_win)
      if (radiant_win !== undefined) {
        const { match_id } = game;
        const data = { radiant_win: radiant_win }
        await Game.findOneAndUpdate({ match_id }, data, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          strict: false,
        })
      } else if (radiant_win === undefined) {
          // console.log(game.match_id)
          console.log('game not found')
      }
    }
  }
}

// const testFunc = async () => {
//   let test = await Game.find({match_id: 5202279188}).exec();
//   console.log(test[0].radiant_win)
// }
// testFunc()


// get win/loss function (set interval 30 seconds)
// fetchGames
 // iterate over games
 // if !game.radiant_win.length
  // const moreDetails = GetMatchDetails(game.matchID)  -> Make getMatchDetails in helpers
  // if (moreDetails.length)
   // Game.findOneAndUpdate{match_id, {radiant_win: moreDetails.radiant_win}}

// maybe fetchGames lastupdated between 15 mins - 60 mins after first round.

// result.radiant_win

// {
//   players: [
//     [Object], [Object],
//     [Object], [Object],
//     [Object], [Object],
//     [Object], [Object],
//     [Object], [Object]
//   ],
//   _id: 5e1eb80a3d4e0c61516aa5f3,
//   match_id: 5197552181,
//   __v: 0,
//   average_mmr: 7419,
//   building_state: 4785955,
//   createdAt: 2020-01-15T06:58:18.577Z,
//   delay: 120,
//   dire_score: 45,
//   game_mode: 22,
//   game_state: 5,
//   game_time: 1475,
//   last_update_time: 1579073280,
//   radiant_lead: -18399,
//   radiant_score: 22,
//   server_steam_id: '90131888948971523',
//   sort_score: 8031,
//   spectators: 112,
//   updatedAt: 2020-01-15T07:29:11.908Z
// },

module.exports.saveMatches = saveMatches;
module.exports.savePlayers = savePlayers;
module.exports.fetch = fetch;
module.exports.fetchHistory = fetchHistory;
module.exports.fetchHeroHistory = fetchHeroHistory;
module.exports.removeAll = removeAll;
module.exports.removeOne = removeOne;
module.exports.getDetails = getDetails;
