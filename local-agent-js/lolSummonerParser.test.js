import { getSummonerNames } from "./lolSummonerParser.mjs";

describe("lol summoner parser", function () {
    describe("get summoner names", () => {
        const mockSummonerName1 = "SummonerName1";
        const mockSummonerName2 = "SummonerName2";
        const mockSummonerName3 = "SummonerName3";
        const mockSummonerName4 = "SummonerName4";
        const mockSummonerName5 = "SummonerName5";
        const mockLolSummonersResponse = [
            {
                accountId: 123123123,
                displayName: mockSummonerName1,
                internalName: "mockInternalName",
                nameChangeFlag: false,
                percentCompleteForNextLevel: 53,
                privacy: "PUBLIC",
                profileIconId: 4884,
                puuid: "123123123123123123",
                rerollPoints: {},
                summonerId: 123123123,
                summonerLevel: 518,
                unnamed: false,
                xpSinceLastLevel: 1836,
                xpUntilNextLevel: 3456,
            },
            {
                accountId: 123123123,
                displayName: mockSummonerName2,
                internalName: "mockInternalName",
                nameChangeFlag: false,
                percentCompleteForNextLevel: 53,
                privacy: "PUBLIC",
                profileIconId: 4884,
                puuid: "123123123123123123",
                rerollPoints: {},
                summonerId: 123123123,
                summonerLevel: 518,
                unnamed: false,
                xpSinceLastLevel: 1836,
                xpUntilNextLevel: 3456,
            },
            {
                accountId: 123123123,
                displayName: mockSummonerName3,
                internalName: "mockInternalName",
                nameChangeFlag: false,
                percentCompleteForNextLevel: 53,
                privacy: "PUBLIC",
                profileIconId: 4884,
                puuid: "123123123123123123",
                rerollPoints: {},
                summonerId: 123123123,
                summonerLevel: 518,
                unnamed: false,
                xpSinceLastLevel: 1836,
                xpUntilNextLevel: 3456,
            },
            {
                accountId: 123123123,
                displayName: mockSummonerName4,
                internalName: "mockInternalName",
                nameChangeFlag: false,
                percentCompleteForNextLevel: 53,
                privacy: "PUBLIC",
                profileIconId: 4884,
                puuid: "123123123123123123",
                rerollPoints: {},
                summonerId: 123123123,
                summonerLevel: 518,
                unnamed: false,
                xpSinceLastLevel: 1836,
                xpUntilNextLevel: 3456,
            },
            {
                accountId: 123123123,
                displayName: mockSummonerName5,
                internalName: "mockInternalName",
                nameChangeFlag: false,
                percentCompleteForNextLevel: 53,
                privacy: "PUBLIC",
                profileIconId: 4884,
                puuid: "123123123123123123",
                rerollPoints: {},
                summonerId: 123123123,
                summonerLevel: 518,
                unnamed: false,
                xpSinceLastLevel: 1836,
                xpUntilNextLevel: 3456,
            },
        ];
        it("should get the list of displayNames", () => {
            const response = getSummonerNames(mockLolSummonersResponse);
            expect(response).toEqual([
                mockSummonerName1,
                mockSummonerName2,
                mockSummonerName3,
                mockSummonerName4,
                mockSummonerName5,
            ]);
        });
    });
});
