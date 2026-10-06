"use client";
// Toca efeitos de /public/sounds/<nome>.mp3. Se o arquivo não existir, fica em
// silêncio (o play() rejeita e a gente ignora) — nunca quebra o jogo.

const cache: Record<string, HTMLAudioElement> = {};
let muted = false;

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}

export function playSfx(name: string, vol = 0.55) {
  if (typeof window === "undefined" || muted) return;
  try {
    let a = cache[name];
    if (!a) {
      a = new Audio(`/sounds/${name}.mp3`);
      a.preload = "auto";
      cache[name] = a;
    }
    a.currentTime = 0;
    a.volume = vol;
    void a.play().catch(() => {});
  } catch {
    /* silêncio */
  }
}
