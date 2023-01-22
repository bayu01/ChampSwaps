export const getMyTeamSummonerPuuids = function ({ myTeam }) {
  if (!Array.isArray(myTeam)) {
    throw new Error(
      "Expected gameSession object to contain a myTeam Array property"
    );
  }
  return myTeam.map((obj) => obj["puuid"]);
};
