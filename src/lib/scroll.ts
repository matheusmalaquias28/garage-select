import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

/** Trava/destrava a rolagem (menus, lightbox, drawers). */
export function lockScroll(lock: boolean) {
  if (lock) {
    instance?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    instance?.start();
    document.documentElement.style.overflow = "";
  }
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  if (instance) instance.scrollTo(target, { offset, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}
