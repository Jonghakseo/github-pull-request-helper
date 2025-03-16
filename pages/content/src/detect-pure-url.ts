export function detectPureUrl() {
  const url = new URL(window.location.href);
  return url.origin + url.pathname;
}
