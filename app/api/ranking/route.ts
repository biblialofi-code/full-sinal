import { getLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

// Ranking público: só primeiro nome + inicial, nunca e-mail.
export async function GET() {
  const all = await getLeads();
  const top = [...all]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((l) => {
      const [first, ...rest] = l.name.split(/\s+/);
      const initial = rest.length ? ` ${rest[rest.length - 1][0].toUpperCase()}.` : "";
      return { name: first + initial, score: l.score, rank: l.rank, career: l.career };
    });
  return Response.json({ top, total: all.length });
}
