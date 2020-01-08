const mongoose = require('mongoose');
const db = require('./index.js')

const gameSchema = mongoose.Schema({
  // TODO: your schema here!
  server_steam_id: {type: Number, unique: true},
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

const Players = mongoose.Schema({
  _id: Number,
  Matches: [ Number ]
})

const Game = mongoose.model('Game', gameSchema);

const removeOne = async (serverId) => {
  await Game.remove({}, err => console.log('Game DB wiped'))
  }


const save = async data => {
  const { match_id } = data;

  return Game.findOneAndUpdate({ match_id }, data, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
};

const fetch = async (maxRecords = 25) => {
  return await Game.find().sort('-date').exec();
};

module.exports.save = save;
module.exports.fetch = fetch;
module.exports.removeOne = removeOne;
