"use client";
// Gera o cartão de resultado (PNG 1080x1350, formato feed do Instagram) no navegador.

type CardData = { career: string; careerEmoji: string; rank: string; rankEmoji: string; score: number; correct: number; total: number };

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function makeCard(d: CardData): Promise<Blob> {
  const W = 1080;
  const H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#e3262e");
  bg.addColorStop(0.6, "#da291c");
  bg.addColorStop(1, "#901a11");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ondas de sinal decorativas
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.lineWidth = 6;
  for (let i = 1; i <= 6; i++) {
    ctx.beginPath();
    ctx.arc(W - 80, 140, i * 150, 0.5 * Math.PI, Math.PI);
    ctx.stroke();
  }

  try {
    const logo = await loadImg("/claro.svg");
    ctx.drawImage(logo, 60, 50, 170, 170);
  } catch {
    /* sem logo */
  }

  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.font = "700 74px Fredoka, system-ui, sans-serif";
  ctx.fillText("Full Sinal", 260, 128);
  ctx.font = "600 34px Nunito, system-ui, sans-serif";
  ctx.globalAlpha = 0.85;
  ctx.fillText("ADDSALES × Claro Internet", 262, 184);
  ctx.globalAlpha = 1;

  // cartão branco
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.25)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = "#fff";
  roundRect(ctx, 80, 300, W - 160, 820, 56);
  ctx.fill();
  ctx.restore();

  try {
    const p = await loadImg("/pingo.webp");
    const pw = 330;
    ctx.drawImage(p, W / 2 - pw / 2, 340, pw, pw * (p.naturalHeight / p.naturalWidth));
  } catch {
    /* sem mascote */
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#9a8b89";
  ctx.font = "800 34px Nunito, system-ui, sans-serif";
  ctx.fillText(`${d.careerEmoji}  ${d.career.toUpperCase()}`, W / 2, 780);

  ctx.fillStyle = "#da291c";
  ctx.font = "700 210px Fredoka, system-ui, sans-serif";
  ctx.fillText(String(d.score), W / 2, 960);
  ctx.fillStyle = "#9a8b89";
  ctx.font = "800 34px Nunito, system-ui, sans-serif";
  ctx.fillText("MBPS DE TALENTO", W / 2, 1015);

  ctx.fillStyle = "#3b2a29";
  ctx.font = "600 58px Fredoka, system-ui, sans-serif";
  ctx.fillText(`${d.rankEmoji}  ${d.rank}  ·  ${d.correct}/${d.total}`, W / 2, 1085);

  ctx.fillStyle = "#fff";
  ctx.font = "800 40px Nunito, system-ui, sans-serif";
  ctx.fillText("Você aguenta o sinal? Jogue também.", W / 2, 1220);
  ctx.globalAlpha = 0.8;
  ctx.font = "700 32px Nunito, system-ui, sans-serif";
  ctx.fillText("#FullSinal", W / 2, 1275);

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("falha ao gerar"))), "image/png"));
}

export async function shareOrDownload(d: CardData) {
  const blob = await makeCard(d);
  const file = new File([blob], "full-sinal.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], text: "Joguei o Full Sinal da ADDSALES × Claro!" });
      return;
    } catch {
      /* usuário cancelou: cai no download */
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "full-sinal.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
