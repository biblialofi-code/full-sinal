// Armazenamento de leads em arquivo JSON (data/leads.json).
// Serve pra rodar local / no notebook do estande (`next start`).
// ATENÇÃO: em Vercel o disco é somente leitura — antes de publicar lá, trocar
// as funções abaixo por um banco (Postgres/Upstash/Sheets). A interface é só essa.
import { promises as fs } from "fs";
import os from "os";
import path from "path";

export type Lead = {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: string;
  career: string;
  score: number;
  rank: string;
  consent: boolean;
  createdAt: string;
};

// Na Vercel só /tmp é gravável (e some entre execuções): serve para demo, não para guardar leads de verdade.
const FILE = process.env.VERCEL ? path.join(os.tmpdir(), "leads.json") : path.join(process.cwd(), "data", "leads.json");

async function readAll(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

let queue: Promise<unknown> = Promise.resolve();

export function addLead(lead: Lead): Promise<Lead[]> {
  const run = queue.then(async () => {
    const all = await readAll();
    all.push(lead);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(all, null, 2));
    return all;
  });
  queue = run.catch(() => {});
  return run;
}

export async function getLeads() {
  return readAll();
}

export function toCsv(leads: Lead[]) {
  const head = ["data", "nome", "email", "curso", "semestre", "carreira", "pontos", "patente", "consentimento"];
  const esc = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = leads.map((l) =>
    [l.createdAt, l.name, l.email, l.course, l.semester, l.career, l.score, l.rank, l.consent ? "sim" : "não"].map(esc).join(",")
  );
  return "﻿" + [head.join(","), ...rows].join("\n");
}
