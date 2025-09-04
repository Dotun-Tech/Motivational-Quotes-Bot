// github.js
import fs from "fs";

/**
 * We try to fetch a random quote from ZenQuotes (no key needed).
 * If that fails (no internet/API hiccup), we fall back to a local list.
 * This keeps it truly "GitHub-only" with no external setup.
 */
const fallbackQuotes = [
  { q: "Slow and steady wins the race.", a: "Aesop" },
  { q: "Dream big. Start small. Act now.", a: "Robin Sharma" },
  { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
  { q: "Action is the foundational key to all success.", a: "Pablo Picasso" },
  { q: "Do what you can, with what you have, where you are.", a: "Theodore Roosevelt" },
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { q: "Well done is better than well said.", a: "Benjamin Franklin" },
  { q: "Either you run the day or the day runs you.", a: "Jim Rohn" },
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { q: "Stay hungry. Stay foolish.", a: "Steve Jobs" }
];

async function fetchOnlineQuote() {
  // Node 18+ has global fetch available
  const res = await fetch("https://zenquotes.io/api/random", { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || !data[0]?.q || !data[0]?.a) {
    throw new Error("Unexpected API response");
  }
  return `"${data[0].q}" — ${data[0].a}`;
}

function getFallbackQuote() {
  const pick = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  return `"${pick.q}" — ${pick.a}`;
}

async function getQuote() {
  try {
    return await fetchOnlineQuote();
  } catch {
    return getFallbackQuote();
  }
}

async function updateReadme() {
  const quote = await getQuote();
  const now = new Date().toUTCString();

  const content = `
# 🌟 Daily Motivation

This README is updated automatically with a new motivational quote ✨

**Quote of the Day:**  
_${quote}_

_Last update (UTC): **${now}**_
`;

  fs.writeFileSync("README.md", content.trim() + "\n");
  console.log("✅ README updated with quote:", quote);
}

updateReadme().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
