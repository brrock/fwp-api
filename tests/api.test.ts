import { describe, test, expect, beforeAll } from "bun:test";
import { FootballWebPages } from "../dist/index.mjs";

const api = new FootballWebPages();

describe("Vidiprinter", () => {
  test("getVidiprinterConfig returns competitions", async () => {
    const config = await api.getVidiprinterConfig();
    expect(config.allCompetitions.length).toBeGreaterThan(100);
    expect(config.enabledCompetitions.length).toBeGreaterThan(10);
  });

  test("getVidiprinter returns matches", async () => {
    const matches = await api.getVidiprinter();
    expect(matches.length).toBeGreaterThan(0);
  });

  test("getVidiprinter filters by competition", async () => {
    const matches = await api.getVidiprinter([1]);
    expect(matches.length).toBeGreaterThan(0);
  });
});

describe("Leagues", () => {
  test("Premier League table", async () => {
    const { table, matches } = await api.getLeague("premier-league");
    expect(table.competition.name).toBe("Premier League");
    expect(table.entries.length).toBe(20);
    expect(matches.length).toBeGreaterThan(0);
  });

  test("Championship table", async () => {
    const { table } = await api.getLeague("championship");
    expect(table.competition.name).toBe("Sky Bet Championship");
  });

  test("League One table", async () => {
    const { table } = await api.getLeague("league-one");
    expect(table.entries.length).toBeGreaterThan(10);
  });

  test("League Two table", async () => {
    const { table } = await api.getLeague("league-two");
    expect(table.entries.length).toBeGreaterThan(10);
  });

  test("National League", async () => {
    const { table } = await api.getLeague("national-league");
    expect(table.competition.name).toBe("Enterprise National League");
  });

  test("getMatches returns matches", async () => {
    const matches = await api.getMatches("premier-league");
    expect(matches.length).toBeGreaterThan(0);
  });
});

describe("European Leagues", () => {
  test("Scottish Premiership", async () => {
    const { table } = await api.getLeague("scottish-premiership");
    expect(table.competition.name).toBe("William Hill Premiership");
  });

  test("French Ligue 1", async () => {
    const { table } = await api.getLeague("french-ligue-1");
    expect(table.competition.name).toBe("French Ligue 1");
  });

  test("German Bundesliga", async () => {
    const { table } = await api.getLeague("german-bundesliga");
    expect(table.competition.name).toBe("German Bundesliga");
  });

  test("Italian Serie A", async () => {
    const { table } = await api.getLeague("italian-serie-a");
    expect(table.competition.name).toBe("Italian Serie A");
  });

  test("Spanish La Liga", async () => {
    const { table } = await api.getLeague("spanish-la-liga");
    expect(table.competition.name).toBe("Spanish La Liga");
  });
});

describe("Cups", () => {
  test("Champions League matches", async () => {
    const matches = await api.getMatches("champions-league");
    expect(matches.length).toBeGreaterThan(0);
  });

  test("Europa League matches", async () => {
    const matches = await api.getMatches("europa-league");
    expect(matches.length).toBeGreaterThan(0);
  });

  test("Europa Conference matches", async () => {
    const matches = await api.getMatches("europa-conference");
    expect(matches.length).toBeGreaterThan(0);
  });
});

describe("Women's Football", () => {
  test("Women's Super League", async () => {
    const { table } = await api.getLeague("womens-super-league");
    expect(table.competition.name).toBe("Barclays Women's Super League");
  });
});

describe("World Cup", () => {
  test("getWorldCup returns data", async () => {
    const data = await api.getWorldCup(2026);
    expect(data.year).toBe(2026);
  });
});

describe("Match Details", () => {
  test("getMatch returns full details", async () => {
    const match = await api.getMatch("/match/2025-2026/premier-league/afc-bournemouth/sunderland/529924");
    
    expect(match.match.homeTeam.name).toBeDefined();
    expect(match.match.awayTeam.name).toBeDefined();
    expect(match.match.homeScore).toBeDefined();
    expect(match.match.awayScore).toBeDefined();
  });

  test("getMatch returns lineup", async () => {
    const match = await api.getMatch("/match/2025-2026/premier-league/afc-bournemouth/sunderland/529924");
    
    expect(match.lineup.home.starting.length).toBe(11);
    expect(match.lineup.away.starting.length).toBe(11);
    expect(match.lineup.home.substitutes.length).toBeGreaterThan(0);
  });

  test("getMatch returns stats", async () => {
    const match = await api.getMatch("/match/2025-2026/premier-league/afc-bournemouth/sunderland/529924");
    
    expect(match.stats).toBeDefined();
    expect(match.stats?.possession).toBeDefined();
  });
});

describe("Monthly Fixtures", () => {
  test("getMatchesByMonth returns matches for Premier League", async () => {
    const matches = await api.getMatchesByMonth("premier-league", "march");
    expect(matches.length).toBeGreaterThan(0);
  });

  test("getMatchesByMonth returns matches for Championship", async () => {
    const matches = await api.getMatchesByMonth("championship", "march");
    expect(matches.length).toBeGreaterThan(0);
  });

  test("getMatchesByMonth returns matches for FA Cup", async () => {
    const matches = await api.getMatchesByMonth("fa-cup", "march");
    expect(matches.length).toBeGreaterThan(0);
  });

  test("getMatchesByMonth returns matches for Europa League", async () => {
    const matches = await api.getMatchesByMonth("europa-league", "march");
    expect(matches.length).toBeGreaterThan(0);
  });

  test("getMatchesByMonth returns matches for La Liga", async () => {
    const matches = await api.getMatchesByMonth("spanish-la-liga", "march");
    expect(matches.length).toBeGreaterThan(0);
  });

  test("getMatchesByMonth returns matches for Serie A", async () => {
    const matches = await api.getMatchesByMonth("italian-serie-a", "march");
    expect(matches.length).toBeGreaterThan(0);
  });
});
