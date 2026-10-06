import { getLeads, toCsv } from "@/lib/leads";

export const dynamic = "force-dynamic";

// /api/export?key=<ADMIN_KEY>  → baixa os leads em CSV. Defina ADMIN_KEY no ambiente.
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) return new Response("não autorizado", { status: 401 });
  return new Response(toCsv(await getLeads()), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="leads.csv"' },
  });
}
