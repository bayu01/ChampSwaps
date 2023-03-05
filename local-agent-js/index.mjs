import * as dotenv from "dotenv";
dotenv.config();
import clipboard from "clipboardy";
import { createWebSocketConnection } from "league-connect";
import {
  eventlogger,
  sessionlogger,
  lcuResponselogger,
  lolChatlogger,
} from "./logger.mjs";
import { authenticate, createHttp1Request } from "league-connect";
import { getMyTeamSummonerPuuids } from "./gameSessionParser.mjs";
import { getSummonerNames } from "./lolSummonerParser.mjs";
import bent from "bent";
import champions from "./champions.mjs";
let cachedRecommended = [];

///////////// Uncomment Code to Send Test Event at Plugin Start ///////
// import gameSession from "./testData/gameSession.js";
// import summonerInfo from "./testData/summonerInfo.js";
//
// try {
//   const post = bent(
//     process.env.LAMBDA_ENDPOINT_URL,
//     "POST",
//     { "x-api-key": process.env.ENDPOINT_API_KEY },
//     "json",
//     200
//   );
//   const response = await post("", { gameSession, summonerInfo });
//   console.log("lambda response ", response);
//   const recommendedChamps = response.data.map(
//     ({ championKey, summonerName }) => {
//       const champInfo = Object.values(champions.data).find(
//         (champInfo) => champInfo.key === championKey.toString()
//       );
//       return `Recomendado:${champInfo.name}->${summonerName}`;
//     }
//   );
//   console.log(recommendedChamps);
//   cachedRecommended = recommendedChamps;
// } catch (error) {
//   console.log("Error during Recommender(Test Data)", error);
// }
/////////////////////////
/////////////////////////

const credentials = await authenticate();
const ws = await createWebSocketConnection({
  authenticationOptions: {
    // any options that can also be called to authenticate()
    awaitConnection: true,
  },
});

ws.on("message", (message) => {
  // Subscribe to any websocket event
  const messageString = message.toString();
  //remove surrounding envelope
  const extractedJson = messageString.slice(20, messageString.length - 1);
  if (!extractedJson) {
    // Some received socket events are empty.
    return;
  }
  const parsedJson = JSON.parse(extractedJson);
  if (!parsedJson.uri) {
    throw new Error(
      "Received new event without uri! Must react and potentially account for it"
    );
  }
  eventlogger.info({ uri: parsedJson.uri, data: parsedJson });

  if (parsedJson.uri.startsWith("/lol-chat/v1/conversations/")) {
    try {
      lolChatlogger.info(parsedJson);
      const { data } = parsedJson;
      if (!data) {
        return;
      }
      if (data.lastMessage && data.lastMessage.body === "bench") {
        clipboard.writeSync(JSON.stringify(cachedRecommended));
      }
    } catch (error) {
      Error.captureStackTrace(error);
      console.log("Error during lol-chat processing", error.stack);
    }
  }
});

ws.subscribe("/lol-champ-select/v1/session", async (data) => {
  if (!data) {
    throw new Error(
      "a /lol-champ-select/v1/session data object should always be present"
    );
  }
  sessionlogger.info(data);
  const myTeamPuuids = getMyTeamSummonerPuuids(data);

  // QUERY LOCAL LCU ENDPOINTS FOR SUMMONER NAMES
  try {
    if (
      !myTeamPuuids ||
      myTeamPuuids.length < 1 ||
      myTeamPuuids[0].length < 1
    ) {
      console.log(
        "First puuid was not a valid puuid: skip processing.",
        myTeamPuuids
      );
      return;
    }
    const summonersResponse = await createHttp1Request(
      {
        method: "POST",
        url: "lol-summoner/v2/summoners/puuid",
        body: myTeamPuuids,
      },
      credentials
    );
    lcuResponselogger.info(summonersResponse.json());
    const summonerNames = getSummonerNames(summonersResponse.json());
    lcuResponselogger.info(summonerNames);

    // SEND DATA TO LAMBDA
    const post = bent(
      process.env.LAMBDA_ENDPOINT_URL,
      "POST",
      { "x-api-key": process.env.ENDPOINT_API_KEY },
      "json",
      200
    );
    const response = await post("", {
      gameSession: data,
      summonerInfo: summonersResponse.json(),
    });
    // Translate championKey to champion Name
    const recommendedChamps = response.data.map(
      ({ championKey, summonerName }) => {
        const champInfo = Object.values(champions.data).find(
          (champInfo) => champInfo.key === championKey.toString()
        );
        return `${champInfo.name}->${summonerName}`;
      }
    );
    console.log(recommendedChamps);
    cachedRecommended = recommendedChamps;
    clipboard.writeSync("ChampSwaps:\n" + cachedRecommended.join("\n"));
  } catch (error) {
    Error.captureStackTrace(error);
    console.log("Error during Recommender", error.stack);
  }
});
