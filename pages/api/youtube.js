// pages/api/youtube.js
export default async function handler(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY; // hidden in Vercel env
  const channelId = "UCLd7iswJ7rlNnOoHpIL1aMw";

  try {
    // Get uploads playlist ID
    const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`);
    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Get playlist videos
    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10`;
    if (req.query.pageToken) url += `&pageToken=${req.query.pageToken}`;
    url += `&key=${apiKey}`;

    const playlistRes = await fetch(url);
    const playlistData = await playlistRes.json();

    res.status(200).json(playlistData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch YouTube data" });
  }
}
