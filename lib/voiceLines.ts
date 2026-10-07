// Catálogo das falas do Pingo que viram áudio (public/voice/<id>.mp3).
// Gerado por scripts/gen-voice.ts. Mudou um texto aqui? Rode o script de novo: ele refaz só o que mudou.
import { CAREERS, EPILOGUE, JUDGING_LINES, PROLOGUE, RANKS, pingoVerdictLine, type Verdict } from "./content";

export const PICK_AREA = "A tecnologia da Claro tem várias frentes. Em qual você quer trabalhar hoje?";

const VERDICTS: Verdict[] = ["saved", "resist", "damned"];

export const VOICE_LINES: Record<string, string> = {
  ...Object.fromEntries(PROLOGUE.map((b, i) => [`prologue-${i}`, b.text])),
  "pick-area": PICK_AREA,
  ...Object.fromEntries(CAREERS.map((c) => [`intro-${c.id}`, c.intro])),
  ...Object.fromEntries(JUDGING_LINES.map((t, i) => [`judging-${i}`, t])),
  ...Object.fromEntries(VERDICTS.map((v) => [`verdict-${v}`, pingoVerdictLine(v)])),
  ...Object.fromEntries(VERDICTS.map((v) => [`epilogue-${v}`, EPILOGUE[v]])),
  ...Object.fromEntries(RANKS.map((r, i) => [`rank-${i}`, r.say])),
};

export const rankVoiceId = (name: string) => `rank-${Math.max(0, RANKS.findIndex((r) => r.name === name))}`;
