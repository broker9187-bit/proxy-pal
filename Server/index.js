const express = require('express');
const fetch = require('node-fetch'); // node-fetch v2 recommended for require()
const cheerio = require('cheerio');
const { URL } = require('url');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple helper to build absolute URL from base
function resolveUrl(base, href) {
  try {
    return new URL(href, base).toString();
  } catch (e) {
    return null;
  }
}

// Helper to copy selected request headers to remote
function forwardHeaders(incoming) {
  // Copy a minimal set of headers to preserve identity; avoid forwarding cookies by default
  const headers = {};
  if (incoming.get('user-agent')) headers['user-agent'] = incoming.get('user-agent');
  if (incoming.get('accept-language')) headers['accept-language'] = incoming.get('accept-language');
  // You can add more forwarded headers if necessary
  return headers;
}

// Main proxy endpoint (works for GET and simple form submissions)
app.use('/proxy', express.raw({ type: '*/*', limit: '10mb' })); // capture body for POSTs
app.all('/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).send('Missing "url" query parameter. Example: /proxy?url=https://example.com');
  }

  let remoteUrl;
  try {
    remoteUrl = new URL(target).toString();
  } catch (e) {
    return res.status(400).send('Invalid URL');
  }

  // Build fetch options, forward method and body (for forms)
  const fetchOptions = {
    method: req.method,
    headers: forwardHeaders(req),
    redirect: 'manual',
  };
  if (req.method !== 'GET' && req.body) {
    fetchOptions.body = req.body;
  }

  try {
    const upstream = await fetch(remoteUrl, fetchOptions);

    // If upstream redirected, follow Location through our proxy (so navigation stays in-site)
    if (upstream.status >= 300 && upstream.status < 400 && upstream.headers.get('location')) {
      const loc = resolveUrl(remoteUrl, upstream.headers.get('location'));
      if (loc) {
        // Redirect the browser to our proxy for the new location
        return res.redirect(302, '/proxy?url=' + encodeURIComponent(loc));
      }
    }

    const contentType = (upstream.headers.get('content-type') || '').toLowerCase();

    // If HTML, rewrite links/assets/forms to keep navigation in-proxy
    if (contentType.includes('text/html')) {
      let body = await upstream.text();

      // Load with cheerio preserving entities
      const $ = cheerio.load(body, { decodeEntities: false });

      // Remove <meta http-equiv="Content-Security-Policy"> tags to reduce CSP issues (use carefully)
      $('meta[http-equiv="Content-Security-Policy"]').remove();
      // Also remove CSP header equivalents by not copying upstream headers back (we're setting our own)

      // Rewrite <base> to avoid relative resolution to original host
      // Remove existing base tags
      $('base').remove();

      // Rewrite anchors <a href="...">
      $('a').each((i, el) => {
        const $el = $(el);
        const href = $el.attr('href');
        if (!href) return;
        const abs = resolveUrl(remoteUrl, href);
        if (!abs) return;
        $el.attr('href', '/proxy?url=' + encodeURIComponent(abs));
        // ensure it opens in same tab
        $el.attr('target', '_self');
        // remove rel="noopener noreferrer" if desired (not necessary)
      });

      // Rewrite forms so submissions go through the proxy
      $('form').each((i, el) => {
        const $el = $(el);
        const action = $el.attr('action') || '';
        const abs = resolveUrl(remoteUrl, action || remoteUrl);
        if (!abs) return;
        $el.attr('action', '/proxy?url=' + encodeURIComponent(abs));
        // keep method the same
      });

      // For tags that reference resources, rewrite to route through /proxy so assets are proxied:
      const resourceMap = {
        'img': 'src',
        'script': 'src',
        'link': 'href',
        'iframe': 'src',
        'source': 'src',
        'video': 'src',
        'audio': 'src',
      };

      Object.keys(resourceMap).forEach(tag => {
        const attr = resourceMap[tag];
        $(tag).each((i, el) => {
          const $el = $(el);
          const val = $el.attr(attr);
          if (!val) return;
          const abs = resolveUrl(remoteUrl, val);
          if (!abs) return;
          // For CSS/JS/images etc, route them through the proxy endpoint
          $el.attr(attr, '/proxy?url=' + encodeURIComponent(abs));
          // Remove attributes which may block execution from our origin
          if (tag === 'script') {
            $el.removeAttr('integrity');
            $el.removeAttr('crossorigin');
          }
          if (tag === 'link' && $el.attr('rel') === 'stylesheet') {
            $el.removeAttr('integrity');
            $el.removeAttr('crossorigin');
          }
        });
      });

      // Optionally inject a small banner or UI to show the proxied origin
      const banner = `<div style="position:fixed;left:0;right:0;top:0;background:#222;color:#fff;padding:6px 10px;z-index:9999;font-family:Arial,sans-serif;">
        Proxied: ${remoteUrl} — <a href="/" style="color:#9cf">Home</a>
      </div><div style="height:38px;"></div>`;
      $('body').prepend(banner);

      // Return rewritten HTML; set content-type to text/html
      res.set('content-type', 'text/html; charset=utf-8');
      return res.send($.html());
    }

    // For non-HTML resources, stream the response directly, copying some headers
    // Copy content-type and cache-control if present
    if (upstream.headers.get('content-type')) {
      res.set('Content-Type', upstream.headers.get('content-type'));
    }
    if (upstream.headers.get('cache-control')) {
      res.set('Cache-Control', upstream.headers.get('cache-control'));
    }
    // Pipe the body
    upstream.body.pipe(res);
  } catch (err) {
    console.error('Proxy error fetching', remoteUrl, err);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

// Serve a minimal frontend (user enters URL here)
app.use('/', express.static(__dirname + '/../public', { index: 'index.html' }));

app.listen(PORT, () => {
  console.log(`ProxyPal server listening on http://localhost:${PORT}`);
});
