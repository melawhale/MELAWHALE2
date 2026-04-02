export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { since } = req.query;

  // Ces variables sont configurées dans Vercel → Environment Variables
  const store = process.env.SHOPIFY_STORE;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!store || !clientId || !clientSecret) {
    return res.status(500).json({ error: 'Variables Vercel manquantes' });
  }

  // Authentification avec Client ID + Secret
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const url = `https://${store}.myshopify.com/admin/api/2024-01/orders.json?status=any&created_at_min=${since}&limit=250&fields=id,created_at,processed_at,current_subtotal_price,subtotal_price,total_price,line_items,financial_status`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
