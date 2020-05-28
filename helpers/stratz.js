const request = require('request');
const rp = require('request-promise-native')

const getLanes = async (id) => {
  // let options = {
  //   uri: `https://api.stratz.com/api/v1/match?matchId=${id}`,
  //   headers: {
  //     'User-Agent': 'Request-Promise'
  // },
  // family: 4,
  // timeout: 3000,
  // }
  // console.log( rp(options)

  try {
    let match = await rp(`https://api.stratz.com/api/v1/match?matchId=${id}`)
    let parsedMatch = JSON.parse(match);
    return parsedMatch[0].players;
  }
  catch(err) {
    console.log('error at getLanes rp in stratz.js')
  }

}

module.exports.getLanes = getLanes;