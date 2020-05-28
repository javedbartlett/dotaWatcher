const mongoose = require('mongoose');
const db = require('./index.js')
const { playerIdList } = require('../server/playerIdList.js');
const { getMatchDetails } = require('../helpers/steam.js');
const { getLanes } = require('../helpers/stratz.js');

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
  buildings: [],
  areLanesUpdated: Boolean,

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

return await Game.findOneAndUpdate({ match_id }, data, {
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


// const getMoreDetails = async () => {
//   let allData = await Game.find().exec()
//   .catch(err => console.log(err))
//   console.log(allData.length)
//   for (let i = 0; i < allData.length; i++) {
//     let game = allData[i];
//     const { match_id } = game;

//     if (game.players === null) {
//       await Game.findOneAndDelete({ match_id })
//       console.log(`deleted ${match_id}, ${i}/${allData.length}`)

//     } else if (game.radiant_win) {
//       if (!game.players[0].lane && !game.players[0].lane === 0) {
//       let laneDetails = await getLanes(game.match_id)
//       .catch(err => console.log('error with stratz getLanes in Games.js'))
//       let data = { players: laneDetails }
//       await Game.findOneAndUpdate({ match_id }, data, {
//         upsert: true,
//         new: true,
//         setDefaultsOnInsert: true,
//         strict: false,
//       })
//       console.log(`added index: ${i}/${allData.length} `)
//       await Game.findOneAndUpdate({ match_id }, { areLanesUpdated: true },  {
//         upsert: true,
//         new: true,
//         setDefaultsOnInsert: true,
//         strict: false,
//       })
//     }
//     }
//   }
// }

// getMoreDetails();

const getDetails = async () => {
  let allData = await Game.find(
  {"createdAt":{$gt:new Date(Date.now() - 366*60*60 * 1000)}}).exec()
  .catch(err => console.log(err))
  console.log(allData.length)
  for (let i = 0; i < allData.length; i++) {
    let game = allData[i];
    const { match_id } = game;
    // if (game.players === null) {
    //   await Game.findOneAndDelete({ match_id })
    //   console.log(`deleted ${match_id}, ${i}/${allData.length}`)

    // } else
    if (game.radiant_win !== null) {
      if (game.players[0].lane == null) {
      let laneDetails = await getLanes(game.match_id)
      .catch(err => console.log('error with stratz getLanes in Games.js'))
      let data = { players: laneDetails }
      await Game.findOneAndUpdate({ match_id }, data, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        strict: false,
      })
      console.log(`added index: ${i}/${allData.length} `)
      await Game.findOneAndUpdate({ match_id }, { areLanesUpdated: true },  {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        strict: false,
      })
    }
    }

    if (game.radiant_win === undefined) {
      // console.log(game.match_id)
      const radiant_win =  await getMatchDetails(game.match_id)
      .catch(err => console.log('error with getMatchDetails in Games.js'))
      // console.log(radiant_win)
      if (radiant_win !== undefined) {
        const data = { radiant_win: radiant_win }
        await Game.findOneAndUpdate({ match_id }, data, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          strict: false,
        })
      } else if (radiant_win === undefined) {
          // console.log(game.match_id)
          // console.log('game not found')
      }
    }
  }
}

getDetails();

const removeOldGames = () => {

}

const removeOldTBDGames = () => {

}

module.exports.saveMatches = saveMatches;
module.exports.savePlayers = savePlayers;
module.exports.fetch = fetch;
module.exports.fetchHistory = fetchHistory;
module.exports.fetchHeroHistory = fetchHeroHistory;
module.exports.removeAll = removeAll;
module.exports.removeOne = removeOne;
module.exports.getDetails = getDetails;
