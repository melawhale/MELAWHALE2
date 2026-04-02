export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { account, token, since, until } = req.query;

  if (!account || !token) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${account}/insights?fields=spend,clicks,impressions,cpc,cpm,actions&time_range={"since":"${since}","until":"${until}"}&access_token=${token}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
