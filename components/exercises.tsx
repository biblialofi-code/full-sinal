"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BlocksQ, SortQ, MatchQ, SpotQ } from "@/lib/content";
import { shuffleWithAnswer } from "@/lib/util";
import { playSfx } from "@/lib/sfx";

const tap = () => playSfx("tap", 0.4);

type Common = { disabled: boolean; onAnswered: (correct: boolean) => void };

function VerifyBar({ disabled, ready, onClick }: { disabled: boolean; ready: boolean; onClick: () => void }) {
  if (disabled) return null;
  return (
    <div className="fbar" style={{ background: "transparent" }}>
      <button className="cta g" disabled={!ready} style={!ready ? { opacity: 0.5 } : undefined} onClick={onClick}>
        Manda ver
      </button>
    </div>
  );
}

/* ---------- Montar resposta com blocos ---------- */
export function Blocks({ q, disabled, onAnswered }: { q: BlocksQ } & Common) {
  const [picks, setPicks] = useState<number[]>([]);
  const used = useMemo(() => {
    const u = q.bank.map(() => false);
    picks.forEach((i) => (u[i] = true));
    return u;
  }, [picks, q.bank]);

  const ready = picks.length === q.answer.length;

  function add(i: number) {
    if (disabled || used[i]) return;
    tap();
    setPicks((p) => [...p, i]);
  }
  function removeAt(pos: number) {
    if (disabled) return;
    tap();
    setPicks((p) => p.filter((_, k) => k !== pos));
  }
  function verify() {
    const text = picks.map((i) => q.bank[i]);
    onAnswered(JSON.stringify(text) === JSON.stringify(q.answer));
  }

  return (
    <>
      <div className="answerline">
        {picks.map((i, pos) => (
          <button key={pos} className="chip sel" onClick={() => removeAt(pos)}>
            {q.bank[i]}
          </button>
        ))}
      </div>
      <div className="bankrow">
        {q.bank.map((tok, i) => (
          <button key={i} className={"chip" + (used[i] ? " ghost" : "")} onClick={() => add(i)}>
            {tok}
          </button>
        ))}
      </div>
      <VerifyBar disabled={disabled} ready={ready} onClick={verify} />
    </>
  );
}

/* ---------- Arrastar em caixas (por toque) ---------- */
export function Sort({ q, disabled, onAnswered }: { q: SortQ } & Common) {
  const [assign, setAssign] = useState<(0 | 1 | null)[]>(() => q.items.map(() => null));
  const [sel, setSel] = useState<number | null>(null);
  const ready = assign.every((a) => a !== null);

  function tapItem(i: number) {
    if (disabled || assign[i] !== null) return;
    tap();
    setSel(i === sel ? null : i);
  }
  function tapBucket(b: 0 | 1) {
    if (disabled || sel === null) return;
    tap();
    setAssign((a) => {
      const n = [...a];
      n[sel] = b;
      return n;
    });
    setSel(null);
  }
  function unassign(i: number) {
    if (disabled) return;
    setAssign((a) => {
      const n = [...a];
      n[i] = null;
      return n;
    });
  }
  function verify() {
    onAnswered(q.items.every((it, i) => assign[i] === it.bucket));
  }

  return (
    <>
      <div className="tray">
        {q.items.map((it, i) =>
          assign[i] === null ? (
            <button key={i} className={"chip" + (sel === i ? " sel" : "")} onClick={() => tapItem(i)}>
              {it.text}
            </button>
          ) : null
        )}
      </div>
      <div className="buckets">
        {[0, 1].map((b) => (
          <div key={b} className={"bucket" + (sel !== null ? " armed" : "")} onClick={() => tapBucket(b as 0 | 1)}>
            <div className="blabel">{q.buckets[b]}</div>
            <div className="bchips">
              {q.items.map((it, i) =>
                assign[i] === b ? (
                  <button key={i} className="chip ok" onClick={(e) => { e.stopPropagation(); unassign(i); }}>
                    {it.text}
                  </button>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
      <VerifyBar disabled={disabled} ready={ready} onClick={verify} />
    </>
  );
}

/* ---------- Parear (ligar) ---------- */
export function Match({ q, disabled, onAnswered }: { q: MatchQ } & Common) {
  const rights = useMemo(() => {
    const arr = q.pairs.map((p, i) => ({ text: p.right, idx: i }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [q.pairs]);

  const [matched, setMatched] = useState<boolean[]>(() => q.pairs.map(() => false));
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [bad, setBad] = useState<number | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!fired.current && matched.every(Boolean)) {
      fired.current = true;
      const t = setTimeout(() => onAnswered(true), 350);
      return () => clearTimeout(t);
    }
  }, [matched, onAnswered]);

  function tapLeft(i: number) {
    if (disabled || matched[i]) return;
    tap();
    setSelLeft(i === selLeft ? null : i);
  }
  function tapRight(idx: number) {
    if (disabled || selLeft === null || matched[idx]) return;
    tap();
    if (idx === selLeft) {
      setMatched((m) => {
        const n = [...m];
        n[selLeft] = true;
        return n;
      });
      setSelLeft(null);
    } else {
      setBad(idx);
      setTimeout(() => setBad(null), 420);
      setSelLeft(null);
    }
  }

  return (
    <div className="matchwrap">
      <div className="matchcol">
        {q.pairs.map((p, i) => (
          <button
            key={i}
            className={"mitem" + (matched[i] ? " done" : selLeft === i ? " sel" : "")}
            onClick={() => tapLeft(i)}
          >
            {p.left}
          </button>
        ))}
      </div>
      <div className="matchcol">
        {rights.map((r) => (
          <button
            key={r.idx}
            className={"mitem" + (matched[r.idx] ? " done" : bad === r.idx ? " bad" : "")}
            onClick={() => tapRight(r.idx)}
          >
            {r.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Caça ao erro ---------- */
export function Spot({ q, disabled, onAnswered }: { q: SpotQ } & Common) {
  const [sel, setSel] = useState<number | null>(null);
  const shuf = useMemo(() => shuffleWithAnswer(q.options, q.answer), [q]);

  function verify() {
    if (sel === null) return;
    onAnswered(sel === shuf.answer);
  }

  return (
    <>
      <div className="argcard">
        <div className="who">🔎 {q.who}</div>
        {q.scenario}
      </div>
      <div className="opts">
        {shuf.options.map((opt, idx) => {
          let cls = "opt";
          if (!disabled) {
            if (sel === idx) cls += " sel";
          } else {
            if (idx === shuf.answer) cls += " correct";
            else if (idx === sel) cls += " wrong";
            else cls += " dim";
          }
          return (
            <button key={idx} className={cls} disabled={disabled} onClick={() => { tap(); setSel(idx); }}>
              {opt}
            </button>
          );
        })}
      </div>
      <VerifyBar disabled={disabled} ready={sel !== null} onClick={verify} />
    </>
  );
}
