import { useEffect, useRef, useState } from "react";
import { Brain, RotateCcw } from "lucide-react";
import { bleep, useUI } from "../state";
export function MemoryToy() {
  const ui = useUI();
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle" | "watch" | "repeat" | "lost">(
    "idle",
  );
  const [lit, setLit] = useState(-1);
  const [position, setPosition] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem("fvf:memory-best")) || 0;
    } catch {
      return 0;
    }
  });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sound = useRef(ui.sound);
  sound.current = ui.sound;
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function show(next: number[]) {
    timers.current.forEach(clearTimeout);
    setSequence(next);
    setPosition(0);
    setPhase("watch");
    setLit(-1);
    next.forEach((n, i) => {
      timers.current.push(
        setTimeout(
          () => {
            setLit(n);
            bleep(sound.current, 260 + n * 110);
          },
          500 + i * 650,
        ),
        setTimeout(() => setLit(-1), 950 + i * 650),
      );
    });
    timers.current.push(
      setTimeout(() => setPhase("repeat"), 500 + next.length * 650),
    );
  }
  function hit(n: number) {
    if (phase !== "repeat") return;
    bleep(ui.sound, 260 + n * 110);
    setLit(n);
    timers.current.push(setTimeout(() => setLit(-1), 180));
    if (sequence[position] !== n) {
      setPhase("lost");
      return;
    }
    if (position + 1 === sequence.length) {
      const score = sequence.length;
      setBest((b) => Math.max(b, score));
      try {
        localStorage.setItem("fvf:memory-best", String(Math.max(best, score)));
      } catch {
        /* optional score */
      }
      setPhase("watch");
      timers.current.push(
        setTimeout(
          () => show([...sequence, Math.floor(Math.random() * 4)]),
          650,
        ),
      );
    } else setPosition((p) => p + 1);
  }
  return (
    <section className="panel memory-toy">
      <div className="section-heading">
        <div>
          <span className="eyebrow">While the lab cooks</span>
          <h2>Brain cell check</h2>
        </div>
        <Brain size={22} />
      </div>
      <p>Four pads. One neuron. How hard can it be?</p>
      <div className="memory-pads">
        {["A", "B", "C", "D"].map((n, i) => (
          <button
            key={n}
            className={`memory-pad pad-${i} ${lit === i ? "lit" : ""}`}
            aria-label={`Memory pad ${n}`}
            disabled={phase !== "repeat"}
            onClick={() => hit(i)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="memory-status" aria-live="polite">
        {phase === "watch"
          ? "Watch the sequence"
          : phase === "repeat"
            ? `Your turn / ${position} of ${sequence.length}`
            : phase === "lost"
              ? `The neuron has left / ${Math.max(0, sequence.length - 1)} rounds cleared`
              : "Repeat the lights in order"}
      </div>
      <div className="memory-bottom">
        <span className="micro muted">Personal best: {best} rounds</span>
        <button
          className="button small"
          onClick={() => show([Math.floor(Math.random() * 4)])}
        >
          <RotateCcw size={13} />
          {phase === "idle" ? "Start check" : "Start over"}
        </button>
      </div>
      <small className="micro muted">
        A local toy. No effect on fees or progression.
      </small>
    </section>
  );
}
