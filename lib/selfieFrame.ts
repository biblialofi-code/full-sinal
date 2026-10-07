"use client";
// Monta a selfie com moldura (1080x1920, formato Stories) no próprio aparelho.
// A foto nunca sai do navegador: nada é enviado ao servidor.
import { FRED, NUN, loadImg, roundRect } from "./shareCard";

export type SelfieData = {
  tier: string; // nível de conexão (Sem conexão … Claro)
  tierEmoji: string;
  career: string;
  careerEmoji: string;
  score: number;
  verdict: string;
};

export const W = 1080;
export const H = 1920;
// área da foto dentro da moldura (a prévia da câmera usa a mesma proporção)
export const PHOTO = { x: 60, y: 250, w: 960, h: 1080 };

// Desenha a imagem preenchendo o retângulo (corta o excesso), opcionalmente espelhada.
function drawCover(ctx: CanvasRenderingContext2D, src: CanvasImageSource, sw: number, sh: number, x: number, y: number, w: number, h: number, mirror: boolean) {
  const scale = Math.max(w / sw, h / sh);
  const cw = w / scale;
  const ch = h / scale;
  const cx = (sw - cw) / 2;
  const cy = (sh - ch) / 2;
  ctx.save();
  if (mirror) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(src, cx, cy, cw, ch, 0, 0, w, h);
  } else {
    ctx.drawImage(src, cx, cy, cw, ch, x, y, w, h);
  }
  ctx.restore();
}

export async function composeSelfie(src: CanvasImageSource, sw: number, sh: number, mirror: boolean, d: SelfieData): Promise<Blob> {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // fundo nos vermelhos Claro
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#e3262e");
  bg.addColorStop(0.55, "#da291c");
  bg.addColorStop(1, "#901a11");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,.07)";
  ctx.lineWidth = 6;
  for (let i = 1; i <= 7; i++) {
    ctx.beginPath();
    ctx.arc(W - 60, 120, i * 170, 0.5 * Math.PI, Math.PI);
    ctx.stroke();
  }

  const [logo, pingo] = await Promise.all([loadImg("/claro.svg").catch(() => null), loadImg("/pingo.webp").catch(() => null)]);

  // cabeçalho
  if (logo) ctx.drawImage(logo, 60, 58, 140, 140);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.font = `700 72px ${FRED()}`;
  ctx.fillText("O Futuro é Claro", 226, 138);
  ctx.font = `800 34px ${NUN()}`;
  ctx.globalAlpha = 0.85;
  ctx.fillText("Claro · FIAP NEXT", 230, 192);
  ctx.globalAlpha = 1;

  // foto com borda branca
  const { x, y, w, h } = PHOTO;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.3)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = "#fff";
  roundRect(ctx, x - 12, y - 12, w + 24, h + 24, 58);
  ctx.fill();
  ctx.restore();
  ctx.save();
  roundRect(ctx, x, y, w, h, 48);
  ctx.clip();
  drawCover(ctx, src, sw, sh, x, y, w, h, mirror);
  ctx.restore();

  // selo do nível sobre a foto
  ctx.font = `700 46px ${FRED()}`;
  const badge = `${d.tierEmoji} ${d.tier}`;
  const bw = ctx.measureText(badge).width + 64;
  ctx.fillStyle = "#fff";
  roundRect(ctx, x + 30, y + 30, bw, 84, 42);
  ctx.fill();
  ctx.fillStyle = "#da291c";
  ctx.fillText(badge, x + 62, y + 88);

  // Pingo espiando no canto
  if (pingo) {
    const pw = 340;
    ctx.drawImage(pingo, W - pw - 10, y + h - 250, pw, pw * (pingo.naturalHeight / pingo.naturalWidth));
  }

  // cartão de resultado
  const cy = 1400;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.25)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#fff";
  roundRect(ctx, 60, cy, 960, 330, 44);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#9a8b89";
  ctx.font = `900 28px ${NUN()}`;
  ctx.fillText("QUALIDADE DA CONEXÃO", 110, cy + 70);
  ctx.fillStyle = "#da291c";
  ctx.font = `700 112px ${FRED()}`;
  ctx.fillText(d.tier, 106, cy + 190);

  ctx.textAlign = "right";
  ctx.font = `700 96px ${FRED()}`;
  ctx.fillText(String(d.score), 970, cy + 160);
  ctx.fillStyle = "#9a8b89";
  ctx.font = `900 26px ${NUN()}`;
  ctx.fillText("MBPS DE TALENTO", 970, cy + 200);

  ctx.textAlign = "left";
  ctx.fillStyle = "#3b2a29";
  ctx.font = `800 38px ${NUN()}`;
  ctx.fillText(`${d.careerEmoji} ${d.career} · ${d.verdict}`, 110, cy + 280);

  // rodapé
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.font = `800 50px ${NUN()}`;
  ctx.fillText("#OFuturoÉClaro", W / 2, 1815);
  ctx.globalAlpha = 0.7;
  ctx.font = `800 24px ${NUN()}`;
  ctx.fillText("UMA EXPERIÊNCIA ADDSALES", W / 2, 1868);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("falha ao gerar"))), "image/jpeg", 0.92));
}
