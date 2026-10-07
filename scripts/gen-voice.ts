// Gera as falas do Pingo com o ElevenLabs em public/voice/<id>.mp3.
//
// 1) Crie E:\CLAUDE\full-sinal\.env.local (não vai para o Git) com:
//      ELEVENLABS_API_KEY=...
//      ELEVENLABS_VOICE_ID=...
// 2) Rode:  npx tsx scripts/gen-voice.ts          (só gera o que é novo ou mudou)
//           npx tsx scripts/gen-voice.ts --force  (refaz tudo)
//           npx tsx scripts/gen-voice.ts --only prologue-0,pick-area
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { VOICE_LINES } from "../lib/voiceLines";

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "voice");
const manifestPath = path.join(outDir, "manifest.json");

function loadEnv() {
  const f = path.join(root, ".env.local");
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

async function main() {
  loadEnv();
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID;
  const model = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
  if (!key || !voice) {
    console.error("Faltam ELEVENLABS_API_KEY e/ou ELEVENLABS_VOICE_ID no .env.local");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const onlyArg = args[args.indexOf("--only") + 1];
  const only = args.includes("--only") && onlyArg ? new Set(onlyArg.split(",")) : null;

  mkdirSync(outDir, { recursive: true });
  const manifest: Record<string, string> = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

  const ids = Object.keys(VOICE_LINES).filter((id) => !only || only.has(id));
  let done = 0;
  for (const id of ids) {
    const text = VOICE_LINES[id];
    // o hash inclui voz e modelo: trocar a voz refaz tudo
    const hash = createHash("sha1").update(`${voice}|${model}|${text}`).digest("hex").slice(0, 12);
    const file = path.join(outDir, `${id}.mp3`);
    if (!force && manifest[id] === hash && existsSync(file)) continue;

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.25, use_speaker_boost: true },
      }),
    });
    if (!r.ok) {
      console.error(`✗ ${id}: ${r.status} ${(await r.text()).slice(0, 200)}`);
      continue;
    }
    writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    manifest[id] = hash;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    done++;
    console.log(`✓ ${id}`);
  }
  console.log(`Pronto: ${done} gerada(s), ${ids.length - done} já estava(m) em dia.`);
}

main();
