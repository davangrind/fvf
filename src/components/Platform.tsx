import { useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Coins,
  Layers3,
  LockKeyhole,
  ArrowUpRight,
  FlaskConical,
  Waves,
  Plus,
  Check,
} from "lucide-react";
import { useBattle } from "../state";
import { factionStats, money } from "../domain/battle";
import type { Token } from "../domain/types";
import type { ArenaEvent } from "../data/events";
import {
  TopicIcon,
  FighterArtwork,
  TokenSymbol,
  tokenArtwork,
  contenderIcon,
} from "./Artwork";
import { Modal } from "./Modal";

export function TokenAvatar({ token }: { token: Token }) {
  const hash = [...token.ticker].reduce((a, c) => a + c.charCodeAt(0), 0);
  return (
    <span className={`token-avatar avatar-${hash % 6}`}>
      {token.image &&
      (token.image.startsWith("data:image/") ||
        token.image.startsWith("/art/")) ? (
        <img src={tokenArtwork(token.image, token.faction)} alt="" />
      ) : (
        <TokenSymbol ticker={token.ticker} />
      )}
    </span>
  );
}
export function Metrics() {
  const s = useBattle();
  const total = s.tokens.reduce((n, t) => n + t.contribution, 0);
  const metrics = [
    {
      label: "Creator fees pooled",
      value: money(total, true),
      note: "Illustrative USD",
      icon: Waves,
    },
    {
      label: "Tokens with a side",
      value: String(s.tokens.length),
      note: "Local demo records",
      icon: Coins,
    },
    {
      label: "Open arenas",
      value: "01",
      note: "5 planned events",
      icon: Layers3,
    },
    {
      label: "Onchain launches",
      value: "00",
      note: "Local demo, zero real trades",
      icon: Activity,
    },
  ];
  return (
    <div className="metrics-strip">
      {metrics.map((m) => (
        <Link className="metric" to="/numbers" key={m.label}>
          <span>
            <m.icon size={15} />
            {m.label}
          </span>
          <strong>{m.value}</strong>
          <small>{m.note}</small>
        </Link>
      ))}
    </div>
  );
}
export function Sparkline({
  variant = 0,
  negative = false,
}: {
  variant?: number;
  negative?: boolean;
}) {
  return (
    <svg
      className={`sparkline ${negative ? "negative" : ""}`}
      viewBox="0 0 100 32"
      aria-hidden="true"
    >
      <path
        d={`M0 ${negative ? 10 : 28} ${Array.from({ length: 12 }, (_, i) => `L${i * 9} ${Math.max(3, Math.min(29, negative ? 6 + i * 1.5 + Math.sin(i * 2 + variant) * 5 : 27 - i * 1.7 + Math.sin(i * 2 + variant) * 5))}`).join(" ")}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
export function TokenTable({
  tokens,
  compact = false,
}: {
  tokens: Token[];
  compact?: boolean;
}) {
  return (
    <div className="table-scroll">
      <table className={`token-table ${compact ? "compact" : ""}`}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Market cap</th>
            <th>24h change</th>
            {!compact && <th>Illustrative trend</th>}
            <th>Fees contributed</th>
            <th>Side</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={t.id}>
              <td>
                <Link className="token-identity" to={`/tokens/${t.id}`}>
                  <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                  <TokenAvatar token={t} />
                  <span>
                    <strong>{t.name}</strong>
                    <small>${t.ticker}</small>
                  </span>
                </Link>
              </td>
              <td className="number">{money(t.marketCap, true)}</td>
              <td
                className={`number ${t.change < 0 ? "negative" : "positive"}`}
              >
                {t.change > 0 ? "+" : ""}
                {t.change}%
              </td>
              {!compact && (
                <td>
                  {t.marketCap > 0 ? (
                    <Sparkline variant={i} negative={t.change < 0} />
                  ) : (
                    <small className="muted">No history</small>
                  )}
                </td>
              )}
              <td className="number">{money(t.contribution, true)}</td>
              <td>
                <span className={`faction-pill ${t.faction}`}>
                  <i />
                  {t.faction === "fly" ? "Fly" : "Astra"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!tokens.length && (
        <div className="empty-state">
          <TopicIcon variant={2} />
          <h3>No tokens found</h3>
          <p>Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
}
export function ArenaCard({
  event,
  featured = false,
}: {
  event: ArenaEvent;
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const s = useBattle();
  const fly = factionStats(s, "fly"),
    astra = factionStats(s, "astra");
  const [saved, setSaved] = useState(() => {
    try {
      return localStorage.getItem(`fvf:idea:${event.id}`) === "saved";
    } catch {
      return false;
    }
  });
  const active = event.status === "preparing";
  return (
    <>
      <article
        className={`arena-card ${event.color} ${featured ? "featured" : ""} ${active ? "is-open" : "is-planned"}`}
      >
        <div className="arena-card-top">
          <span className={`badge ${active ? "mint" : ""}`}>
            {active ? <i className="live-dot" /> : <LockKeyhole size={12} />}{" "}
            {active ? "Recruiting" : "Coming later"}
          </span>
          <span className="mono">{event.type}</span>
        </div>
        <div className="arena-card-art">
          {active ? (
            <>
              <FighterArtwork faction="fly" stage={fly.stage} />
              <span className="vs-mark">vs</span>
              <FighterArtwork faction="astra" stage={astra.stage} />
            </>
          ) : (
            <div className="contender-lineup">
              {event.contenders.map((c, i) => (
                <div key={c}>
                  <TopicIcon variant={contenderIcon(event.id, i)} />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="arena-card-copy">
          <span className="eyebrow">
            {active ? "Event 001" : "Upcoming event"}
          </span>
          <h3>{event.title}</h3>
          <p>{event.subtitle}</p>
          {active ? (
            <>
              <div
                className="pool-split"
                role="img"
                aria-label={`Fly ${fly.control.toFixed(1)}%, Astra ${astra.control.toFixed(1)}%`}
              >
                <span style={{ width: `${fly.control}%` }} />
              </div>
              <div className="arena-mini-stats">
                <span>
                  {money(fly.pool + astra.pool, true)}{" "}
                  <small>in the pools</small>
                </span>
                <span>
                  {s.tokens.length} <small>tokens enlisted</small>
                </span>
              </div>
              <Link className="button primary full" to="/arena/season-01">
                Enter the arena <ArrowUpRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <div className="tags">
                {event.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <button
                className="button full subtle"
                onClick={() => setOpen(true)}
              >
                Read the questionable lore <LockKeyhole size={14} />
              </button>
            </>
          )}
        </div>
      </article>
      <Modal open={open} onClose={() => setOpen(false)} title={event.title}>
        <div className="modal-contenders">
          {event.contenders.map((c, i) => (
            <TopicIcon key={c} variant={contenderIcon(event.id, i)} />
          ))}
        </div>
        <p>{event.lore}</p>
        <p className="muted">
          This arena is locked. No tokens can be launched into it yet. Saving an
          idea only bookmarks it in this browser.
        </p>
        <button
          className="button primary full"
          onClick={() => {
            const next = !saved;
            setSaved(next);
            try {
              localStorage.setItem(`fvf:idea:${event.id}`, next ? "saved" : "");
            } catch {
              /* session-only */
            }
          }}
        >
          {saved ? <Check size={16} /> : <Plus size={16} />}{" "}
          {saved ? "Saved in this browser" : "Save this bad idea"}
        </button>
      </Modal>
    </>
  );
}

export function FeeChart({ single = false }: { single?: boolean }) {
  const state = useBattle();
  const id = useId().replace(/:/g, "");
  const [period, setPeriod] = useState<"1h" | "24h" | "all">("24h");
  const [hover, setHover] = useState<number | null>(null);
  const end = state.history.at(-1)?.at ?? Date.now();
  const start =
    period === "all"
      ? (state.history[0]?.at ?? end)
      : end - (period === "1h" ? 3600000 : 86400000);
  const points = state.history.filter((p) => p.at >= start);
  const max =
    Math.max(
      ...points.map((p) =>
        single ? p.fly + p.astra : Math.max(p.fly, p.astra),
      ),
      1,
    ) * 1.18;
  const x = (at: number) =>
    45 + ((at - start) / Math.max(1, end - start)) * 650;
  const y = (n: number) => 220 - (n / max) * 195;
  const path = (key: "fly" | "astra") =>
    points
      .map(
        (p, i) =>
          `${i ? "L" : "M"}${x(p.at)},${y(single ? p.fly + p.astra : p[key])}`,
      )
      .join(" ");
  const selected =
    points[Math.min(hover ?? points.length - 1, points.length - 1)];
  return (
    <div className="fee-chart">
      <div className="chart-toolbar">
        <div className="chart-value">
          <span className="eyebrow">
            {hover === null
              ? "Latest snapshot"
              : new Date(selected.at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </span>
          <strong>
            {money(selected.fly + (single ? selected.astra : 0))}
            {!single && (
              <small className="violet-text"> / {money(selected.astra)}</small>
            )}
          </strong>
        </div>
        <div className="segmented" aria-label="Chart period">
          {(["1h", "24h", "all"] as const).map((p) => (
            <button
              key={p}
              className={period === p ? "active" : ""}
              aria-pressed={period === p}
              onClick={() => {
                setPeriod(p);
                setHover(null);
              }}
            >
              {p === "all" ? "All" : p}
            </button>
          ))}
        </div>
      </div>
      <svg
        viewBox="0 0 720 255"
        role="img"
        tabIndex={0}
        aria-label="Simulated cumulative fee chart. Use left and right arrow keys to inspect snapshots."
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            setHover((i) =>
              Math.max(
                0,
                Math.min(
                  points.length - 1,
                  (i ?? points.length - 1) + (e.key === "ArrowRight" ? 1 : -1),
                ),
              ),
            );
          }
        }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * 720;
          setHover(
            points.reduce(
              (a, p, i) =>
                Math.abs(x(p.at) - px) < Math.abs(x(points[a].at) - px) ? i : a,
              0,
            ),
          );
        }}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={id} x2="0" y2="1">
            <stop stopColor="var(--mint)" stopOpacity=".2" />
            <stop offset="1" stopColor="var(--mint)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1="45"
              x2="695"
              y1={220 - i * 65}
              y2={220 - i * 65}
              className="chart-grid"
            />
            <text x="0" y={224 - i * 65}>
              {Math.round((max * i) / 3 / 1000)}k
            </text>
          </g>
        ))}
        {points.length > 1 && (
          <path
            d={`${path("fly")}L${x(points.at(-1)!.at)},220L${x(points[0].at)},220Z`}
            fill={`url(#${id})`}
          />
        )}
        <path d={path("fly")} className="chart-line mint-line" />
        {!single && (
          <path d={path("astra")} className="chart-line violet-line" />
        )}
        {selected && (
          <>
            <line
              x1={x(selected.at)}
              x2={x(selected.at)}
              y1="20"
              y2="220"
              className="chart-crosshair"
            />
            <circle
              cx={x(selected.at)}
              cy={y(single ? selected.fly + selected.astra : selected.fly)}
              r="4"
              fill="var(--mint)"
            />
          </>
        )}
        <text x="45" y="249">
          {period === "all"
            ? "First snapshot"
            : period === "1h"
              ? "1 hour ago"
              : "24 hours ago"}
        </text>
        <text x="665" y="249">
          Now
        </text>
      </svg>
      <div className="chart-caption">
        <span>
          <i className="live-dot" />
          {single ? "All arena pools" : "Neuro Fly"}
          {!single && <span className="violet-text"> / GPT-6 Astra</span>}
        </span>
        <span>Simulated USD · not price history</span>
      </div>
    </div>
  );
}

const flowSteps = [
  {
    title: "Launch a token",
    text: "Choose an open event and a side. Your token is linked to that arena.",
    icon: Coins,
  },
  {
    title: "Trading happens",
    text: "In the production concept, trades may generate creator fees under pons rules. Trading volume and liquidity are not the fee pool.",
    icon: Activity,
  },
  {
    title: "Fees are attributed",
    text: "A collector must verify and attribute the creator fees to the right token and recipient before they count.",
    icon: Layers3,
  },
  {
    title: "Your side evolves",
    text: "Attributed contributions fill the pool. Each event defines its own progression. In the first arena, fee thresholds unlock fighter evolution and skills.",
    icon: FlaskConical,
  },
];
export function FeeFlow() {
  const [step, setStep] = useState(0);
  const [volume, setVolume] = useState(10000);
  return (
    <div className="fee-flow">
      <div className="flow-nodes">
        {flowSteps.map((s, i) => (
          <button
            key={s.title}
            className={step === i ? "active" : ""}
            onClick={() => setStep(i)}
            aria-pressed={step === i}
          >
            <span className="flow-icon">
              <s.icon size={23} />
            </span>
            <small>0{i + 1}</small>
            <strong>{s.title}</strong>
            <span className="flow-particles" aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="flow-explainer">
        <div>
          <span className="eyebrow">Follow the fees / 0{step + 1}</span>
          <h3>{flowSteps[step].title}</h3>
          <p>{flowSteps[step].text}</p>
        </div>
        <div className="flow-calculator">
          <label htmlFor="flow-volume">
            Try an imaginary trading volume <b>{money(volume)}</b>
          </label>
          <input
            id="flow-volume"
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <div>
            <span>At an assumed 1% creator fee</span>
            <strong>{money(volume * 0.01)}</strong>
          </div>
          <small>Illustration only. 1% is not a confirmed pons rate.</small>
        </div>
      </div>
    </div>
  );
}
