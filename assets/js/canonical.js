/*
 * Daily Toolkit — Canonical URL normalizer
 *
 * Canonical URLs always use the production origin and the clean Vercel URL:
 *   https://dailytoolkit.xyz<clean-path>
 *
 * Rules:
 * - HTTPS production origin only
 * - www is never canonical
 * - query strings and fragments are ignored
 * - .html is removed from page paths
 * - /index.html and /index resolve to /
 * - trailing slashes are removed except for /
 * - updates the existing canonical tag instead of creating duplicates
 */
(function () {
  'use strict';

  var CANONICAL_ORIGIN = 'https://dailytoolkit.xyz';
  var pathname = window.location.pathname || '/';

  // Normalize common duplicate URL forms before generating the canonical.
  var cleanPath = pathname;

  if (/^\/index(?:\.html)?\/?$/i.test(cleanPath)) {
    cleanPath = '/';
  } else {
    // Remove the .html extension from page URLs.
    cleanPath = cleanPath.replace(/\.html$/i, '');
    // Remove trailing slashes from non-homepage URLs.
    cleanPath = cleanPath.replace(/\/+$/, '');
    if (!cleanPath) cleanPath = '/';
  }

  var canonicalUrl = CANONICAL_ORIGIN + cleanPath;
  var canonical = document.head.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', canonicalUrl);
})();
