const request = require('request');
const rp = require('request-promise-native');
const KEY = process.env.TOKEN || require('./config.js').KEY;

const getGames = () => {
   return rp(`https://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v1?key=${KEY}&partner=0`)
}

const getLiveStats = async (serverId) => {
  try {
    return await rp(`https://api.steampowered.com/IDOTA2MatchStats_570/GetRealtimeStats/v1?key=${KEY}&server_steam_id=${serverId}`)
  }
  catch(err) {
    console.log(err,'error at getLiveStats rp')
  }
}
const getMatchDetails = async (matchId) => {
  try {
    let match = await rp(`http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1?key=${KEY}&match_id=${matchId}`)
    let parsedMatch = JSON.parse(match);
    // console.log(parsedMatch.result.radiant_win)
    return parsedMatch.result.radiant_win;
  }
  catch(err) {
    console.log(err,'error at getMatchDetails rp')
  }

}


module.exports.getGames = getGames;
module.exports.getLiveStats = getLiveStats;
module.exports.getMatchDetails = getMatchDetails;
