const EVENT = "gs:intro-done";

declare global {
  interface Window {
    __gsIntroDone?: boolean;
  }
}

export function markIntroDone() {
  window.__gsIntroDone = true;
  window.dispatchEvent(new Event(EVENT));
}

/** Executa `cb` quando o preloader terminar (ou imediatamente, se já terminou / não vai rodar). */
export function onIntroDone(cb: () => void) {
  if (window.__gsIntroDone || document.documentElement.classList.contains("intro-seen")) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
