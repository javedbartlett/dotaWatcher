const mongoose = require('mongoose');
const db = require('./index.js')
const { playerIdList } = require('../server/playerIdList.js');

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

// get win/loss function (set interval 30 seconds)
// fetchGames
 // iterate over games
 // if !game.radiant_win.length
  // const moreDetails = GetMatchDetails(game.matchID)  -> Make getMatchDetails in helpers
  // if (moreDetails.length)
   // Game.findOneAndUpdate{match_id, {radiant_win: moreDetails.radiant_win}}

// maybe fetchGames lastupdated between 15 mins - 60 mins after first round.

module.exports.saveMatches = saveMatches;
module.exports.savePlayers = savePlayers;
module.exports.fetch = fetch;
module.exports.fetchHistory = fetchHistory;
module.exports.fetchHeroHistory = fetchHeroHistory;
module.exports.removeAll = removeAll;
module.exports.removeOne = removeOne;
