import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { orderId } = req.body ?? {};
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!orderId || !token) {
    return res.status(400).json({ error: 'Missing orderId or auth token' });
  }

  // Verify order with Lemon Squeezy
  const lsRes = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${process.env['LS_API_KEY']}`,
      Accept: 'application/vnd.api+json',
    },
  });

  if (!lsRes.ok) return res.status(400).json({ error: 'Order not found' });

  const { data } = await lsRes.json();
  if (data?.attributes?.status !== 'paid') {
    return res.status(400).json({ error: 'Order not paid' });
  }

  // Resolve user via their JWT
  const supabase = createClient(
    process.env['SUPABASE_URL']!,
    process.env['SUPABASE_SERVICE_ROLE_KEY']!
  );

  const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !user) return res.status(401).json({ error: 'Invalid token' });

  // Mark as purchased in user_metadata
  const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, purchased: true },
  });

  if (updateErr) return res.status(500).json({ error: 'Update failed' });

  return res.json({ success: true });
}
