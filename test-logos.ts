import { FootballWebPages } from "./src/index";

const fwp = new FootballWebPages();

async function test() {
  const matches = await fwp.getMatches("premier-league");
  
  console.log("Match logos:");
  const muMatch = matches.find(m => m.homeTeam.name === "Manchester United" || m.awayTeam.name === "Manchester United");
  if (muMatch) {
    console.log(`Home: ${muMatch.homeTeam.name}`);
    console.log(`  Logo: ${muMatch.homeTeam.logo}`);
    console.log(`Away: ${muMatch.awayTeam.name}`);
    console.log(`  Logo: ${muMatch.awayTeam.logo}`);
  } else {
    console.log("No Manchester United match found, showing first match:");
    console.log(`Home: ${matches[0].homeTeam.name}`);
    console.log(`  Logo: ${matches[0].homeTeam.logo}`);
    console.log(`Away: ${matches[0].awayTeam.name}`);
    console.log(`  Logo: ${matches[0].awayTeam.logo}`);
  }
}

test().catch(console.error);
