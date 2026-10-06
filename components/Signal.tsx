"use client";
import { motion } from "framer-motion";
import { MAX_BARS } from "@/lib/content";

export function Signal({ bars, max = MAX_BARS }: { bars: number; max?: number }) {
  return (
    <span className="signal" aria-label={`${bars} de ${max} barras de sinal`}>
      {Array.from({ length: max }).map((_, i) => (
        <i key={i} className={i < bars ? "" : "off"} style={{ height: 7 + i * 5 }} />
      ))}
    </span>
  );
}

export type Mood = "idle" | "happy" | "sad" | "wow";

// Pingo: mascote do jogo (arte oficial em /pingo.webp). O humor muda só o movimento.
export function Pingo({ size = 64, mood = "idle", float = true }: { size?: number; mood?: Mood; float?: boolean }) {
  const anim =
    !float ? undefined
    : mood === "sad" ? { rotate: [-5, 5, -5], y: [0, 2, 0] }
    : mood === "wow" ? { scale: [1, 1.12, 1] }
    : mood === "happy" ? { y: [0, -6, 0], rotate: [0, 3, 0] }
    : { y: [0, -3, 0] };
  return (
    <motion.img
      src="/pingo.webp"
      alt="Pingo, mascote do jogo"
      width={size}
      height={size * 0.91}
      draggable={false}
      animate={anim}
      transition={{ repeat: Infinity, duration: mood === "sad" ? 0.5 : 2, ease: "easeInOut" }}
      style={{ width: size, height: "auto", flex: "none", filter: mood === "sad" ? "saturate(.55) brightness(.95)" : undefined }}
    />
  );
}

// Pingo dentro do círculo branco usado nas falas
export function Professor({ size = 62, mood = "idle" }: { size?: number; mood?: Mood }) {
  return (
    <div className="profavatar" style={{ width: size, height: size }}>
      <Pingo size={size * 0.78} mood={mood} />
    </div>
  );
}
