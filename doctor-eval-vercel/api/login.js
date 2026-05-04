module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};
  if (username === 'admin' && password === 'admin123')
    return res.json({ token: 'fake-jwt-token-admin', role: 'admin', name: 'Administrator' });
  if (username === 'user' && password === 'user123')
    return res.json({ token: 'fake-jwt-token-user', role: 'user', name: 'Regular User' });
  return res.status(401).json({ error: 'Invalid credentials' });
};
