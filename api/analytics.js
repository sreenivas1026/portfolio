// Vercel Serverless Function: Confidential Visitor Analytics & Session Duration Engine
// Handles:
// 1. GET ?mode=count -> Returns public total page hits count (no personal data)
// 2. POST -> Records a new visitor hit (name, role, timestamp, sessionId)
// 3. PUT -> Updates session duration (time spent on page) for the given sessionId
// 4. GET ?mode=admin&key=... -> Returns full confidential log for admin dashboard

const CLOUD_STORE_URL = process.env.ANALYTICS_STORE_URL || 'https://gopi-3cc1e-default-rtdb.asia-southeast1.firebasedatabase.app/visits.json';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'gopi_admin_079_secret';

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query, body } = req;

  try {
    // 0. Client IP Discovery Endpoint for Admin Geographic/Network Lock
    if (method === 'GET' && query.mode === 'ip') {
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket ? req.socket.remoteAddress : '') || '';
      return res.status(200).json({ success: true, ip: clientIp });
    }

    // 1. Public Total Hits Count
    if (method === 'GET' && query.mode === 'count') {
      try {
        const response = await fetch(CLOUD_STORE_URL);
        if (!response.ok) throw new Error('Cloud store read error');
        const data = await response.json();
        const totalHits = data ? Object.keys(data).length : 0;
        return res.status(200).json({ success: true, totalHits });
      } catch (e) {
        return res.status(200).json({ success: false, fallback: true, message: 'Cloud store unconfigured' });
      }
    }

    // 2. Confidential Admin View (Requires Secret Key or 4-Tap Token)
    if (method === 'GET' && query.mode === 'admin') {
      const providedKey = req.headers['x-admin-key'] || query.key;
      if (providedKey !== ADMIN_SECRET_KEY && providedKey !== 'gopi_079_tapped') {
        return res.status(401).json({ success: false, error: 'Unauthorized confidential access' });
      }

      try {
        const response = await fetch(CLOUD_STORE_URL);
        const rawData = await response.json();
        const visits = [];
        if (rawData) {
          Object.keys(rawData).forEach((key, index) => {
            visits.push({
              id: key,
              hitNum: index + 1,
              ...rawData[key]
            });
          });
        }
        // Return sorted by timestamp descending
        visits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return res.status(200).json({ success: true, totalHits: visits.length, visits });
      } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
      }
    }

    // 2.5 Secure Server-Side Admin Authentication Verification
    if (method === 'POST' && query.mode === 'verify') {
      const payload = typeof body === 'string' ? JSON.parse(body || '{}') : (body || {});
      const { enteredHash } = payload;

      const AUTHORIZED_HASHES = [
        '09730613eefb6782eb94d21a3b0172f1af6b29d2e4119c9153770349a899509b', // 079
        '853f3e818e56be52f1a825f9dabef8794bac5e586838894c1f2927d9e9d701db', // gopi079
        '29c30d337c34bea0ff2d7a2e2834a0c667c1a90f746920282c2e5c670ce4caf1', // admin079
        '3b6a6f33ecce7ae6b9961dd3e966ff2b537dcde3c446a93fbe4a1e830b15f698', // gopi
        '3c8b3a826c2e141e6a2ee6bfc3ec6371b0aefc19826637c7873285f6e8073e86', // 1026
        '2191bd41b46979b040aab15ec07c5aa7c59abf05bda935022889b85ac02132e4', // gopi@079
        '81c944ce115a9c0990b45e21fe123129b30b8bda77aa669aec576822d3ca06da', // admin
        '93e54d8faaddbadc4d08097aeaba07c531c8a109aa1ed70f7d23235d976468e6'  // gopi_0k7
      ];

      let isAuthorized = enteredHash && AUTHORIZED_HASHES.includes(enteredHash);

      if (!isAuthorized && enteredHash) {
        try {
          const configUrl = CLOUD_STORE_URL.replace('/visits.json', '/admin_config/auth_hash.json');
          const fbRes = await fetch(configUrl);
          if (fbRes.ok) {
            const fbHash = await fbRes.json();
            if (fbHash && typeof fbHash === 'string' && enteredHash === fbHash.trim()) {
              isAuthorized = true;
            }
          }
        } catch (e) {}
      }

      if (isAuthorized) {
        return res.status(200).json({ success: true, token: 'gopi_079_tapped' });
      }
      return res.status(401).json({ success: false, error: 'Invalid security key' });
    }

    // 3. Record New Visit Hit (POST)
    if (method === 'POST') {
      const payload = typeof body === 'string' ? JSON.parse(body || '{}') : (body || {});
      const now = new Date();
      const newHit = {
        sessionId: payload.sessionId || 'sess_' + Date.now(),
        name: (payload.name && payload.name.trim()) ? payload.name.trim() : 'Guest Visitor',
        role: (payload.role && payload.role.trim()) ? payload.role.trim() : 'Visitor',
        durationSeconds: 0,
        durationFormatted: '< 1m',
        dateStr: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeStr: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: now.toISOString(),
        referrer: payload.referrer || 'Direct',
        device: payload.device || 'Desktop/Mobile'
      };

      try {
        const cloudPost = await fetch(CLOUD_STORE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newHit)
        });
        const saved = await cloudPost.json();
        return res.status(200).json({ success: true, recordId: saved.name, hit: newHit });
      } catch (e) {
        return res.status(200).json({ success: true, hit: newHit, localFallback: true });
      }
    }

    // 4. Update Session Duration (PUT)
    if (method === 'PUT') {
      const payload = typeof body === 'string' ? JSON.parse(body || '{}') : (body || {});
      const { sessionId, durationSeconds } = payload;
      if (!sessionId) {
        return res.status(400).json({ success: false, error: 'Missing sessionId' });
      }

      const minutes = Math.floor((durationSeconds || 0) / 60);
      const seconds = (durationSeconds || 0) % 60;
      const formatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

      // Update in cloud store if possible
      try {
        const updateUrl = CLOUD_STORE_URL.replace('.json', '') + `/${sessionId}.json`;
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            durationSeconds,
            durationFormatted: formatted,
            lastHeartbeat: new Date().toISOString()
          })
        });
      } catch (e) {}

      return res.status(200).json({ success: true, sessionId, durationFormatted: formatted });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
