export function detectUrl() {
  const url = new URL(window.location.href);
  return url.origin + url.pathname;
}
