import { getMyTeamSummonerPuuids } from "./gameSessionParser.mjs";

describe("game session parser", () => {
    describe("myTeam parser", () => {
        const mockPuuid1 = "some-puuuid1";
        const mockPuuid2 = "some-puuuid2";
        const mockPuuid3 = "some-puuuid3";
        const mockPuuid4 = "some-puuuid4";
        const mockPuuid5 = "some-puuuid5";
        const mockGameSessionObject = {
            actions: [],
            allowBattleBoost: true,
            allowDuplicatePicks: false,
            allowLockedEvents: false,
            allowRerolling: true,
            allowSkinSelection: true,
            bans: {},
            benchChampions: [],
            benchEnabled: true,
            boostableSkinCount: 1,
            chatDetails: {},
            counter: 13,
            entitledFeatureState: {},
            gameId: 123123123123,
            hasSimultaneousBans: true,
            hasSimultaneousPicks: true,
            isCustomGame: false,
            isSpectating: false,
            localPlayerCellId: 3,
            lockedEventIndex: -1,
            myTeam: [
                {
                    puuid: mockPuuid1,
                    assignedPosition: "",
                    cellId: 0,
                    championId: 54,
                    championPickIntent: 0,
                    entitledFeatureType: "NONE",
                    nameVisibilityType: "VISIBLE",
                    obfuscatedPuuid: "",
                    obfuscatedSummonerId: 0,
                    selectedSkinId: 54006,
                    spell1Id: 14,
                    spell2Id: 4,
                    summonerId: 105596,
                    team: 1,
                    wardSkinId: -1,
                },
                {
                    puuid: mockPuuid2,
                    assignedPosition: "",
                    cellId: 1,
                    championId: 16,
                    championPickIntent: 0,
                    entitledFeatureType: "NONE",
                    nameVisibilityType: "VISIBLE",
                    obfuscatedPuuid: "",
                    obfuscatedSummonerId: 0,
                    selectedSkinId: 16006,
                    spell1Id: 32,
                    spell2Id: 4,
                    summonerId: 3992044,
                    team: 1,
                    wardSkinId: -1,
                },
                {
                    puuid: mockPuuid3,
                    assignedPosition: "",
                    cellId: 2,
                    championId: 45,
                    championPickIntent: 0,
                    entitledFeatureType: "NONE",
                    nameVisibilityType: "VISIBLE",
                    obfuscatedPuuid: "",
                    obfuscatedSummonerId: 0,
                    selectedSkinId: 45032,
                    spell1Id: 4,
                    spell2Id: 14,
                    summonerId: 960617,
                    team: 1,
                    wardSkinId: -1,
                },
                {
                    puuid: mockPuuid4,
                    assignedPosition: "",
                    cellId: 3,
                    championId: 48,
                    championPickIntent: 0,
                    entitledFeatureType: "NONE",
                    nameVisibilityType: "VISIBLE",
                    obfuscatedPuuid: "",
                    obfuscatedSummonerId: 0,
                    selectedSkinId: 48004,
                    spell1Id: 32,
                    spell2Id: 14,
                    summonerId: 17260143,
                    team: 1,
                    wardSkinId: 1,
                },
                {
                    puuid: mockPuuid5,
                    assignedPosition: "",
                    cellId: 4,
                    championId: 14,
                    championPickIntent: 0,
                    entitledFeatureType: "NONE",
                    nameVisibilityType: "VISIBLE",
                    obfuscatedPuuid: "",
                    obfuscatedSummonerId: 0,
                    selectedSkinId: 14000,
                    spell1Id: 4,
                    spell2Id: 32,
                    summonerId: 94110,
                    team: 1,
                    wardSkinId: -1,
                },
            ],
            pickOrderSwaps: [],
            recoveryCounter: 0,
            rerollsRemaining: 1,
            skipChampionSelect: false,
            theirTeam: [],
            timer: {},
            trades: [],
        };
        it("extracts all puuids from objects Array", () => {
            const response = getMyTeamSummonerPuuids(mockGameSessionObject);

            expect(response).toEqual([
                mockPuuid1,
                mockPuuid2,
                mockPuuid3,
                mockPuuid4,
                mockPuuid5,
            ]);
        });
    });
});