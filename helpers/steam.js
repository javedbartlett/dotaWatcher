const request = require('request');
const rp = require('request-promise-native');
const KEY = require('./config.js').KEY;

const getGames = async () => {
  return await rp(`https://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v1?key=${KEY}&partner=0`)
  .catch(err => console.log(err, 'error at getGames function'));
}

const getLiveStats = async (serverId) => {
  return await rp(`https://api.steampowered.com/IDOTA2MatchStats_570/GetRealtimeStats/v1?key=${KEY}&server_steam_id=${serverId}`)
  .catch(err => console.log(err, 'error at getLiveStats function'));
}

module.exports.getGames = getGames;
module.exports.getLiveStats = getLiveStats;
