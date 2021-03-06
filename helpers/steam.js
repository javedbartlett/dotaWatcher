const request = require('request');
const rp = require('request-promise-native')
const KEY = process.env.TOKEN || require('./config.js').KEY;

const getGames = () => {

  let options = {
    uri: `https://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v1?key=${KEY}&partner=0`,
    headers: {
      'User-Agent': 'Request-Promise'
  },
  family: 4,
  timeout: 3000,
  }

  return rp(options)
}

const getLiveStats = (serverId) => {
    return rp(`https://api.steampowered.com/IDOTA2MatchStats_570/GetRealtimeStats/v1?key=${KEY}&server_steam_id=${serverId}`)
}

const getMatchDetails = async (matchId) => {
  try {
    let match = await rp(`http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1?key=${KEY}&match_id=${matchId}`)
    let parsedMatch = JSON.parse(match);
    return parsedMatch.result.radiant_win;
  }
  catch(err) {
    console.log('error at getMatchDetails rp in steam.js')
  }

}


module.exports.getGames = getGames;
module.exports.getLiveStats = getLiveStats;
module.exports.getMatchDetails = getMatchDetails;
