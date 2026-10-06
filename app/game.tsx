"use client";
import { useEffect, useState } from "react";
import type { Career } from "@/lib/content";
import { Run, type RunResult } from "@/components/Run";
import { Title, CareerPick, Result, LeadForm, Ranking } from "@/components/Screens";

type Screen = "title" | "career" | "run" | "result" | "lead" | "ranking";

const IDLE_MS = 60_000; // modo totem: volta ao início sem toque por 1 minuto

export default function Game() {
  const [screen, setScreen] = useState<Screen>("title");
  const [career, setCareer] = useState<Career | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [totem, setTotem] = useState(false);

  useEffect(() => {
    setTotem(new URLSearchParams(window.location.search).get("totem") === "1");
  }, []);

  // totem: qualquer toque reinicia o relógio; sem toque, volta pra tela inicial
  useEffect(() => {
    if (!totem || screen === "title") return;
    const home = () => {
      setCareer(null);
      setResult(null);
      setPosition(null);
      setScreen("title");
    };
    let t = setTimeout(home, IDLE_MS);
    const bump = () => {
      clearTimeout(t);
      t = setTimeout(home, IDLE_MS);
    };
    window.addEventListener("pointerdown", bump);
    window.addEventListener("keydown", bump);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("keydown", bump);
    };
  }, [totem, screen]);

  function goHome() {
    setCareer(null);
    setResult(null);
    setPosition(null);
    setScreen("title");
  }

  if (screen === "career") {
    return (
      <CareerPick
        onBack={goHome}
        onPick={(c) => {
          setCareer(c);
          setScreen("run");
        }}
      />
    );
  }
  if (screen === "run" && career) {
    return (
      <Run
        career={career}
        onExit={() => setScreen("career")}
        onDone={(r) => {
          setResult(r);
          setScreen("result");
        }}
      />
    );
  }
  if (screen === "result" && career && result) {
    return <Result career={career} r={result} onLead={() => setScreen("lead")} onAgain={() => setScreen("career")} />;
  }
  if (screen === "lead" && career && result) {
    return (
      <LeadForm
        career={career}
        r={result}
        onSkip={() => setScreen("result")}
        onDone={(pos) => {
          setPosition(pos);
          setScreen("ranking");
        }}
      />
    );
  }
  if (screen === "ranking" && result) {
    return <Ranking position={position} myScore={result.score} onAgain={totem ? goHome : () => setScreen("career")} />;
  }
  return <Title totem={totem} onStart={() => setScreen("career")} />;
}
