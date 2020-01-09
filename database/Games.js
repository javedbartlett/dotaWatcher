const mongoose = require('mongoose');
const db = require('./index.js')

const gameSchema = mongoose.Schema({
  // TODO: your schema here!
  server_steam_id: {type: String, unique: true},
  match_id: { type: Number, unique: true },
  players: [],
  game_time: Number,
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
  date: { type: Date, default: Date.now }
});

// get original response
  // iterate through original response
    // for each iteration
      //do an API call using server_id
        // if response
          // iterate through players
            // merge players array in new response to players array in old



// New API call to steam
  // merge response with old data

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
  await Game.remove(serverId, err => console.log('Game DB wiped'))
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
  return await Game.find().sort('-date').exec()
  .catch(err => console.log('err with Game.find - fetch'))
};

module.exports.saveMatches = saveMatches;
module.exports.savePlayers = savePlayers;
module.exports.fetch = fetch;
module.exports.removeAll = removeAll;
module.exports.removeAll = removeOne;
