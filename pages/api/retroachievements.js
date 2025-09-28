// pages/api/retroachievements.js
export default async function handler(req, res) {
  const raUser = "timesweeper";
  const apiUser = process.env.RA_API_USER;
  const apiKey  = process.env.RA_API_KEY;
  const baseUrl = "https://retroachievements.org/API";

  try {
    // Fetch user summary
    const summaryRes = await fetch(`${baseUrl}/API_GetUserSummary.php?u=${apiUser}&y=${apiKey}&z=${raUser}`);
    const summary = await summaryRes.json();

    // Fetch recent games
    const recentRes = await fetch(`${baseUrl}/API_GetUserRecentlyPlayedGames.php?u=${apiUser}&y=${apiKey}&z=${raUser}`);
    const recentGames = await recentRes.json();

    // Fetch completion progress
    const progressRes = await fetch(`${baseUrl}/API_GetUserCompletionProgress.php?u=${apiUser}&y=${apiKey}&z=${raUser}`);
    const progress = await progressRes.json();

    res.status(200).json({
      summary,
      recentGames,
      progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch RetroAchievements data" });
  }
}
