# Football Web Pages API

A TypeScript library for fetching football data from [footballwebpages.co.uk](https://www.footballwebpages.co.uk).

## Installation

```bash
bun add football-webpages-api
```

## Usage

```typescript
import { FootballWebPages } from "football-webpages-api";

const api = new FootballWebPages();
```

## API

### Leagues

Get league table and matches:

```typescript
const { table, matches } = await api.getLeague("premier-league");
```

Get just the league table:

```typescript
const { table } = await api.getLeagueTable("premier-league");
```

Get just matches:

```typescript
const matches = await api.getMatches("premier-league");
```

### Competition Paths

Supported competitions (use these paths):

| Path | Competition |
|------|------------|
| `premier-league` | Premier League |
| `championship` | Sky Bet Championship |
| `league-one` | Sky Bet League One |
| `league-two` | Sky Bet League Two |
| `national-league` | Enterprise National League |
| `scottish-premiership` | William Hill Premiership |
| `champions-league` | UEFA Champions League |
| `europa-league` | UEFA Europa League |
| `europa-conference` | UEFA Europa Conference |
| `womens-super-league` | Barclays Women's Super League |
| And 70+ more... | |

### Vidiprinter (Live Scores)

Get all live scores:

```typescript
const matches = await api.getVidiprinter();
```

Get specific competitions:

```typescript
const matches = await api.getVidiprinter([1, 2]); // Premier League + Championship
```

Get configuration (enabled competitions):

```typescript
const config = await api.getVidiprinterConfig();
console.log(config.enabledCompetitions);
console.log(config.allCompetitions);
```

### Head to Head

```typescript
const h2h = await api.getHeadToHead("arsenal", "chelsea");
console.log(h2h.summary); // { totalMatches, homeWins, draws, awayWins, ... }
console.log(h2h.matches); // Array of past matches
```

### World Cup

```typescript
const worldcup = await api.getWorldCup(2026);
console.log(worldcup.year);
console.log(worldcup.knockout);
```

### Match Details

Get full match info including lineups and stats:

```typescript
const match = await api.getMatch("/match/2025-2026/premier-league/afc-bournemouth/sunderland/529924");

console.log(match.match.homeTeam.name);
console.log(match.match.awayTeam.name);
console.log(match.match.homeScore, "-", match.match.awayScore);

// Lineups
console.log(match.lineup.home.starting); // Starting XI
console.log(match.lineup.home.substitutes);

// Stats
console.log(match.stats?.possession); // { home: 62, away: 38 }
console.log(match.stats?.shots);
console.log(match.stats?.corners);
```

### Player Events

Player events include goals, cards, and substitutions:

```typescript
match.lineup.home.starting.forEach(player => {
  console.log(player.name);
  player.events?.forEach(event => {
    console.log(event.type, event.minute);
  });
});
```

## Types

```typescript
interface Match {
  id: number;
  date: string;
  competition: Competition;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED";
}

interface Team {
  id: number;
  name: string;
}

interface Competition {
  id: number;
  name: string;
  path: string;
}

interface LeagueTableEntry {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface MatchStats {
  possession?: { home: number; away: number };
  shots?: { home: number; away: number };
  shotsOnTarget?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  yellowCards?: { home: number; away: number };
  redCards?: { home: number; away: number };
}

interface Player {
  name: string;
  number?: number;
  events?: PlayerEvent[];
}

interface PlayerEvent {
  type: "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION";
  minute: string;
}
```

## License

MIT
