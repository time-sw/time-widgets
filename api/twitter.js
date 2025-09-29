// pages/api/twitter.js
export default async function handler(req, res) {
  const bearerToken = process.env.X_BEARER_TOKEN;
  const username = "time_sweeper"; // <-- update to your exact handle

  try {
    // Step 1: Resolve user ID
    const userRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }
    );
    const userData = await userRes.json();

    if (!userData.data) {
      console.error("User lookup failed:", userData);
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Fetch latest tweets
    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${userData.data.id}/tweets?max_results=5&tweet.fields=created_at`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }
    );
    const tweetsData = await tweetsRes.json();

    if (tweetsData.errors) {
      console.error("Tweet fetch failed:", tweetsData);
      return res.status(500).json({ error: "Failed to fetch tweets" });
    }

    res.status(200).json(tweetsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching X posts" });
  }
}
