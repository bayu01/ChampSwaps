export const getSummonerNames = function (summonerResponse) {
  if (!Array.isArray(summonerResponse)) {
    throw new Error("Expected summonerResponse object to be an Array");
  }
  return summonerResponse.map((obj) => obj["displayName"]);
};
