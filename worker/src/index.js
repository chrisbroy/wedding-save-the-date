const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }

        if (request.method !== 'POST') {
            return json({ error: 'Method not allowed' }, 405);
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return json({ error: 'Invalid JSON' }, 400);
        }

        const { name, email, turnstileToken, timestamp } = body;

        if (!name || !email || !turnstileToken) {
            return json({ error: 'Missing required fields' }, 400);
        }

        // Validate Turnstile token
        const ip = request.headers.get('CF-Connecting-IP') ?? '';
        const turnstileValid = await verifyTurnstile(turnstileToken, ip, env.TURNSTILE_SECRET_KEY);
        if (!turnstileValid) {
            return json({ error: 'Security check failed' }, 403);
        }

        // Store in D1
        await env.DB.prepare(
            'INSERT INTO submissions (name, email, submitted_at) VALUES (?, ?, ?)'
        ).bind(name, email, timestamp ?? new Date().toISOString()).run();

        return json({ success: true });
    },
};

async function verifyTurnstile(token, ip, secretKey) {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secretKey, response: token, remoteip: ip }),
    });
    const data = await res.json();
    console.log('Turnstile response:', JSON.stringify(data));
    return data.success === true;
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
}
