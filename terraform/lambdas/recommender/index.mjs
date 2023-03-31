import bent from "bent";
import { maximizeScore } from "./combinatorialOptimization.mjs";

const getEncryptedSummonerURL = process.env.RIOT_GET_SUMMONER_INFO_URL;
const getSummonerMasteriesURL = process.env.RIOT_GET_SUMMONER_MASTERIES_URL;
const recommenderMode = process.env.RECOMMENDER_MODE;
const cachedSummonersInfo = {};
const cachedSummonerMasteries = {};

export const handler = async (event) => {
  const { summonerInfo, gameSession } = JSON.parse(event.body);

  // Get Encrypted Summoner Info
  console.log("SummonerInfo consist of this number of Summoners: ", summonerInfo.length);
  console.log("SummonerInfo: ", summonerInfo);
  const encryptedSummonersInfo = await Promise.all(summonerInfo.map(async (obj) => {
    const displayName = obj["displayName"];
    console.log("displayName of a Summoner is: ", displayName);
    if (!cachedSummonersInfo[displayName]) { // Name not in Cache. Encode and Query Riot API
      console.log("cachedSummonersInfo not in cache. Querying RIOT API", cachedSummonersInfo);
      const encodedSummonerName = encodeURIComponent(displayName);
      const getEncryptedSummonerInfo = bent(
        getEncryptedSummonerURL + encodedSummonerName,
        "GET",
        { "X-Riot-Token": process.env.RIOT_API_KEY },
        "json",
        200
      );
      const encryptedSummonerInfo = await getEncryptedSummonerInfo();
      console.log(`Adding to cache Summoner ${displayName} info:`, encryptedSummonerInfo);
      cachedSummonersInfo[displayName] = encryptedSummonerInfo;
    } else {
      console.log(`Summoner Info ${displayName} found in cache. Saved 1 API call!`);
    }
    return cachedSummonersInfo[displayName];
  }));

  // Fetch Summoner Masteries
  const summonerMasteriesSet = await Promise.all(encryptedSummonersInfo.map(async (info) => {
    const summonerName = info["name"];
    if (!cachedSummonerMasteries[summonerName]) {
      const encryptedSummonerId = info["id"];
      console.log(`Summoner mastery not in cache. Querying RIOT API for Summoner ${summonerName} using encrypted SummonerId ${encryptedSummonerId} `);
      const getSummonerMasteries = bent(
        getSummonerMasteriesURL + encryptedSummonerId,
        "GET",
        { "X-Riot-Token": process.env.RIOT_API_KEY },
        "json",
        200
      );
      const summonerMasteries = await getSummonerMasteries();
      console.log(`Adding to cache Summoner ${summonerName} masteries:`, summonerMasteries);
      cachedSummonerMasteries[summonerName] = summonerMasteries;
    } else {
      console.log(`Summoner mastery for ${summonerName} found in cache. Saved 1 API call!`);
    }
    return cachedSummonerMasteries[summonerName];
  }));

  // Calculate Available Champs
  const availableChamps = [];
  if (gameSession.benchEnabled) {
    gameSession.benchChampions.forEach(bc => availableChamps.push(bc.championId));
  } else {
    console.log("NO benchEnabled PROPERTY IN GAME SESSION DATA")
  }
  gameSession.myTeam.forEach(pick => availableChamps.push(pick.championId));

  let recommended;
  /** Simple GameSession Champ Recommender:
   * Given the champions Ids picked( or available in Bench), find the most experienced Summoner for it. It could recommend the same Summoner
   * on all champs if that's what Masteries say.
   */
  if (recommenderMode === "simple") {
    recommended = availableChamps.map((championId) => {
      const maxMastery = summonerMasteriesSet.flat().filter(masteries => masteries["championId"] === championId).reduce((max, current) => (max.championLevel * 10000 + max.championPoints) > (current.championLevel * 10000 + current.championPoints) ? max : current);
      const summonerInfo = Object.values(cachedSummonersInfo).find(obj => obj.id === maxMastery.summonerId);
      console.log(`Champion ${championId} most experienced player is: `, summonerInfo.name);
      return {
        championKey: championId,
        summonerName: summonerInfo.name
      };
    });
    /** Mastery Optimization Champ recommender:
     * Given an X number of champs (the pool) and smaller number of summoners,
     * It will prioritize a team of Summoners with No repetition of Champions and optimizing for a total Champion Mastery score in the team.
     */
  } else if (recommenderMode === "mastery") {
    let filteredSet = []
    summonerMasteriesSet.forEach((summonerMasteries) =>{
      filteredSet.push(availableChamps.map((championId) => {
        const masteryObjForChamp = summonerMasteries.find( (masteryObj) => masteryObj.championId === championId)
        console.log("Applicable Summoner masteries are: ", masteryObjForChamp)
        const championPoints = masteryObjForChamp ? (masteryObjForChamp.championLevel * 10000 + masteryObjForChamp.championPoints) : 0
        const summonerId = masteryObjForChamp ? masteryObjForChamp.summonerId : "000000" /*value should never be picked when doing a Max score.*/
        return {
          championId,
          championPoints,
          summonerId: summonerId
        }
      }))
    })
    recommended = maximizeScore(filteredSet).map((recommendation)=>{
      const summonerInfo = Object.values(cachedSummonersInfo).find(obj => obj.id === recommendation.summonerId);
      return {
        championKey:recommendation.championId,
        summonerName:summonerInfo.name
      }
    })
  } else {
    console.log("Environmental variable RECOMMENDER_MODE not recognized: ", recommenderMode);
  }
  console.log("Return Recommendation.", { data: recommended });
  return {
    "isBase64Encoded": false,
    "statusCode": 200,
    "body": JSON.stringify({ data: recommended })
  };
};