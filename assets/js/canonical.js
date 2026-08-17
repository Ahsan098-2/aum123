/*
 * Daily Toolkit — Dynamic Canonical URL
 *
 * Normalizes every page to:
 *   https://dailytoolkit.xyz<pathname>
 *
 * - Uses window.location.pathname only (query strings/fragments are ignored)
 * - Forces the canonical HTTPS origin
 * - Removes trailing slashes except for the homepage
 * - Updates an existing canonical tag or creates one when missing
 */
(function () {
  'use strict';

  var CANONICAL_ORIGIN = 'https://dailytoolkit.xyz';
  var pathname = window.location.pathname || '/';

  // Keep the homepage as /; remove trailing slash from all other paths.
  var cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  // Safety fallback in case the browser provides an unexpected empty path.
  if (!cleanPath) {
    cleanPath = '/';
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
