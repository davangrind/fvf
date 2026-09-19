import { useState } from "react";
import { useBattle } from "../state";
import { money } from "../domain/battle";
export function PowerChart() {
  const state = useBattle();
  const [period, setPeriod] = useState<"24h" | "1h">("24h");
  const [hover, setHover] = useState<number | null>(null);
  const data =
    period === "24h"
      ? state.history
      : state.history.filter((p) => p.at > Date.now() - 3600000);
  const points = data.length >= 2 ? data : state.history.slice(-2);
  const end = Math.max(Date.now(), points.at(-1)?.at ?? 0);
  const start = Math.min(
    end - (period === "24h" ? 86400000 : 3600000),
    points[0]?.at ?? end,
  );
  const x = (at: number) =>
    40 + ((at - start) / Math.max(1, end - start)) * 590;
  const max = Math.max(...points.flatMap((p) => [p.fly, p.astra]), 1) * 1.15;
  const path = (key: "fly" | "astra") =>
    points
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${x(p.at)} ${195 - (p[key] / max) * 165}`,
      )
      .join(" ");
  const selected =
    points[Math.min(hover ?? points.length - 1, points.length - 1)];
  return (
    <div className="power-chart">
      <div className="chart-top">
        <div>
          <span className="legend fly">
            THE SWARM <b>{money(selected.fly, true)}</b>
          </span>
          <span className="legend astra">
            ASTRA <b>{money(selected.astra, true)}</b>
          </span>
        </div>
        <div className="segmented">
          {(["1h", "24h"] as const).map((p) => (
            <button
              className={period === p ? "active" : ""}
              onClick={() => {
                setPeriod(p);
                setHover(null);
              }}
              key={p}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <svg
        viewBox="0 0 650 225"
        role="img"
        aria-label="Simulated cumulative creator-fee pools for the swarm and Astra"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const cursor = ((e.clientX - r.left) / r.width) * 650;
          setHover(
            points.reduce(
              (best, point, i) =>
                Math.abs(x(point.at) - cursor) <
                Math.abs(x(points[best].at) - cursor)
                  ? i
                  : best,
              0,
            ),
          );
        }}
        onPointerLeave={() => setHover(null)}
      >
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1="40"
              y1={195 - i * 55}
              x2="630"
              y2={195 - i * 55}
              stroke="#d5d5ca"
              strokeDasharray="4 5"
            />
            <text x="2" y={199 - i * 55} fontSize="9" fill="#626b56">
              {Math.round((max * i) / 3 / 1000)}K
            </text>
          </g>
        ))}
        <path
          d={`${path("fly")} L 630 195 L 40 195 Z`}
          fill="#c4ec6a"
          opacity=".18"
        />
        <path d={path("fly")} fill="none" stroke="#689a20" strokeWidth="3" />
        <path d={path("astra")} fill="none" stroke="#6468d9" strokeWidth="3" />
        {hover !== null && (
          <line
            x1={x(selected.at)}
            x2={x(selected.at)}
            y1="20"
            y2="195"
            stroke="#171913"
            strokeDasharray="3 3"
          />
        )}
        <text x="40" y="220" fontSize="10" fill="#71736a">
          {period === "24h" ? "24 HOURS AGO" : "1 HOUR AGO"}
        </text>
        <text x="605" y="220" fontSize="10" fill="#71736a">
          NOW
        </text>
      </svg>
      <p className="micro muted">
        Cumulative simulated fees (illustrative USD), not token prices.
      </p>
    </div>
  );
}
