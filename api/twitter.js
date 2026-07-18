// pages/api/twitter.js

export default async function handler(req, res) {
  const bearerToken = process.env.X_BEARER_TOKEN;
  const username = "time_sweeper";

  if (!bearerToken) {
    return res.status(500).json({
      error: "X_BEARER_TOKEN environment variable is missing.",
    });
  }

  try {
    // Step 1: Resolve username to user ID
    const userRes = await fetch(
      `https://api.x.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    const userData = await userRes.json();

    if (!userRes.ok) {
      console.error("User lookup failed:", userData);
      return res.status(userRes.status).json(userData);
    }

    // Step 2: Fetch latest tweets
    const tweetsRes = await fetch(
      `https://api.x.com/2/users/${userData.data.id}/tweets?max_results=5&tweet.fields=created_at`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    const tweetsData = await tweetsRes.json();

    if (!tweetsRes.ok) {
      console.error("Tweet fetch failed:", tweetsData);
      return res.status(tweetsRes.status).json(tweetsData);
    }

    return res.status(200).json(tweetsData);

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({
      error: "Server error fetching X posts.",
      details: err.message,
    });
  }
}
