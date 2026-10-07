"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PHOTO, composeSelfie, type SelfieData } from "@/lib/selfieFrame";
import { shareBlob } from "@/lib/shareCard";
import { playSfx } from "@/lib/sfx";

type Stage = "camera" | "countdown" | "preview" | "error";

// Selfie com moldura: câmera frontal, contagem 3-2-1, monta a imagem e compartilha.
export function Selfie({ data, onClose }: { data: SelfieData; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [stage, setStage] = useState<Stage>("camera");
  const [count, setCount] = useState(3);
  const [shot, setShot] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStage("error");
        setMsg("Este navegador não libera a câmera aqui. Envie uma foto da galeria.");
        return;
      }
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
        if (!alive) return s.getTracks().forEach((t) => t.stop());
        stream.current = s;
        if (video.current) {
          video.current.srcObject = s;
          await video.current.play().catch(() => {});
        }
      } catch {
        setStage("error");
        setMsg("Não deu para abrir a câmera. Verifique a permissão ou envie uma foto.");
      }
    })();
    return () => {
      alive = false;
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => () => {
    if (shot) URL.revokeObjectURL(shot.url);
  }, [shot]);

  async function finish(src: CanvasImageSource, sw: number, sh: number, mirror: boolean) {
    setBusy(true);
    try {
      const blob = await composeSelfie(src, sw, sh, mirror, data);
      setShot({ blob, url: URL.createObjectURL(blob) });
      setStage("preview");
      playSfx("complete");
    } catch {
      setMsg("Não foi possível montar a foto. Tente de novo.");
      setStage("error");
    } finally {
      setBusy(false);
    }
  }

  function shoot() {
    setStage("countdown");
    setCount(3);
    let n = 3;
    playSfx("tap", 0.5);
    const id = setInterval(() => {
      n -= 1;
      if (n > 0) {
        setCount(n);
        playSfx("tap", 0.5);
        return;
      }
      clearInterval(id);
      const v = video.current;
      if (!v || !v.videoWidth) {
        setStage("camera");
        return;
      }
      // congela o quadro atual num canvas antes de montar a moldura
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext("2d")!.drawImage(v, 0, 0);
      finish(c, c.width, c.height, true);
    }, 800);
  }

  function fromFile(f: File | undefined) {
    if (!f) return;
    const img = new Image();
    img.onload = () => finish(img, img.naturalWidth, img.naturalHeight, false);
    img.src = URL.createObjectURL(f);
  }

  async function share() {
    if (!shot) return;
    await shareBlob(shot.blob, "o-futuro-e-claro-selfie.jpg", "Meu nível de conexão no jogo O Futuro é Claro, na FIAP NEXT! #OFuturoÉClaro");
  }

  function retake() {
    setShot(null);
    setStage(stream.current ? "camera" : "error");
  }

  return (
    <div className="selfie">
      <div className="progresswrap">
        <button className="xbtn" style={{ color: "#fff" }} onClick={onClose} aria-label="Fechar">✕</button>
        <div className="selfie-t">Selfie de resultado</div>
        <div style={{ width: 24 }} />
      </div>

      {stage === "preview" && shot ? (
        <div className="selfie-body">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="selfie-out" src={shot.url} alt="Sua selfie com a moldura do O Futuro é Claro" />
          <button className="cta k" onClick={share}>Compartilhar nas redes</button>
          <button className="cta ghostw" onClick={retake}>Tirar outra</button>
        </div>
      ) : stage === "error" ? (
        <div className="selfie-body">
          <div className="selfie-msg">{msg}</div>
          <label className="cta k" style={{ textAlign: "center" }}>
            Escolher foto
            <input type="file" accept="image/*" capture="user" hidden onChange={(e) => fromFile(e.target.files?.[0])} />
          </label>
        </div>
      ) : (
        <div className="selfie-body">
          <div className="viewfinder" style={{ aspectRatio: `${PHOTO.w} / ${PHOTO.h}` }}>
            <video ref={video} playsInline muted />
            <div className="vf-badge">{data.tierEmoji} {data.tier}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="vf-pingo" src="/pingo.webp" alt="" />
            <AnimatePresence>
              {stage === "countdown" && (
                <motion.div key={count} className="vf-count" initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                  {count}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="shutter" disabled={stage === "countdown" || busy} onClick={shoot} aria-label="Tirar foto">
            <span />
          </button>
          <div className="selfie-hint">Enquadre o rosto e toque no botão. A foto fica só no seu aparelho.</div>
        </div>
      )}
    </div>
  );
}
