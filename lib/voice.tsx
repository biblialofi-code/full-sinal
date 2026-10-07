"use client";
// Voz do Pingo: toca /voice/<id>.mp3. Uma fala por vez (a nova corta a anterior).
// Sem o arquivo, fica em silêncio. Mudo fica salvo no aparelho.
import { useEffect, useState } from "react";

const KEY = "ofec:mute";
let muted = false;
let current: HTMLAudioElement | null = null;
let queue: string[] = [];
const listeners = new Set<(m: boolean) => void>();

if (typeof window !== "undefined") {
  try {
    muted = localStorage.getItem(KEY) === "1";
  } catch {}
}

function playNext() {
  const id = queue.shift();
  if (!id || muted) return;
  const a = new Audio(`/voice/${id}.mp3`);
  current = a;
  a.onended = () => {
    if (current === a) playNext();
  };
  void a.play().catch(() => {});
}

export function stopVoice() {
  queue = [];
  if (current) {
    current.onended = null;
    current.pause();
    current = null;
  }
}

// Fala uma ou mais falas em sequência, interrompendo a que estiver tocando.
export function say(...ids: string[]) {
  if (typeof window === "undefined") return;
  stopVoice();
  if (muted) return;
  queue = ids;
  playNext();
}

export function setVoiceMuted(m: boolean) {
  muted = m;
  if (m) stopVoice();
  try {
    localStorage.setItem(KEY, m ? "1" : "0");
  } catch {}
  listeners.forEach((fn) => fn(m));
}

export function useVoiceMuted() {
  const [m, setM] = useState(false);
  useEffect(() => {
    setM(muted);
    listeners.add(setM);
    return () => {
      listeners.delete(setM);
    };
  }, []);
  return m;
}

// Fala ao montar a tela (ou quando os ids mudam)
export function useSay(...ids: (string | false | null | undefined)[]) {
  const key = ids.filter(Boolean).join("|");
  useEffect(() => {
    if (key) say(...key.split("|"));
    return () => stopVoice();
  }, [key]);
}

export function MuteButton() {
  const m = useVoiceMuted();
  return (
    <button className="mutebtn" aria-label={m ? "Ativar voz do Pingo" : "Silenciar voz do Pingo"} onClick={() => setVoiceMuted(!m)}>
      {m ? "🔇" : "🔊"}
    </button>
  );
}
