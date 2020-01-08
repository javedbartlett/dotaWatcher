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


const Game = mongoose.model('Game', gameSchema);

const removeOne = async (serverId) => {
  await Game.remove({}, err => console.log('Game DB wiped'))
  }


const save = async ({server_steam_id, match_id, players, game_time, building_state, radiant_score, dire_score, radiant_lead, last_update_time, average_mmr, game_mode, sort_score, delay, spectators}) => {
  await Game.deleteOne({server_steam_id}, function(err) {
    console.log('collection removed')
  })
  return await Game.create({
    server_steam_id,
    match_id,
    players,
    game_time,
    building_state,
    radiant_score,
    dire_score,
    radiant_lead,
    last_update_time,
    average_mmr,
    game_mode,
    sort_score,
    delay,
    spectators
  })
  .catch(err => {
    console.log('duplicate')
  })
}

const fetch = async (maxRecords = 25) => {
  return await Game.find().sort('-date').exec();
};

module.exports.save = save;
module.exports.fetch = fetch;
module.exports.removeOne = removeOne;
