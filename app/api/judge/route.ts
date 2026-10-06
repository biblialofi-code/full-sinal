import { getPersona } from "@/lib/personas";
import { allow, judgeArg1, judgeArg2, judgeContra, MAX_ANSWER, type Source } from "@/lib/judge";

export const maxDuration = 45;

const clean = (v: unknown) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_ANSWER);

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "json inválido" }, { status: 400 });
  }
  const persona = getPersona(String(b.personaId ?? ""));
  if (!persona) return Response.json({ error: "persona inválida" }, { status: 400 });

  const step = String(b.step ?? "");
  const answer = clean(b.answer);

  // Acima do limite: nada de custo de IA, responde pela avaliação de reserva.
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  return run(step, persona, b, answer, allow(ip));
}

async function run(step: string, persona: NonNullable<ReturnType<typeof getPersona>>, b: Record<string, unknown>, answer: string, ai: boolean) {
  const meta = (source: Source) => ({ source, limited: !ai });
  if (step === "arg1") {
    const { r, source } = await judgeArg1(persona, answer, ai);
    return Response.json({ ...r, ...meta(source) });
  }
  if (step === "contra") {
    const { text, source } = await judgeContra(persona, answer, ai);
    return Response.json({ text, ...meta(source) });
  }
  if (step === "arg2") {
    const score1 = Math.max(0, Math.min(10, Math.round(Number(b.score1) || 0)));
    const { r, source } = await judgeArg2(persona, clean(b.answer1), score1, clean(b.contra), answer, ai);
    return Response.json({ ...r, ...meta(source) });
  }
  return Response.json({ error: "step inválido" }, { status: 400 });
}
