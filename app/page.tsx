import Game from "./game";
import { MuteButton } from "@/lib/voice";

export default function Home() {
  return (
    <main>
      <Game />
      <MuteButton />
    </main>
  );
}
