"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { CAREERS, MAX_BARS, professorLine, rankFor } from "@/lib/content";
import type { Career } from "@/lib/content";
import { Signal, Professor, Pingo } from "./Signal";
import { shareOrDownload } from "@/lib/shareCard";
import type { RunResult } from "./Run";

export function Title({ onStart, totem }: { onStart: () => void; totem: boolean }) {
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => {
    if (!totem) return;
    QRCode.toDataURL(window.location.origin, { margin: 1, width: 300, color: { dark: "#901a11", light: "#ffffff" } })
      .then(setQr)
      .catch(() => {});
  }, [totem]);

  return (
    <div className="titlewrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/claro.svg" alt="Claro" className="clarologo" />
      <Pingo size={170} mood="happy" />
      <div className="wordmark">Full Sinal</div>
      <div className="tagtop">Um dia na ADDSALES, com a Claro na conexão</div>
      <button className="cta g" style={{ maxWidth: 320, marginTop: 20 }} onClick={onStart}>Jogar agora</button>
      <div className="tfoot">Leva cerca de 3 minutos · ADDSALES × Claro Internet</div>
      {totem && qr && (
        <div className="qrbox">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR code para jogar no celular" />
          <span>Prefere jogar no celular? Escaneia aqui</span>
        </div>
      )}
    </div>
  );
}

export function CareerPick({ onPick, onBack }: { onPick: (c: Career) => void; onBack: () => void }) {
  return (
    <div className="screen">
      <div className="progresswrap">
        <button className="xbtn" onClick={onBack} aria-label="Voltar">✕</button>
        <div style={{ flex: 1 }} />
      </div>
      <div className="profrow">
        <Professor />
        <div className="bubble">Qual carreira você quer testar hoje? Escolha a que mais combina com você. Aqui ninguém avalia currículo.</div>
      </div>
      <div className="careers">
        {CAREERS.map((c) => (
          <button key={c.id} className={"career " + c.color} onClick={() => onPick(c)}>
            <span className="ce">{c.emoji}</span>
            <span className="cn">{c.name}</span>
            <span className="cp">{c.pitch}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Result({
  career,
  r,
  onLead,
  onAgain,
}: {
  career: Career;
  r: RunResult;
  onLead: () => void;
  onAgain: () => void;
}) {
  const rank = rankFor(r.score);
  const [shown, setShown] = useState(0);
  const [sharing, setSharing] = useState(false);
  async function share() {
    setSharing(true);
    try {
      await shareOrDownload({ career: career.name, careerEmoji: career.emoji, rank: rank.name, rankEmoji: rank.emoji, score: r.score, correct: r.correct, total: r.total });
    } finally {
      setSharing(false);
    }
  }
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 1200);
      setShown(Math.round(r.score * (1 - Math.pow(1 - p, 3))));
      if (p >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [r.score]);

  return (
    <div className="screen" style={{ position: "relative", overflow: "hidden" }}>
      <div className="summary" style={{ paddingBottom: 6 }}>
        <div className="eyebrow">{career.emoji} {career.name}</div>
        <div className="speedometer">
          <div className="mbps">{shown}</div>
          <div className="mbpsl">Mbps de talento</div>
          <div style={{ marginTop: 8 }}><Signal bars={r.bars} max={MAX_BARS} /></div>
        </div>
      </div>

      <motion.div className="rankcard" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="re">{rank.emoji}</div>
        <div className="rn">{rank.name}</div>
        <div className="sub">{r.correct} de {r.total} desafios</div>
      </motion.div>

      <div className="profrow" style={{ marginTop: 14 }}>
        <Professor size={58} mood={r.correct >= Math.ceil(r.total / 2) ? "happy" : "sad"} />
        <div className="bubble">{professorLine(r.correct, r.total, r.bars)} <br />{rank.say}</div>
      </div>

      <div className="casebox"><b>Sabia que?</b>{career.caseNote}</div>

      <div className="pad" style={{ marginTop: 18 }}>
        <button className="cta g" onClick={onLead}>Entrar no ranking</button>
        <button className="cta s" style={{ marginTop: 10 }} disabled={sharing} onClick={share}>{sharing ? "Gerando…" : "Baixar meu resultado"}</button>
        <button className="cta k" style={{ marginTop: 10 }} onClick={onAgain}>Jogar outra carreira</button>
      </div>
    </div>
  );
}

const SEMESTERS = ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º ou +", "Já formei"];

export function LeadForm({
  r,
  career,
  onDone,
  onSkip,
}: {
  r: RunResult;
  career: Career;
  onDone: (position: number | null) => void;
  onSkip: () => void;
}) {
  const [f, setF] = useState({ name: "", email: "", course: "", semester: "", consent: false });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return setErr("Informe seu nome.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return setErr("Confira o e-mail, parece incompleto.");
    if (!f.consent) return setErr("Marque o aceite para entrar no ranking.");
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...f, career: career.id, score: r.score, rank: rankFor(r.score).name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "erro");
      onDone(data.position ?? null);
    } catch {
      setErr("O sinal falhou. Tente novamente em instantes.");
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <div className="progresswrap">
        <button className="xbtn" onClick={onSkip} aria-label="Voltar">✕</button>
        <div style={{ flex: 1 }} />
      </div>
      <div className="profrow">
        <Professor />
        <div className="bubble">Deixe seus dados e eu coloco você no ranking. Uso só para contato sobre oportunidades.</div>
      </div>
      <form className="form" onSubmit={submit} style={{ marginTop: 10 }}>
        <div className="field">
          <label htmlFor="n">Nome</label>
          <input id="n" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="e">E-mail</label>
          <input id="e" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="c">Curso</label>
          <input id="c" value={f.course} onChange={(e) => set("course", e.target.value)} placeholder="Ex.: Ciência da Computação" />
        </div>
        <div className="field">
          <label htmlFor="s">Semestre</label>
          <select id="s" value={f.semester} onChange={(e) => set("semester", e.target.value)}>
            <option value="">Selecione</option>
            {SEMESTERS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {/* TODO(jurídico): substituir pelo texto LGPD aprovado e linkar a política de privacidade */}
        <label className="consent">
          <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />
          <span>Aceito que a ADDSALES use meus dados para contato sobre oportunidades e novidades, e para o ranking desta ativação.</span>
        </label>
        {err && <div className="formerr">{err}</div>}
        <button className="cta g" disabled={busy} style={busy ? { opacity: 0.6 } : undefined}>
          {busy ? "Enviando…" : "Entrar no ranking"}
        </button>
        <button type="button" className="cta k" onClick={onSkip}>Agora não</button>
      </form>
    </div>
  );
}

type Row = { name: string; score: number; rank: string; career: string };

export function Ranking({ position, myScore, onAgain }: { position: number | null; myScore: number; onAgain: () => void }) {
  const [top, setTop] = useState<Row[] | null>(null);
  useEffect(() => {
    fetch("/api/ranking", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setTop(d.top))
      .catch(() => setTop([]));
  }, []);

  return (
    <div className="screen">
      <div className="summary" style={{ paddingBottom: 0 }}>
        <div className="trophy">🏆</div>
        <div className="title">{position ? `Você está em ${position}º!` : "Você está no ranking!"}</div>
        <div className="sub">{myScore} Mbps de talento · obrigado por jogar.</div>
      </div>
      <div className="rank">
        {top === null && <div className="rkrow">Carregando…</div>}
        {top?.length === 0 && <div className="rkrow">Ainda ninguém por aqui.</div>}
        {top?.map((t, i) => (
          <div key={i} className={"rkrow" + (position === i + 1 ? " me" : "")}>
            <span className="pos">{i + 1}</span>
            <span className="nm">{t.name}</span>
            <span className="sc">{t.score}</span>
          </div>
        ))}
      </div>
      <div className="pad" style={{ marginTop: 18 }}>
        <button className="cta g" onClick={onAgain}>Jogar de novo</button>
      </div>
    </div>
  );
}
