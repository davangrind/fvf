import { useId, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { Grip, RotateCcw } from "lucide-react";
import { Blob, Creature } from "./Creatures";
import type { Faction } from "../domain/types";
import { money } from "../domain/battle";
import { bleep, useUI } from "../state";

export function LiquidTank({
  faction,
  pool,
}: {
  faction: Faction;
  pool: number;
}) {
  const id = useId().replace(/:/g, "");
  const fill = Math.min(100, (pool / 250000) * 100);
  return (
    <div className={`liquid-tank ${faction}`}>
      <svg
        viewBox="0 0 94 224"
        role="img"
        aria-label={`${faction} pool ${money(pool)}, ${fill.toFixed(1)} percent of final evolution threshold`}
      >
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x="20" y="19" width="54" height="172" rx="25" />
          </clipPath>
          <linearGradient id={`${id}-liquid`} x2="1" y2="1">
            <stop stopColor={faction === "fly" ? "#adf4b3" : "#d4bfff"} />
            <stop
              offset="1"
              stopColor={faction === "fly" ? "#508f77" : "#7662b3"}
            />
          </linearGradient>
        </defs>
        <path
          d="M14 13L23 5H70L80 13V200L68 211H26L14 199Z"
          fill="var(--tank-shell)"
          stroke="var(--line-strong)"
          strokeWidth="2"
        />
        <rect
          x="20"
          y="19"
          width="54"
          height="172"
          rx="25"
          fill="var(--tank-empty)"
        />
        <g clipPath={`url(#${id}-clip)`}>
          <g
            className="tank-level"
            style={{ transform: `translateY(${190 - fill * 1.63}px)` }}
          >
            <path
              className="liquid-wave"
              d="M-70 0Q-47 -9 -24 0T22 0T68 0T114 0T160 0V210H-70Z"
              fill={`url(#${id}-liquid)`}
            />
            <path
              className="liquid-wave wave-two"
              d="M-70 4Q-47 -6 -24 4T22 4T68 4T114 4T160 4V210H-70Z"
              fill={faction === "fly" ? "#a9f7c3" : "#c5b0ff"}
              opacity=".35"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                className="tank-bubble"
                key={i}
                cx={30 + ((i * 13) % 34)}
                cy={16 + i * 27}
                r={1 + (i % 3)}
                fill="#fff"
                opacity=".35"
                style={{ animationDelay: `-${i * 0.8}s` }}
              />
            ))}
          </g>
          <path
            d="M27 40V165"
            stroke="white"
            strokeWidth="4"
            opacity=".1"
            strokeLinecap="round"
          />
        </g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M67 ${38 + i * 31}H75`}
            stroke="var(--text)"
            opacity=".35"
          />
        ))}
        <rect
          x="28"
          y="196"
          width="38"
          height="7"
          rx="3"
          fill={faction === "fly" ? "#a6e8b4" : "#b7a6ee"}
        />
        <path d="M47 213V224" stroke="var(--line-strong)" strokeWidth="8" />
      </svg>
      <span>{fill.toFixed(1)}%</span>
      <small>of final stage</small>
    </div>
  );
}

const initialPositions = [
  { x: 14, y: 74 },
  { x: 34, y: 76 },
  { x: 66, y: 75 },
  { x: 85, y: 74 },
];
const assistantHome = (index: number) =>
  matchMedia("(max-width: 600px)").matches
    ? [
        { x: 27, y: 36 },
        { x: 82, y: 35 },
        { x: 24, y: 83 },
        { x: 84, y: 82 },
      ][index]
    : initialPositions[index];
function Assistant({ index, reset }: { index: number; reset: number }) {
  const [pos, setPos] = useState(() => assistantHome(index));
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const lastReset = useRef(reset);
  const ref = useRef<HTMLButtonElement>(null);
  const ui = useUI();
  if (lastReset.current !== reset) {
    lastReset.current = reset;
    setPos(assistantHome(index));
  }
  const start = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.parentElement!.getBoundingClientRect();
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      left: pos.x,
      top: pos.y,
      width: r.width,
      height: r.height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    bleep(ui.sound, 180 + index * 80);
  };
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const d = drag.current;
    setPos({
      x: Math.max(
        4,
        Math.min(90, d.left + ((e.clientX - d.x) / d.width) * 100),
      ),
      y: Math.max(
        10,
        Math.min(85, d.top + ((e.clientY - d.y) / d.height) * 100),
      ),
    });
  };
  return (
    <button
      ref={ref}
      className="lab-assistant"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label={`Move lab assistant ${index + 1}. Drag or use arrow keys.`}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onKeyDown={(e) => {
        const delta: { [key: string]: [number, number] } = {
          ArrowLeft: [-3, 0],
          ArrowRight: [3, 0],
          ArrowUp: [0, -3],
          ArrowDown: [0, 3],
        };
        if (delta[e.key]) {
          e.preventDefault();
          const [x, y] = delta[e.key];
          setPos((p) => ({
            x: Math.max(4, Math.min(90, p.x + x)),
            y: Math.max(10, Math.min(85, p.y + y)),
          }));
        }
      }}
    >
      <Blob variant={index < 2 ? index * 2 : 1 + (index - 2) * 2} />
      <span>
        {
          ["intern #01", "the IT guy", "unpaid agent", "the other IT guy"][
            index
          ]
        }
      </span>
    </button>
  );
}

const lines = {
  fly: [
    "bzz. respectfully, bzz.",
    "i ate the terms & conditions",
    "one neuron. no refunds.",
    "the brain is a rental",
    "why is the monitor judging me",
    "my larvae have a group chat",
  ],
  astra: [
    "your vibe check returned null",
    "i have 8 GB of audacity",
    "please stop touching the screen",
    "empathy.exe not found",
    "the fly is a hardware issue",
    "updating... emotional damage 99%",
  ],
};
export function LabScene({
  stages,
  actualStages,
  pools,
  effect,
  onFeed,
}: {
  stages: Record<Faction, number>;
  actualStages: Record<Faction, number>;
  pools: Record<Faction, number>;
  effect: { faction: Faction; name: string } | null;
  onFeed: (f: Faction) => void;
}) {
  const ui = useUI();
  const [quips, setQuips] = useState({ fly: 0, astra: 0 });
  const [reset, setReset] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const poke = (f: Faction) => {
    setQuips((q) => ({ ...q, [f]: q[f] + 1 }));
    bleep(
      ui.sound,
      f === "fly" ? 170 + quips.fly * 30 : 640 + quips.astra * 20,
    );
  };
  return (
    <div
      className={`lab-stage ${effect ? `effect-${effect.name} effect-${effect.faction}` : ""}`}
      ref={stageRef}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--look-x",
          `${((e.clientX - r.left - r.width / 2) / r.width) * 9}px`,
        );
        e.currentTarget.style.setProperty(
          "--look-y",
          `${((e.clientY - r.top - r.height / 2) / r.height) * 5}px`,
        );
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--look-x", "0px");
        e.currentTarget.style.setProperty("--look-y", "0px");
      }}
    >
      <div className="lab-ceiling" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="lab-status">
        <span>
          <i className="live-dot" /> PREPARATION LAB
        </span>
        <span>SUBJECTS: UNSUPERVISED</span>
      </div>
      <div className="lab-floor" aria-hidden="true" />
      <div className="scene-divider" aria-hidden="true">
        <span>vs</span>
      </div>
      {(["fly", "astra"] as Faction[]).map((f) => (
        <div className={`fighter-zone ${f}`} key={f}>
          <div className="fighter-label">
            <span className="eyebrow">
              {f === "fly" ? "Organic stupidity" : "Artificial intelligence"}
            </span>
            <h2>{f === "fly" ? "Neuro Fly" : "GPT-6 Astra"}</h2>
            <span className={`faction-pill ${f}`}>
              {stages[f] === actualStages[f]
                ? `Stage ${stages[f] + 1}`
                : `Preview / stage ${stages[f] + 1}`}{" "}
              <span>/</span> {f === "fly" ? "wetware" : "hardware"}
            </span>
          </div>
          <div className="speech-bubble" key={`${f}-${quips[f]}`}>
            {lines[f][quips[f] % lines[f].length]}
          </div>
          <div className="creature-plinth" aria-hidden="true">
            <svg viewBox="0 0 320 92">
              <path
                d="M22 30L160 3L298 30V59L159 89L22 61Z"
                fill={f === "fly" ? "#20342d" : "#2e2a3c"}
              />
              <path
                d="M22 30L160 3L298 30L159 60Z"
                fill={f === "fly" ? "#355344" : "#514965"}
              />
              <path
                d="M40 32L160 10L278 32L159 52Z"
                fill="none"
                stroke={f === "fly" ? "#8fd2a0" : "#b19adb"}
                strokeWidth="1"
                opacity=".65"
              />
              <path
                d="M22 60L158 89L298 59"
                fill="none"
                stroke={f === "fly" ? "#89cda0" : "#9986c7"}
                strokeWidth="2"
              />
              {Array.from({ length: 7 }, (_, i) => (
                <path
                  key={i}
                  d={`M${50 + i * 16} ${51 + i * 3.4}v9`}
                  stroke={f === "fly" ? "#abf1bc" : "#c5b0fb"}
                  opacity=".5"
                  strokeWidth="3"
                />
              ))}
            </svg>
          </div>
          <button
            className="fighter-poke"
            aria-label={`Poke ${f === "fly" ? "Neuro Fly" : "Astra"}`}
            onClick={() => poke(f)}
          >
            <Creature
              faction={f}
              stage={stages[f]}
              mood={effect?.faction === f ? effect.name : "idle"}
            />
          </button>
          <LiquidTank faction={f} pool={pools[f]} />
          <div
            className={`base-equipment level-${actualStages[f]}`}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
            <i />
          </div>
          <div className="fighter-bottom">
            <span>
              <small>Creator-fee pool</small>
              <strong>{money(pools[f])}</strong>
            </span>
            <button
              className={`button ${f === "fly" ? "mint-button" : "violet-button"}`}
              onClick={() => onFeed(f)}
            >
              Feed {f === "fly" ? "Fly" : "Astra"}
            </button>
          </div>
        </div>
      ))}
      <div className="assistant-layer">
        {[0, 1, 2, 3].map((i) => (
          <Assistant key={i} index={i} reset={reset} />
        ))}
      </div>
      <div className="lab-interaction-hint">
        <span>
          <Grip size={13} /> Poke the creatures. Drag the interns.
        </span>
        <button className="text-button" onClick={() => setReset((r) => r + 1)}>
          <RotateCcw size={12} /> Reset interns
        </button>
      </div>
      {effect && (
        <div className="lab-effect-particles" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
      )}
    </div>
  );
}
