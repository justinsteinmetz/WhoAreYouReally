/**
 * Cloudflare Worker — Anthropic API Proxy
 * Deploy as: anthropic-proxy.justin-steinmetz.workers.dev
 *
 * Setup:
 * 1. Create a new Worker in Cloudflare dashboard → Workers & Pages → Create
 * 2. Paste this script
 * 3. Go to Settings → Variables → Add variable:
 *    Name: ANTHROPIC_API_KEY
 *    Value: your Anthropic API key (mark as secret/encrypted)
 * 4. Save and deploy
 *
 * The Worker accepts POST requests from allowed origins only.
 * Your API key never touches the browser.
 */

const ALLOWED_ORIGINS = [
  "https://justinsteinmetz.github.io",
  // Add other origins here if needed, e.g. local dev:
  // "http://localhost:3000",
  // "http://127.0.0.1:5500",
];

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

export default {
  async fetch(request, env) {

    const origin = request.headers.get("Origin") || "";

    // CORS preflight
    if (request.method === "OPTIONS") {
      if (ALLOWED_ORIGINS.includes(origin)) {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin),
        });
      }
      return new Response("Forbidden", { status: 403 });
    }

    // Only POST allowed
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Origin check
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    // Forward to Anthropic
    try {
      const upstream = await fetch(ANTHROPIC_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      const data = await upstream.json();

      return new Response(JSON.stringify(data), {
        status: upstream.status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(origin),
        },
      });

    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Upstream request failed", detail: err.message }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(origin),
          },
        }
      );
    }
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}
