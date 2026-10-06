import { addLead, type Lead } from "@/lib/leads";
import { randomUUID } from "crypto";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "json inválido" }, { status: 400 });
  }
  const name = clip(b.name, 80);
  const email = clip(b.email, 120).toLowerCase();
  if (!name || !EMAIL.test(email)) return Response.json({ error: "nome ou e-mail inválido" }, { status: 400 });
  if (b.consent !== true) return Response.json({ error: "consentimento obrigatório" }, { status: 400 });
  const score = Math.max(0, Math.min(2000, Math.round(Number(b.score) || 0)));

  const lead: Lead = {
    id: randomUUID(),
    name,
    email,
    course: clip(b.course, 80),
    semester: clip(b.semester, 20),
    career: clip(b.career, 30),
    score,
    rank: clip(b.rank, 30),
    consent: true,
    createdAt: new Date().toISOString(),
  };
  try {
    const all = await addLead(lead);
    const position = [...all].sort((a, c) => c.score - a.score).findIndex((l) => l.id === lead.id) + 1;
    return Response.json({ ok: true, position, total: all.length });
  } catch {
    return Response.json({ error: "falha ao salvar" }, { status: 500 });
  }
}
