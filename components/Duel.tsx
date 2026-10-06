"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Persona } from "@/lib/personas";
import {
  JUDGING_LINES,
  REACT_LOW,
  REACT_MID,
  REACT_OK,
  VERDICT_LABEL,
  pingoVerdictLine,
  scoreFor,
  verdictFor,
  type Verdict,
} from "@/lib/content";
import { playSfx } from "@/lib/sfx";
import { Pingo, Professor } from "./Signal";

export type DuelResult = { persona: Persona; verdict: Verdict; s1: number; s2: number; total: number; score: number; mode: "ai" | "fallback" };

type Feedback = { score: number; summary: string; good: string; missing: string; study: string; up?: string };

const MAX = 600;
const rand = (a: string[]) => a[Math.floor(Math.random() * a.length)];

async function post<T>(body: Record<string, unknown>): Promise<T & { source: "ai" | "fallback" }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 40000);
  try {
    const r = await fetch("/api/judge", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: ctrl.signal });
    if (!r.ok) throw new Error("falha");
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

function Judging() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % JUDGING_LINES.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div className="judging" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Pingo size={130} mood="idle" />
      <div className="judgingline">{JUDGING_LINES[i]}</div>
      <div className="dots"><i /><i /><i /></div>
    </motion.div>
  );
}

function FeedbackCard({ n, f, mood }: { n: 1 | 2; f: Feedback; mood: "happy" | "sad" | "idle" }) {
  return (
    <motion.div className="fcard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="fhead">
        <Professor size={46} mood={mood} />
        <div style={{ flex: 1 }}>
          <div className="fkicker">Argumento {n}</div>
          <div className="fsummary">{f.summary}</div>
        </div>
        <div className="fscore"><b>{f.score}</b>/10</div>
      </div>
      {f.good && <div className="frow ok"><span>✓</span><p>{f.good}</p></div>}
      {f.missing && <div className="frow no"><span>✗</span><p>{f.missing}</p></div>}
      {f.up && <div className="frow up"><span>↗</span><p>{f.up}</p></div>}
      {f.study && <div className="frow st"><span>📚</span><p>{f.study}</p></div>}
    </motion.div>
  );
}

function PersonaBubble({ p, text, tag }: { p: Persona; text: string; tag?: string }) {
  return (
    <div className="pcard">
      <div className="pavatar" style={{ background: p.color }}>{p.emoji}</div>
      <div className="pbody">
        <div className="pname">{p.name} <span>{p.archetype}</span></div>
        {tag && <div className="ptag">{tag}</div>}
        <div className="pspeech">{text}</div>
      </div>
    </div>
  );
}

export function Duel({ persona, onExit, onDone }: { persona: Persona; onExit: () => void; onDone: (r: DuelResult) => void }) {
  type Phase = "intro" | "a1" | "judging1" | "a2" | "judging2" | "done";
  const [phase, setPhase] = useState<Phase>("intro");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [f1, setF1] = useState<Feedback | null>(null);
  const [f2, setF2] = useState<Feedback | null>(null);
  const [contra, setContra] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"ai" | "fallback">("ai");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [phase, f1, f2]);

  const reactFor = (s: number) => rand(s >= 7 ? REACT_OK : s >= 5 ? REACT_MID : REACT_LOW);
  const moodFor = (s: number) => (s >= 7 ? "happy" : s >= 5 ? "idle" : "sad");

  async function sendFirst() {
    if (a1.trim().length < 3) return setErr("Escreva seu argumento antes de enviar.");
    setErr("");
    setPhase("judging1");
    playSfx("tap", 0.4);
    try {
      const [j, c] = await Promise.all([
        post<Feedback>({ step: "arg1", personaId: persona.id, answer: a1 }),
        post<{ text: string }>({ step: "contra", personaId: persona.id, answer: a1 }),
      ]);
      if (j.source === "fallback" || c.source === "fallback") setMode("fallback");
      setF1(j);
      setContra(c.text);
      playSfx(j.score >= 5 ? "correct" : "wrong");
      setPhase("a2");
    } catch {
      setErr("O sinal falhou. Tente enviar novamente.");
      setPhase("a1");
    }
  }

  async function sendSecond() {
    if (!f1) return;
    setErr("");
    setPhase("judging2");
    playSfx("tap", 0.4);
    try {
      const j = await post<Feedback>({ step: "arg2", personaId: persona.id, answer: a2, answer1: a1, score1: f1.score, contra });
      if (j.source === "fallback") setMode("fallback");
      setF2(j);
      const total = f1.score + j.score;
      const verdict = verdictFor(total, persona.dc);
      playSfx(verdict === "saved" ? "levelup" : verdict === "resist" ? "complete" : "wrong");
      setPhase("done");
    } catch {
      setErr("O sinal falhou. Tente enviar novamente.");
      setPhase("a2");
    }
  }

  const total = (f1?.score ?? 0) + (f2?.score ?? 0);
  const verdict = verdictFor(total, persona.dc);
  const step = phase === "intro" ? 0 : phase === "a1" || phase === "judging1" ? 1 : phase === "a2" || phase === "judging2" ? 2 : 3;

  return (
    <div className="screen duel">
      <div className="progresswrap">
        <button className="xbtn" onClick={onExit} aria-label="Sair">✕</button>
        <div className="pbar"><i style={{ width: `${(step / 3) * 100}%` }} /></div>
        <div className="scorepill">DC {persona.dc}</div>
      </div>

      <div className="duelbody">
        <PersonaBubble p={persona} text={persona.question} tag={`${persona.difficulty} · convencer exige ${persona.dc} de 20`} />

        {phase === "intro" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pad">
            <div className="rulebox">
              Você terá <b>dois argumentos</b>. Eu avalio cada um de 0 a 10. Se a soma chegar a <b>{persona.dc}</b>, a persona se convence.
            </div>
            <button className="cta g" onClick={() => setPhase("a1")}>Argumentar</button>
          </motion.div>
        )}

        {(phase === "a1" || phase === "judging1") && (
          <div className="pad">
            <div className="alabel">Seu 1º argumento</div>
            <textarea
              className="answer"
              value={a1}
              maxLength={MAX}
              disabled={phase === "judging1"}
              autoFocus
              placeholder="Explique com suas palavras. Conceito, exemplo e uma ação concreta valem pontos."
              onChange={(e) => setA1(e.target.value)}
            />
            <div className="count">{a1.length}/{MAX}</div>
            {err && <div className="formerr">{err}</div>}
            <button className="cta g" disabled={phase === "judging1"} onClick={sendFirst}>Enviar argumento</button>
          </div>
        )}

        {f1 && (phase === "a2" || phase === "judging2" || phase === "done") && (
          <>
            <div className="yoububble"><span>Você</span>{a1}</div>
            <FeedbackCard n={1} f={f1} mood={moodFor(f1.score)} />
            <PersonaBubble p={persona} text={contra} tag="Réplica" />
          </>
        )}

        {(phase === "a2" || phase === "judging2") && (
          <div className="pad">
            <div className="alabel">Seu 2º argumento: responda à réplica</div>
            <textarea
              className="answer"
              value={a2}
              maxLength={MAX}
              disabled={phase === "judging2"}
              autoFocus
              placeholder="Aprofunde. Enfrente a objeção sem repetir o que já disse."
              onChange={(e) => setA2(e.target.value)}
            />
            <div className="count">{a2.length}/{MAX}</div>
            {err && <div className="formerr">{err}</div>}
            <button className="cta g" disabled={phase === "judging2"} onClick={sendSecond}>Enviar argumento</button>
          </div>
        )}

        {f2 && phase === "done" && (
          <>
            <div className="yoububble"><span>Você</span>{a2 || "(sem resposta)"}</div>
            <FeedbackCard n={2} f={f2} mood={moodFor(f2.score)} />
            <motion.div className={"verdict " + verdict} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16 }}>
              <div className="vbar">
                <span>ARG.1 <b>{f1?.score}</b></span>
                <span>+</span>
                <span>ARG.2 <b>{f2.score}</b></span>
                <span>=</span>
                <span>TOTAL <b>{total}</b> / DC <b>{persona.dc}</b></span>
              </div>
              <div className="vlabel">{VERDICT_LABEL[verdict]}</div>
              <div className="vsay">{reactFor(f2.score)} {pingoVerdictLine(verdict)}</div>
              {mode === "fallback" && <div className="vnote">Avaliação automática simplificada (a IA ficou indisponível).</div>}
              <button
                className="cta g"
                onClick={() => onDone({ persona, verdict, s1: f1?.score ?? 0, s2: f2.score, total, score: scoreFor(f1?.score ?? 0, f2.score), mode })}
              >
                Ver meu resultado
              </button>
            </motion.div>
          </>
        )}
        <div ref={bottom} />
      </div>

      <AnimatePresence>{(phase === "judging1" || phase === "judging2") && <Judging />}</AnimatePresence>
    </div>
  );
}
