import * as cheerio from "cheerio";

const BASE_URL = "https://www.footballwebpages.co.uk";

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

export interface Competition {
  id: number;
  name: string;
  path: string;
}

export interface Team {
  id: number;
  name: string;
  logo?: string;
}

export type MatchStatus = "SCHEDULED" | "LIVE" | "HALF_TIME" | "FINISHED" | "POSTPONED" | "CANCELLED" | "ABANDONED" | "DELAYED";

export interface Match {
  id: number;
  date: string;
  time?: string;
  competition: Competition;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
}

export interface LeagueTableEntry {
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

export interface LeagueTable {
  competition: Competition;
  entries: LeagueTableEntry[];
  lastUpdated: string;
}

export interface HeadToHead {
  homeTeam: Team;
  awayTeam: Team;
  matches: Match[];
  summary: {
    totalMatches: number;
    homeWins: number;
    awayWins: number;
    draws: number;
    homeGoals: number;
    awayGoals: number;
  };
}

export interface VidiprinterConfig {
  enabledCompetitions: number[];
  allCompetitions: Competition[];
}

export interface LineupPlayer {
  name: string;
  number: number;
  isPlaying: boolean;
  position?: string;
  events: {
    type: "goal" | "yellow_card" | "red_card" | "substitution" | "penalty" | "own_goal";
    minute: string;
    playerOut?: string;
    playerIn?: string;
  }[];
}

export interface Lineup {
  team: Team;
  formation?: string;
  starting: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface MatchStats {
  possession?: { home: number; away: number };
  shots?: { home: number; away: number };
  shotsOnTarget?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  yellowCards?: { home: number; away: number };
  redCards?: { home: number; away: number };
}

export interface MatchData {
  match: Match;
  lineup: {
    home: Lineup;
    away: Lineup;
  };
  stats?: MatchStats;
  venue?: string;
  attendance?: number;
  referee?: string;
}

export const COMPETITIONS: Competition[] = [
  { id: 1, name: "Premier League", path: "premier-league" },
  { id: 2, name: "Sky Bet Championship", path: "championship" },
  { id: 3, name: "Sky Bet League One", path: "league-one" },
  { id: 4, name: "Sky Bet League Two", path: "league-two" },
  { id: 5, name: "Enterprise National League", path: "national-league" },
  { id: 6, name: "Enterprise National League North", path: "national-league-north" },
  { id: 7, name: "Enterprise National League South", path: "national-league-south" },
  { id: 8, name: "Southern League Premier Central", path: "southern-football-league-premier-central-division" },
  { id: 9, name: "Southern League Central", path: "southern-football-league-division-one-central" },
  { id: 10, name: "Southern League South", path: "southern-football-league-division-one-south" },
  { id: 11, name: "Isthmian League Premier", path: "isthmian-football-league-premier-division" },
  { id: 12, name: "Isthmian League North", path: "isthmian-football-league-north-division" },
  { id: 13, name: "Isthmian League South Central", path: "isthmian-football-league-south-central-division" },
  { id: 14, name: "Northern Premier League Premier", path: "northern-premier-league-premier-division" },
  { id: 15, name: "Northern Premier League East", path: "northern-premier-league-east-division" },
  { id: 16, name: "Northern Premier League West", path: "northern-premier-league-west-division" },
  { id: 17, name: "William Hill Premiership", path: "scottish-premiership" },
  { id: 18, name: "William Hill Championship", path: "scottish-championship" },
  { id: 19, name: "William Hill League One", path: "scottish-league-one" },
  { id: 20, name: "William Hill League Two", path: "scottish-league-two" },
  { id: 21, name: "Emirates FA Cup", path: "fa-cup" },
  { id: 22, name: "Carabao Cup", path: "efl-cup" },
  { id: 23, name: "William Hill Scottish Cup", path: "scottish-cup" },
  { id: 24, name: "UEFA Champions League", path: "champions-league" },
  { id: 25, name: "UEFA Europa League", path: "europa-league" },
  { id: 27, name: "Isuzu FA Trophy", path: "fa-trophy" },
  { id: 28, name: "EFL Trophy", path: "efl-trophy" },
  { id: 30, name: "Isuzu FA Vase", path: "fa-vase" },
  { id: 32, name: "Viaplay Cup", path: "scottish-league-cup" },
  { id: 33, name: "Tunnock's Challenge Cup", path: "scottish-challenge-cup" },
  { id: 34, name: "CSS League Challenge Cup", path: "southern-football-league-cup" },
  { id: 35, name: "Velocity Trophy", path: "isthmian-football-league-cup" },
  { id: 36, name: "Integro League Cup", path: "northern-premier-league-cup" },
  { id: 39, name: "Southern League Premier South", path: "southern-football-league-premier-south-division" },
  { id: 40, name: "Isthmian League South East", path: "isthmian-football-league-south-east-division" },
  { id: 88, name: "World Cup", path: "world-cup" },
  { id: 91, name: "French Ligue 1", path: "french-ligue-1" },
  { id: 92, name: "German Bundesliga", path: "german-bundesliga" },
  { id: 93, name: "Italian Serie A", path: "italian-serie-a" },
  { id: 94, name: "Spanish La Liga", path: "spanish-la-liga" },
  { id: 95, name: "Belgian Pro League", path: "belgian-pro-league" },
  { id: 96, name: "Dutch Eredivisie", path: "dutch-eredivisie" },
  { id: 97, name: "Portuguese Primeira Liga", path: "portuguese-primeira-liga" },
  { id: 99, name: "Turkish Süper Lig", path: "turkish-super-lig" },
  { id: 101, name: "Cymru Premier", path: "cymru-premier" },
  { id: 102, name: "Barclays Women's Super League", path: "womens-super-league" },
  { id: 103, name: "Barclays Women's Super League 2", path: "womens-super-league-two" },
  { id: 104, name: "FA Women's National League North", path: "womens-national-league-north" },
  { id: 105, name: "FA Women's National League South", path: "womens-national-league-south" },
  { id: 106, name: "Adobe Women's FA Cup", path: "womens-fa-cup" },
  { id: 107, name: "FA Women's League Cup", path: "womens-league-cup" },
  { id: 113, name: "Northern Ireland Premiership", path: "northern-ireland-premiership" },
  { id: 114, name: "Northern Premier League Midlands", path: "northern-premier-league-midlands-division" },
  { id: 116, name: "UEFA Europa Conference League", path: "europa-conference" },
  { id: 117, name: "Combined Counties League Premier North", path: "combined-counties-league-premier-division-north" },
  { id: 118, name: "Combined Counties League Premier South", path: "combined-counties-league-premier-division-south" },
  { id: 119, name: "Combined Counties League Division One", path: "combined-counties-league-division-one" },
  { id: 123, name: "Essex Senior League", path: "essex-senior-league" },
  { id: 131, name: "Northern Counties East League Premier", path: "northern-counties-east-league-premier-division" },
  { id: 132, name: "Northern Counties East League Division One", path: "northern-counties-east-league-division-one" },
  { id: 133, name: "Northern League Division One", path: "northern-league-division-one" },
  { id: 134, name: "Northern League Division Two", path: "northern-league-division-two" },
  { id: 139, name: "Southern Counties East League Premier", path: "southern-counties-east-league-premier-division" },
  { id: 140, name: "Southern Counties East League First", path: "southern-counties-east-league-first-division" },
  { id: 143, name: "United Counties League Premier North", path: "united-counties-league-premier-division-north" },
  { id: 144, name: "United Counties League Premier South", path: "united-counties-league-premier-division-south" },
  { id: 145, name: "United Counties League Division One", path: "united-counties-league-division-one" },
  { id: 158, name: "Highland League", path: "highland-league" },
  { id: 159, name: "Lowland League", path: "lowland-league" },
  { id: 169, name: "Danish Superliga", path: "danish-superliga" },
];

const competitionPathToId: Record<string, number> = COMPETITIONS.reduce((acc, c) => ({ ...acc, [c.path]: c.id }), {});

function getCompetition(leaguePath: string): Competition {
  const id = competitionPathToId[leaguePath] ?? 0;
  const comp = COMPETITIONS.find(c => c.path === leaguePath);
  return comp ?? { id, name: leaguePath, path: leaguePath };
}

async function fetchHtml(path: string): Promise<string> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, { headers: DEFAULT_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseScore(text: string): { home: number; away: number } | null {
  const m = text.match(/(\d+)\s*[-–]\s*(\d+)/);
  return m ? { home: parseInt(m[1], 10), away: parseInt(m[2], 10) } : null;
}

function parseMatchStatus(text: string): MatchStatus {
  const t = text.toLowerCase();
  if (t.includes("live") || t.includes("1st half") || t.includes("2nd half")) return "LIVE";
  if (t.includes("half time") || t.includes("ht")) return "HALF_TIME";
  if (t.includes("ft") || t.includes("finished") || t.includes("full time")) return "FINISHED";
  if (t.includes("postponed")) return "POSTPONED";
  if (t.includes("cancelled")) return "CANCELLED";
  if (t.includes("abandoned")) return "ABANDONED";
  if (t.includes("delayed")) return "DELAYED";
  return "SCHEDULED";
}

function extractLeagueTable(html: string, competition: Competition): LeagueTable {
  const $ = cheerio.load(html);
  const entries: LeagueTableEntry[] = [];
  
  $("table.league-table tr").each((_, el) => {
    const $el = $(el);
    const pos = $el.find("td.position, th.position").first().text().trim();
    const teamLink = $el.find("td.team a").first();
    const teamName = teamLink.text().trim() || $el.find("td.team").first().text().trim();
    const played = parseInt($el.find("td:nth-child(5)").text(), 10) || 0;
    const won = parseInt($el.find("td:nth-child(6)").text(), 10) || 0;
    const drawn = parseInt($el.find("td:nth-child(7)").text(), 10) || 0;
    const lost = parseInt($el.find("td:nth-child(8)").text(), 10) || 0;
    const gf = parseInt($el.find("td:nth-child(9)").text(), 10) || 0;
    const ga = parseInt($el.find("td:nth-child(10)").text(), 10) || 0;
    const pts = parseInt($el.find("td:nth-child(12)").text(), 10) || 0;
    
    if (teamName && !isNaN(pts)) {
      entries.push({
        position: parseInt(pos, 10) || entries.length + 1,
        team: { id: 0, name: teamName },
        played, won, drawn, lost, goalsFor: gf, goalsAgainst: ga, goalDifference: gf - ga, points: pts
      });
    }
  });
  
  return { competition, entries, lastUpdated: new Date().toISOString() };
}

function extractMatches(html: string, competition: Competition): Match[] {
  const $ = cheerio.load(html);
  const matches: Match[] = [];
  
  $("tr[data-href]").each((_, el) => {
    const $el = $(el);
    const homeLink = $el.find("td.home-team a").first();
    const awayLink = $el.find("td.away-team a").first();
    const homeScoreEl = $el.find("td.home-score").first();
    const awayScoreEl = $el.find("td.away-score").first();
    
    let homeName = homeLink.text().trim();
    let awayName = awayLink.text().trim();
    const homeScoreText = homeScoreEl.text().trim();
    const awayScoreText = awayScoreEl.text().trim();
    
    if (homeName && awayName) {
      const homeScore = parseInt(homeScoreText, 10);
      const awayScore = parseInt(awayScoreText, 10);
      const isFinished = !isNaN(homeScore) && !isNaN(awayScore);
      
      matches.push({
        id: 0,
        date: new Date().toISOString().split("T")[0],
        competition,
        homeTeam: { id: 0, name: homeName },
        awayTeam: { id: 0, name: awayName },
        homeScore: isFinished ? homeScore : undefined,
        awayScore: isFinished ? awayScore : undefined,
        status: isFinished ? "FINISHED" : "SCHEDULED"
      });
    }
  });
  
  return matches;
}

function extractVidiprinterMatches(html: string): Match[] {
  const $ = cheerio.load(html);
  const matches: Match[] = [];
  const idToComp: Record<number, Competition> = COMPETITIONS.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
  
  $("tr[class^='comp-']").each((_, el) => {
    const $el = $(el);
    const compClass = $el.attr("class") || "";
    const compIdMatch = compClass.match(/comp-(\d+)/);
    const compId = compIdMatch ? parseInt(compIdMatch[1], 10) : 0;
    const compName = $el.find("span.competition").attr("title") || "";
    const competition = idToComp[compId] || { id: compId, name: compName, path: "" };
    
    const linkText = $el.find("td a").text().trim();
    const vMatch = linkText.match(/(.+?)\s+v\s+(.+?)(?:\s*[-–]\s*(\d+)\s*[-–]\s*(\d+))?$/);
    
    if (vMatch) {
      const homeName = vMatch[1].trim();
      const awayName = vMatch[2].trim();
      const score = vMatch[3] && vMatch[4] ? { home: parseInt(vMatch[3], 10), away: parseInt(vMatch[4], 10) } : null;
      
      matches.push({
        id: 0,
        date: new Date().toISOString().split("T")[0],
        competition,
        homeTeam: { id: 0, name: homeName },
        awayTeam: { id: 0, name: awayName },
        homeScore: score?.home,
        awayScore: score?.away,
        status: score ? "FINISHED" : "SCHEDULED"
      });
    }
  });
  
  return matches;
}

function extractLineup(html: string, side: "home" | "away"): Lineup {
  const $ = cheerio.load(html);
  const teamName = $(`.${side}-line-up .match-heading`).text().trim();
  const players: LineupPlayer[] = [];
  
  $(`.${side}-line-up .match-line-up li`).each((_, el) => {
    const $el = $(el);
    const link = $el.find("a");
    const name = link.attr("title") || $el.find(".player").text().trim();
    const numberText = $el.find(".fa-layers-text").text().trim();
    const isPlaying = $el.hasClass("playing");
    
    const events: LineupPlayer["events"] = [];
    $el.find(".yellow-card").each((_, e) => {
      const title = $(e).attr("title") || "";
      const min = title.match(/(\d+)'/)?.[1] || "";
      if (min) events.push({ type: "yellow_card", minute: min });
    });
    $el.find(".red-card").each((_, e) => {
      const title = $(e).attr("title") || "";
      const min = title.match(/(\d+)'/)?.[1] || "";
      if (min) events.push({ type: "red_card", minute: min });
    });
    $el.find(".goal").each((_, e) => {
      const title = $(e).attr("title") || "";
      const min = title.match(/(\d+)'/)?.[1] || "";
      if (min) events.push({ type: "goal", minute: min });
    });
    $el.find(".sub-on").each((_, e) => {
      const title = $(e).parent().attr("title") || "";
      const min = title.match(/(\d+)'/)?.[1] || "";
      const playerIn = title.replace(/[^a-zA-Z\s]/g, "").trim();
      if (min) events.push({ type: "substitution", minute: min, playerIn });
    });
    $el.find(".sub-off").each((_, e) => {
      const title = $(e).parent().attr("title") || "";
      const min = title.match(/(\d+)'/)?.[1] || "";
      const playerOut = title.replace(/[^a-zA-Z\s]/g, "").trim();
      if (min) events.push({ type: "substitution", minute: min, playerOut });
    });
    
    if (name) {
      players.push({
        name,
        number: parseInt(numberText, 10) || 0,
        isPlaying,
        events
      });
    }
  });
  
  const starting = players.filter(p => p.isPlaying);
  const substitutes = players.filter(p => !p.isPlaying);
  
  return { team: { id: 0, name: teamName }, starting, substitutes };
}

function extractMatchStats(html: string): MatchStats | undefined {
  const $ = cheerio.load(html);
  const stats: MatchStats = {};
  
  $("table.match-statistics tr").each((_, el) => {
    const $el = $(el);
    const $ths = $el.find("th");
    if ($ths.length < 3) return;
    
    const homeVal = $ths.eq(0).text().replace("%", "").trim();
    const label = $ths.eq(1).text().toLowerCase().trim();
    const awayVal = $ths.eq(2).text().replace("%", "").trim();
    
    const homeNum = parseInt(homeVal, 10);
    const awayNum = parseInt(awayVal, 10);
    
    if (label.includes("possession")) {
      stats.possession = { home: homeNum, away: awayNum };
    } else if (label.includes("shot") && label.includes("target")) {
      stats.shotsOnTarget = { home: homeNum, away: awayNum };
    } else if (label.includes("shot") && !label.includes("target") && !label.includes("box") && !label.includes("off") && !label.includes("block")) {
      stats.shots = { home: homeNum, away: awayNum };
    } else if (label.includes("corner")) {
      stats.corners = { home: homeNum, away: awayNum };
    } else if (label.includes("foul")) {
      stats.fouls = { home: homeNum, away: awayNum };
    } else if (label.includes("yellow")) {
      stats.yellowCards = { home: homeNum, away: awayNum };
    } else if (label.includes("red")) {
      stats.redCards = { home: homeNum, away: awayNum };
    }
  });
  
  return Object.keys(stats).length > 0 ? stats : undefined;
}

export class FootballWebPages {
  private baseUrl: string;
  
  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }
  
  private async fetch(path: string): Promise<string> {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
    const res = await fetch(url, { headers: DEFAULT_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }
  
  async getLeague(leaguePath: string): Promise<{ table: LeagueTable; matches: Match[] }> {
    const html = await this.fetch(`/${leaguePath}`);
    const competition = getCompetition(leaguePath);
    const table = extractLeagueTable(html, competition);
    const matches = extractMatches(html, competition);
    return { table, matches };
  }
  
  async getLeagueTable(leaguePath: string): Promise<LeagueTable> {
    const html = await this.fetch(`/${leaguePath}`);
    const competition = getCompetition(leaguePath);
    return extractLeagueTable(html, competition);
  }
  
  async getMatches(leaguePath: string): Promise<Match[]> {
    const html = await this.fetch(`/${leaguePath}`);
    const competition = getCompetition(leaguePath);
    return extractMatches(html, competition);
  }
  
  async getHeadToHead(team1Path: string, team2Path: string): Promise<HeadToHead> {
    const html = await this.fetch(`/head-to-head?team1=${team1Path}&team2=${team2Path}`);
    const $ = cheerio.load(html);
    
    const homeName = $(".head-to-head .home-team-name, .team1-name").text().trim() || team1Path;
    const awayName = $(".head-to-head .away-team-name, .team2-name").text().trim() || team2Path;
    
    const matches = extractMatches(html, { id: 0, name: "", path: "" });
    
    let homeWins = 0, awayWins = 0, draws = 0, homeGoals = 0, awayGoals = 0;
    for (const m of matches) {
      if (m.homeScore !== undefined && m.awayScore !== undefined) {
        if (m.homeScore > m.awayScore) homeWins++;
        else if (m.awayScore > m.homeScore) awayWins++;
        else draws++;
        homeGoals += m.homeScore;
        awayGoals += m.awayScore;
      }
    }
    
    return {
      homeTeam: { id: 0, name: homeName },
      awayTeam: { id: 0, name: awayName },
      matches,
      summary: { totalMatches: matches.length, homeWins, awayWins, draws, homeGoals, awayGoals }
    };
  }
  
  async getWorldCup(year: number = 2026): Promise<{ year: number; knockout: Match[] }> {
    const html = await this.fetch("/world-cup");
    const competition = { id: 88, name: "World Cup", path: "world-cup" };
    const knockout = extractMatches(html, competition);
    return { year, knockout };
  }
  
  async getVidiprinter(competitionIds?: number[]): Promise<Match[]> {
    let url = "/vidiprinter";
    if (competitionIds?.length) {
      url += `?competitions=${competitionIds.join(",")}`;
    }
    const html = await this.fetch(url);
    let matches = extractVidiprinterMatches(html);
    
    if (competitionIds?.length) {
      const idSet = new Set(competitionIds);
      matches = matches.filter(m => idSet.has(m.competition.id));
    }
    
    return matches;
  }
  
  async getVidiprinterConfig(): Promise<VidiprinterConfig> {
    const html = await this.fetch("/configure/competitions");
    const $ = cheerio.load(html);
    
    const allCompetitions: Competition[] = [];
    const enabledCompetitions: number[] = [];
    
    $("[id^='competition-']").each((_, el) => {
      const $el = $(el);
      const id = parseInt($el.attr("id")?.replace("competition-", "") || "0", 10);
      const name = $el.text().trim();
      const isChecked = $el.hasClass("checked");
      
      if (id && name) {
        allCompetitions.push({ id, name, path: "" });
        if (isChecked) enabledCompetitions.push(id);
      }
    });
    
    return { enabledCompetitions, allCompetitions };
  }
  
  async getMatch(matchPath: string): Promise<MatchData> {
    const html = await this.fetch(matchPath);
    const $ = cheerio.load(html);
    
    const title = $("title").text();
    const titleMatch = title.match(/([A-Za-z\s]+)\s+(\d+)\s*[-–]\s*(\d+)\s+([A-Za-z\s]+?)(?:\s*\|)/);
    
    const homeName = titleMatch ? titleMatch[1].trim() : $(".home-team h4, .home-team-name, .team.home-team h4").first().text().replace(/^\d+\s*/, "").trim();
    const awayName = titleMatch ? titleMatch[4].trim() : $(".away-team h4, .away-team-name, .team.away-team h4").first().text().replace(/^\d+\s*/, "").trim();
    const compName = $(".competition-name, [class*='competition']").first().text().trim() || "Match";
    
    const score = titleMatch ? { home: parseInt(titleMatch[2], 10), away: parseInt(titleMatch[3], 10) } : null;
    
    const dateText = $(".match-date, .date, [class*='date']").first().text().trim();
    
    const match: Match = {
      id: 0,
      date: dateText || new Date().toISOString().split("T")[0],
      competition: { id: 0, name: compName, path: matchPath },
      homeTeam: { id: 0, name: homeName },
      awayTeam: { id: 0, name: awayName },
      homeScore: score?.home,
      awayScore: score?.away,
      status: score ? "FINISHED" : "SCHEDULED"
    };
    
    const lineup = {
      home: extractLineup(html, "home"),
      away: extractLineup(html, "away")
    };
    
    const stats = extractMatchStats(html);
    const attendance = parseInt($(".attendance").first().text().replace(/[^0-9]/g, ""), 10) || undefined;
    const venue = $(".venue, .match-venue").first().text().trim() || undefined;
    const referee = $(".referee").first().text().trim() || undefined;
    
    return { match, lineup, stats, attendance, venue, referee };
  }
  
  getCompetitionUrl(competitionId: number): string {
    const comp = COMPETITIONS.find(c => c.id === competitionId);
    return comp ? `${this.baseUrl}/${comp.path}` : "";
  }
}

export const fwp = new FootballWebPages();
export default FootballWebPages;
