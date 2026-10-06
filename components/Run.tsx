"use client";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Career } from "@/lib/content";
import { MAX_BARS, POINTS_RIGHT, speedBonus, OK_LINES, NO_LINES, BAR_LINES, COMBO_LINES } from "@/lib/content";
import { shuffleWithAnswer } from "@/lib/util";
import { playSfx } from "@/lib/sfx";
import { Blocks, Sort, Match, Spot } from "./exercises";
import { Signal, Professor, Pingo } from "./Signal";

const rand = (a: string[]) => a[Math.floor(Math.random() * a.length)];

export type RunResult = { correct: number; total: number; score: number; bars: number };

export function Run({ career, onExit, onDone }: { career: Career; onExit: () => void; onDone: (r: RunResult) => void }) {
  const total = career.questions.length;
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"intro" | "answer" | "feedback">("intro");
  const [sel, setSel] = useState<number | null>(null);
  const [wasRight, setWasRight] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [bars, setBars] = useState(MAX_BARS);
  const [score, setScore] = useState(0);
  const [gain, setGain] = useState(0);
  const [fb, setFb] = useState("");
  const [hit, setHit] = useState(0);
  const [combo, setCombo] = useState(0);
  const [extra, setExtra] = useState("");
  const startedAt = useRef(0);

  const q = career.questions[qi];
  const choice = useMemo(
    () => (q.kind === "choice" ? shuffleWithAnswer(q.options, q.answer) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qi]
  );

  function begin() {
    startedAt.current = performance.now();
    setPhase("answer");
  }

  function evaluate(right: boolean) {
    setWasRight(right);
    if (right) {
      const g = POINTS_RIGHT + speedBonus(performance.now() - startedAt.current);
      setGain(g);
      setScore((s) => s + g);
      setCorrect((c) => c + 1);
      const c = combo + 1;
      setCombo(c);
      setFb(rand(OK_LINES));
      setExtra(COMBO_LINES[c] ?? "");
      playSfx("correct");
    } else {
      setGain(0);
      const nb = Math.max(0, bars - 1);
      setBars(nb);
      setHit((h) => h + 1);
      setCombo(0);
      setFb(rand(NO_LINES));
      setExtra(BAR_LINES[nb] ?? "");
      playSfx("wrong");
    }
    setPhase("feedback");
  }

  function verifyChoice() {
    if (q.kind !== "choice" || sel === null || !choice) return;
    evaluate(sel === choice.answer);
  }

  function next() {
    if (qi + 1 >= total) {
      playSfx("complete");
      onDone({ correct, total, score, bars });
      return;
    }
    setQi((i) => i + 1);
    setSel(null);
    begin();
  }

  const answering = phase === "answer";
  const progress = answering ? qi / total : (qi + 1) / total;

  if (phase === "intro") {
    return (
      <div className="screen">
        <div className="progresswrap">
          <button className="xbtn" onClick={onExit} aria-label="Sair">✕</button>
          <div style={{ flex: 1 }} />
        </div>
        <div className="lessonintro">
          <motion.div initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 240, damping: 14 }}>
            <Professor size={120} mood="happy" />
          </motion.div>
          <div className="eyebrow">{career.emoji} {career.name}</div>
          <div className="introbubble">{career.intro}</div>
          <button className="cta g" onClick={begin}>Bora começar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingBottom: 190 }}>
      <div className="progresswrap">
        <button className="xbtn" onClick={onExit} aria-label="Sair">✕</button>
        <div className="pbar"><i style={{ width: `${progress * 100}%` }} /></div>
        <div className="scorepill">⚡ {score}</div>
        <div key={hit} className={"signalpill" + (hit ? " hit" : "")}><Signal bars={bars} /></div>
      </div>

      <motion.div key={qi} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
        <div className="qstem">{q.stem}</div>

        {q.kind === "choice" && choice && (
          <div className="opts">
            {choice.options.map((opt, idx) => {
              let cls = "opt";
              if (answering) {
                if (sel === idx) cls += " sel";
              } else if (idx === choice.answer) cls += " correct";
              else if (idx === sel) cls += " wrong";
              else cls += " dim";
              return (
                <button key={idx} className={cls} disabled={!answering} onClick={() => { playSfx("tap", 0.4); setSel(idx); }}>
                  {opt}
                </button>
              );
            })}
          </div>
        )}
        {q.kind === "blocks" && <Blocks q={q} disabled={!answering} onAnswered={evaluate} />}
        {q.kind === "sort" && <Sort q={q} disabled={!answering} onAnswered={evaluate} />}
        {q.kind === "match" && <Match q={q} disabled={!answering} onAnswered={evaluate} />}
        {q.kind === "spot" && <Spot q={q} disabled={!answering} onAnswered={evaluate} />}
      </motion.div>

      {answering && q.kind === "choice" && (
        <div className="fbar" style={{ background: "transparent" }}>
          <button className="cta g" disabled={sel === null} style={sel === null ? { opacity: 0.5 } : undefined} onClick={verifyChoice}>
            Manda ver
          </button>
        </div>
      )}

      {phase === "feedback" && (
        <motion.div className={"fbar " + (wasRight ? "ok" : "no")} initial={{ y: 120 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 320, damping: 28 }}>
          <div className="ftitle">
            <Pingo size={40} mood={wasRight ? "happy" : "sad"} float={false} />
            {fb}
            {wasRight && <span style={{ marginLeft: "auto", fontSize: 16 }}>+{gain}</span>}
          </div>
          <div className="fnote">{q.note}</div>
          {extra && <div className="fextra">{extra}</div>}
          <button className={"cta " + (wasRight ? "g" : "r")} onClick={next}>{wasRight ? "Bora!" : "Seguir"}</button>
        </motion.div>
      )}
    </div>
  );
}
