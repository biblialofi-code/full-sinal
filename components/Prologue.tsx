"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PROLOGUE } from "@/lib/content";
import { playSfx } from "@/lib/sfx";
import { Pingo } from "./Signal";

// Texto que aparece letra a letra; um toque completa, outro avança.
export function useTypewriter(text: string, speed = 22) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((x) => (x >= text.length ? x : x + 1)), speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { shown: text.slice(0, n), done: n >= text.length, finish: () => setN(text.length) };
}

export function Clock({ time }: { time: string }) {
  return <div className="clock">🕘 {time}</div>;
}

export function Prologue({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const beat = PROLOGUE[i];
  const tw = useTypewriter(beat.text);
  const last = i === PROLOGUE.length - 1;

  function tap() {
    if (!tw.done) return tw.finish();
    playSfx("tap", 0.4);
    if (last) onDone();
    else setI(i + 1);
  }

  return (
    <div className="prologue" onClick={tap}>
      <div className="progresswrap">
        <Clock time={beat.clock} />
        <div style={{ flex: 1 }} />
        <button className="skip" onClick={(e) => { e.stopPropagation(); onDone(); }}>Pular</button>
      </div>
      <div className="prostage">
        <motion.div key={i} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15 }}>
          <Pingo size={190} mood={beat.mood} />
        </motion.div>
        <div className="probubble">
          {tw.shown}
          <span className="caret" style={{ opacity: tw.done ? 0 : 1 }}>▍</span>
        </div>
      </div>
      <div className="profoot">
        <div className="beats">
          {PROLOGUE.map((_, k) => <i key={k} className={k <= i ? "on" : ""} />)}
        </div>
        <button className="cta g" onClick={(e) => { e.stopPropagation(); tap(); }}>
          {!tw.done ? "Continuar" : last ? "Escolher minha mesa" : "Continuar"}
        </button>
      </div>
    </div>
  );
}
