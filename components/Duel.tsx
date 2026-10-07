"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Persona } from "@/lib/personas";
import {
  CLOCK,
  CRITERIA,
  DIFF_MULT,
  JUDGING_LINES,
  STARTERS_1,
  STARTERS_2,
  SPEED,
  fmtTime,
  noteTier,
  speedBonus,
  VERDICT_LABEL,
  pingoVerdictLine,
  scoreFor,
  verdictFor,
  type Verdict,
} from "@/lib/content";
import { playSfx } from "@/lib/sfx";
import { Pingo, Professor } from "./Signal";
import { Clock, useTypewriter } from "./Prologue";

export type DuelResult = {
  persona: Persona;
  verdict: Verdict;
  s1: number;
  s2: number;
  total: number;
  score: number;
  speed: { t1: number; t2: number; b1: number; b2: number };
  mode: "ai" | "fallback";
};

type Feedback = { score: number; summary: string; good: string; missing: string; study: string; up?: string };

const MAX = 600;

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
      <Pingo size={140} mood="idle" />
      <div className="judgingline">{JUDGING_LINES[i]}</div>
      <div className="dots"><i /><i /><i /></div>
    </motion.div>
  );
}

function FeedbackCard({ n, f }: { n: 1 | 2; f: Feedback }) {
  const mood = f.score >= 7 ? "happy" : f.score >= 5 ? "idle" : "sad";
  return (
    <motion.div className="fcard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="fhead">
        <Professor size={46} mood={mood} />
        <div style={{ flex: 1 }}>
          <div className="fkicker">Pingo · argumento {n}</div>
          <div className="fsummary">{f.summary}</div>
        </div>
        <div className="fscore"><b>{f.score}</b>/10<em>{noteTier(f.score)}</em></div>
      </div>
      {f.good && <div className="frow ok"><span>✓</span><p>{f.good}</p></div>}
      {f.missing && <div className="frow no"><span>✗</span><p>{f.missing}</p></div>}
      {f.up && <div className="frow up"><span>↗</span><p>{f.up}</p></div>}
      {f.study && <div className="frow st"><span>📚</span><p>{f.study}</p></div>}
    </motion.div>
  );
}

function Avatar({ p, size = 54 }: { p: Persona; size?: number }) {
  return (
    <div className="pavatar" style={{ background: p.color, width: size, height: size, fontSize: size * 0.52 }}>{p.emoji}</div>
  );
}

function PersonaSays({ p, text, tag, typed }: { p: Persona; text: string; tag?: string; typed?: boolean }) {
  const tw = useTypewriter(text, typed ? 20 : 0);
  return (
    <div className="pcard">
      <Avatar p={p} />
      <div className="pbody">
        <div className="pname">{p.name} <span>{p.archetype}</span></div>
        {tag && <div className="ptag">{tag}</div>}
        <div className="pspeech" onClick={tw.finish}>{typed ? tw.shown : text}</div>
      </div>
    </div>
  );
}

// Cronômetro do argumento: verde enquanto vale o bônus máximo, depois vai caindo.
function Stopwatch({ startedAt, running }: { startedAt: number; running: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  // atualiza a cada quadro para os milissegundos correrem na tela
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      setNow(Date.now());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  const ms = Math.max(0, now - startedAt);
  const bonus = speedBonus(ms, 10);
  const cls = ms <= SPEED.full ? "fast" : bonus > 0 ? "mid" : "slow";
  return (
    <div className={"stopwatch " + cls}>
      <span>⚡ {fmtTime(ms)}</span>
      <em>velocidade <b>{bonus} Mb</b></em>
    </div>
  );
}

function Composer({
  label,
  value,
  onChange,
  starters,
  busy,
  err,
  onSend,
  placeholder,
  startedAt,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  starters: string[];
  busy: boolean;
  err: string;
  onSend: () => void;
  placeholder: string;
  startedAt: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  function addStarter(s: string) {
    const sep = value && !/\s$/.test(value) ? " " : "";
    const next = (value + sep + s + " ").slice(0, MAX);
    onChange(next);
    playSfx("tap", 0.3);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (el) {
        el.focus();
        el.setSelectionRange(next.length, next.length);
      }
    });
  }
  const tooShort = value.trim().length < 40;
  return (
    <div className="pad composer">
      <div className="alabel">{label}</div>
      <Stopwatch startedAt={startedAt} running={!busy} />
      <div className="starters">
        {starters.map((s) => (
          <button key={s} type="button" className="starter" disabled={busy} onClick={() => addStarter(s)}>{s}…</button>
        ))}
      </div>
      <textarea ref={ref} className="answer" value={value} maxLength={MAX} disabled={busy} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      <div className="count">
        <span className={tooShort ? "" : "okc"}>{tooShort ? "Dica: 2 ou 3 frases rendem mais pontos" : "Bom tamanho ✓"}</span>
        <span>{value.length}/{MAX}</span>
      </div>
      {err && <div className="formerr">{err}</div>}
      <button className="cta g" disabled={busy || value.trim().length < 3} style={value.trim().length < 3 ? { opacity: 0.55 } : undefined} onClick={onSend}>
        Enviar argumento
      </button>
    </div>
  );
}

function VerdictReveal({
  p,
  s1,
  s2,
  speed,
  mode,
  onNext,
}: {
  p: Persona;
  s1: number;
  s2: number;
  speed: DuelResult["speed"];
  mode: "ai" | "fallback";
  onNext: () => void;
}) {
  const total = s1 + s2;
  const v = verdictFor(total, p.dc);
  const [stage, setStage] = useState(0); // 0 enchendo, 1 veredito, 2 reação
  useEffect(() => {
    const a = setTimeout(() => {
      setStage(1);
      playSfx(v === "saved" ? "levelup" : v === "resist" ? "complete" : "wrong");
    }, 1700);
    const b = setTimeout(() => setStage(2), 2600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [v]);

  return (
    <motion.div className={"reveal " + (stage ? v : "")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Clock time={CLOCK.verdict} />
      <div className="rtitle">O veredito de {p.name}</div>
      <div className="meter">
        <motion.i className="seg s1" initial={{ width: 0 }} animate={{ width: `${(s1 / 20) * 100}%` }} transition={{ duration: 0.7, ease: "easeOut" }} />
        <motion.i className="seg s2" initial={{ width: 0 }} animate={{ width: `${(s2 / 20) * 100}%` }} transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }} />
        <div className="dcmark" style={{ left: `${(p.dc / 20) * 100}%` }}><span>DC {p.dc}</span></div>
      </div>
      <div className="mlegend">
        <span>Arg. 1 <b>{s1}</b> {noteTier(s1)}</span>
        <span>Arg. 2 <b>{s2}</b> {noteTier(s2)}</span>
        <span>Total <b>{total}</b>/20</span>
      </div>
      <div className="speedline">
        ⚡ Velocidade: {fmtTime(speed.t1)} <b>{speed.b1} Mb</b> · {fmtTime(speed.t2)} <b>{speed.b2} Mb</b>
      </div>

      <AnimatePresence>
        {stage >= 1 && (
          <motion.div className="vlabel" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 13 }}>
            {VERDICT_LABEL[v]}
          </motion.div>
        )}
      </AnimatePresence>

      {stage >= 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="react">
            <Avatar p={p} size={46} />
            <div className="pspeech">{p.react[v]}</div>
          </div>
          <div className="profrow" style={{ padding: "10px 0 0" }}>
            <Professor size={46} mood={v === "saved" ? "happy" : v === "damned" ? "sad" : "idle"} />
            <div className="bubble">{pingoVerdictLine(v)}</div>
          </div>
          {mode === "fallback" && <div className="vnote">Avaliação automática simplificada (a IA ficou indisponível).</div>}
          <button className="cta g" onClick={onNext}>Encerrar o expediente</button>
        </motion.div>
      )}
    </motion.div>
  );
}

export function Duel({ persona, onExit, onDone }: { persona: Persona; onExit: () => void; onDone: (r: DuelResult) => void }) {
  type Phase = "brief" | "a1" | "judging1" | "a2" | "judging2" | "done";
  const [phase, setPhase] = useState<Phase>("brief");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [f1, setF1] = useState<Feedback | null>(null);
  const [f2, setF2] = useState<Feedback | null>(null);
  const [contra, setContra] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"ai" | "fallback">("ai");
  const anchor = useRef<HTMLDivElement>(null);
  const [start1, setStart1] = useState(0);
  const [start2, setStart2] = useState(0);
  const [t1, setT1] = useState(0);
  const [t2, setT2] = useState(0);

  // leva a tela até o novo bloco (feedback, réplica, veredito)
  useEffect(() => {
    if (phase === "a2" || phase === "done") anchor.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase]);

  async function sendFirst() {
    setT1(Date.now() - start1);
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
      // o relógio do 2º argumento só começa depois que a réplica termina de aparecer
      setStart2(Date.now() + c.text.length * 20);
      setPhase("a2");
    } catch {
      setErr("O sinal falhou. Tente enviar novamente.");
      setPhase("a1");
    }
  }

  async function sendSecond() {
    if (!f1) return;
    setT2(Math.max(0, Date.now() - start2));
    setErr("");
    setPhase("judging2");
    playSfx("tap", 0.4);
    try {
      const j = await post<Feedback>({ step: "arg2", personaId: persona.id, answer: a2, answer1: a1, score1: f1.score, contra });
      if (j.source === "fallback") setMode("fallback");
      setF2(j);
      setPhase("done");
    } catch {
      setErr("O sinal falhou. Tente enviar novamente.");
      setPhase("a2");
    }
  }

  const step = phase === "brief" ? 0 : phase === "a1" || phase === "judging1" ? 1 : phase === "a2" || phase === "judging2" ? 2 : 3;

  return (
    <div className="screen duel">
      <div className="progresswrap">
        <button className="xbtn" onClick={onExit} aria-label="Sair">✕</button>
        <div className="pbar"><i style={{ width: `${(step / 3) * 100}%` }} /></div>
        <div className="scorepill">DC {persona.dc}</div>
      </div>

      <div className="duelbody">
        {/* Briefing: a cena antes da conversa */}
        {phase === "brief" ? (
          <motion.div className="brief" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Clock time={CLOCK.briefing} />
            <div className="bhead">
              <Avatar p={persona} size={84} />
              <div>
                <div className="bkicker">Seu próximo caso</div>
                <div className="bname">{persona.name}</div>
                <div className="barch">{persona.archetype}</div>
              </div>
            </div>
            <div className="bscene">📍 {persona.context}</div>
            <div className="bstakes"><b>O que está em jogo</b>{persona.stakes}</div>
            <div className="bcrit">
              <div className="bcrit-t">Como o Pingo avalia cada argumento</div>
              {CRITERIA.map((c) => (
                <div key={c.label} className="crit"><span>{c.label}</span><em>{c.hint}</em><b>{c.max} pts</b></div>
              ))}
              <div className="bcrit-f">Dois argumentos. Para convencer, a soma precisa chegar a <b>{persona.dc}</b> de 20.{persona.difficulty !== "FÁCIL" && <> Caso {persona.difficulty.toLowerCase()} vale <b>×{DIFF_MULT[persona.difficulty]}</b> no ranking.</>}</div>
              <div className="bcrit-s">⚡ <b>A Claro é rápida.</b> Cada argumento começa valendo {SPEED.max} Mb de velocidade, que vão caindo depois de {SPEED.full / 1000}s. Os Mb entram no ranking se a nota for {SPEED.minNote} ou mais.</div>
            </div>
            <button
              className="cta g"
              onClick={() => {
                setStart1(Date.now() + persona.question.length * 20);
                setPhase("a1");
              }}
            >
              Entrar na conversa
            </button>
          </motion.div>
        ) : (
          <>
            <Clock time={CLOCK.duel} />
            <PersonaSays p={persona} text={persona.question} tag={persona.difficulty} typed={phase === "a1"} />
          </>
        )}

        {(phase === "a1" || phase === "judging1") && (
          <Composer
            label="Seu 1º argumento"
            value={a1}
            onChange={setA1}
            starters={STARTERS_1}
            busy={phase === "judging1"}
            startedAt={start1}
            err={err}
            onSend={sendFirst}
            placeholder="Explique com suas palavras. Conceito, exemplo e uma ação concreta valem pontos."
          />
        )}

        {f1 && phase !== "a1" && phase !== "judging1" && phase !== "brief" && (
          <>
            <div className="yoububble"><span>Você</span>{a1}</div>
            <div ref={phase === "a2" ? anchor : undefined} />
            <FeedbackCard n={1} f={f1} />
            <PersonaSays p={persona} text={contra} tag="Réplica" typed={phase === "a2"} />
          </>
        )}

        {(phase === "a2" || phase === "judging2") && (
          <Composer
            label="Seu 2º argumento: responda à réplica"
            value={a2}
            onChange={setA2}
            starters={STARTERS_2}
            busy={phase === "judging2"}
            startedAt={start2}
            err={err}
            onSend={sendSecond}
            placeholder="Aprofunde. Enfrente a objeção sem repetir o que já disse."
          />
        )}

        {f1 && f2 && phase === "done" && (
          <>
            <div className="yoububble"><span>Você</span>{a2 || "(sem resposta)"}</div>
            <FeedbackCard n={2} f={f2} />
            <div ref={anchor} />
            <VerdictReveal
              p={persona}
              s1={f1.score}
              s2={f2.score}
              speed={{ t1, t2, b1: speedBonus(t1, f1.score), b2: speedBonus(t2, f2.score) }}
              mode={mode}
              onNext={() => {
                const total = f1.score + f2.score;
                const speed = { t1, t2, b1: speedBonus(t1, f1.score), b2: speedBonus(t2, f2.score) };
                onDone({
                  persona,
                  verdict: verdictFor(total, persona.dc),
                  s1: f1.score,
                  s2: f2.score,
                  total,
                  score: scoreFor(f1.score, f2.score, persona.difficulty) + speed.b1 + speed.b2,
                  speed,
                  mode,
                });
              }}
            />
          </>
        )}
      </div>

      <AnimatePresence>{(phase === "judging1" || phase === "judging2") && <Judging />}</AnimatePresence>
    </div>
  );
}
