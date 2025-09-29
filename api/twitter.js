// pages/api/twitter.js
export default async function handler(req, res) {
  const bearerToken = process.env.X_BEARER_TOKEN; // add this in Vercel env
  const username = "time_sweeper"; // change this to your handle

  try {
    // First: resolve user ID from username
    const userRes = await fetch(
      `https://api.x.com/2/users/by/username/${username}`,
      { headers: { Authorization: `Bearer ${bearerToken}` } }
    );
    const userData = await userRes.json();
    if (!userData.data) throw new Error("User not found");

    // Then: fetch tweets
    const tweetsRes = await fetch(
      `https://api.x.com/2/users/${userData.data.id}/tweets?max_results=5&tweet.fields=created_at`,
      { headers: { Authorization: `Bearer ${bearerToken}` } }
    );
    const tweetsData = await tweetsRes.json();

    res.status(200).json(tweetsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Twitter posts" });
  }
}
