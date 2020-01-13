const mongoose = require('mongoose');
const db = require('./index.js')

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
  return await Game.find({"players.account_id": playerId}).exec()
  .catch(err => console.log(err))
}

module.exports.saveMatches = saveMatches;
module.exports.savePlayers = savePlayers;
module.exports.fetch = fetch;
module.exports.fetchHistory = fetchHistory;
module.exports.removeAll = removeAll;
module.exports.removeOne = removeOne;

