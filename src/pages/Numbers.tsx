import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, Pause, Play, Activity as ActivityIcon } from "lucide-react";
import { useBattle } from "../state";
import { Metrics, FeeChart, TokenAvatar } from "../components/Platform";
import { age, factionStats, money } from "../domain/battle";
import type { BattleEvent } from "../domain/types";
export default function Numbers() {
  const s = useBattle();
  const fly = factionStats(s, "fly"),
    astra = factionStats(s, "astra");
  const [faction, setFaction] = useState("all");
  const [kind, setKind] = useState("all");
  const [frozen, setFrozen] = useState<BattleEvent[] | null>(null);
  const events = (frozen ?? s.events).filter(
    (e) =>
      (faction === "all" || e.faction === faction) &&
      (kind === "all" || e.kind === kind),
  );
  const top = [...s.tokens]
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 5);
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#activity")
      document.getElementById("activity")?.scrollIntoView();
  }, [location.hash]);
  function download() {
    const blob = new Blob(
      [
        JSON.stringify(
          { source: "demo", exportedAt: new Date().toISOString(), events },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fvf-demo-activity.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="page">
      <div className="page-heading heading-row">
        <div>
          <span className="eyebrow">Peer unreviewed analytics</span>
          <h1>The numbers have lore</h1>
          <p>
            Follow the fees, the recruits and the occasional nervous breakdown.
          </p>
        </div>
        <span className="badge">
          <i className="live-dot" /> Local simulation
        </span>
      </div>
      <Metrics />
      <div className="numbers-grid">
        <section className="panel chart-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Cumulative creator fees</span>
              <h2>Funding the nonsense</h2>
            </div>
          </div>
          <FeeChart single />
        </section>
        <section className="panel distribution-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Event 001</span>
              <h2>Who’s eating?</h2>
            </div>
          </div>
          <div className="donut-wrap">
            <svg
              className="donut"
              viewBox="0 0 180 180"
              role="img"
              aria-label={`Fee share: Fly ${fly.control.toFixed(1)}%, Astra ${astra.control.toFixed(1)}%`}
            >
              <circle
                cx="90"
                cy="90"
                r="69"
                fill="none"
                stroke="var(--violet)"
                strokeWidth="18"
              />
              <circle
                cx="90"
                cy="90"
                r="69"
                fill="none"
                stroke="var(--mint)"
                strokeWidth="18"
                pathLength="100"
                strokeDasharray={`${fly.control} ${100 - fly.control}`}
                transform="rotate(-90 90 90)"
              />
              <text x="90" y="86" textAnchor="middle" className="donut-total">
                {money(fly.pool + astra.pool, true)}
              </text>
              <text x="90" y="109" textAnchor="middle">
                total pool
              </text>
            </svg>
          </div>
          <div className="distribution-row">
            <span>
              <i className="live-dot" /> Neuro Fly
            </span>
            <b>{fly.control.toFixed(1)}%</b>
            <span>{money(fly.pool, true)}</span>
          </div>
          <div className="distribution-row">
            <span>
              <i className="live-dot violet-dot" /> GPT-6 Astra
            </span>
            <b>{astra.control.toFixed(1)}%</b>
            <span>{money(astra.pool, true)}</span>
          </div>
          <p className="micro muted">Pool share, not odds of winning</p>
        </section>
      </div>
      <div className="numbers-bottom">
        <section className="panel activity-panel" id="activity">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Someone did something</span>
              <h2>Incident log</h2>
            </div>
            <div className="button-row">
              <button
                className="icon-button"
                onClick={() => setFrozen((f) => (f ? null : [...s.events]))}
                aria-label={frozen ? "Resume activity" : "Pause activity"}
              >
                {frozen ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button
                className="icon-button"
                onClick={download}
                aria-label="Export demo activity"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
          <div className="activity-filters">
            <select
              aria-label="Filter activity by side"
              value={faction}
              onChange={(e) => setFaction(e.target.value)}
            >
              <option value="all">All sides</option>
              <option value="fly">Neuro Fly</option>
              <option value="astra">GPT-6 Astra</option>
            </select>
            <select
              aria-label="Filter activity by type"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="all">All incidents</option>
              <option value="fees">Contributions</option>
              <option value="launch">Launches</option>
              <option value="evolution">Evolutions</option>
              <option value="lead">Lead changes</option>
            </select>
            {frozen && <span className="badge">View paused</span>}
          </div>
          <div className="activity-list">
            {events.slice(0, 20).map((e) => (
              <div className="activity-row" key={e.id}>
                <span className={`activity-icon ${e.faction}`}>
                  <ActivityIcon size={16} />
                </span>
                <div>
                  <p>{e.text}</p>
                  <small>
                    {e.kind} <span>/</span> demo{" "}
                    {e.tokenId && (
                      <Link to={`/tokens/${e.tokenId}`}>View token</Link>
                    )}
                  </small>
                </div>
                <time dateTime={new Date(e.at).toISOString()}>{age(e.at)}</time>
              </div>
            ))}
            {!events.length && (
              <div className="empty-state">
                <h3>Suspiciously quiet</h3>
                <p>No incidents match these filters.</p>
              </div>
            )}
          </div>
        </section>
        <aside className="panel leaderboard">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Enabler leaderboard</span>
              <h2>Feeding the habit</h2>
            </div>
          </div>
          {top.map((t, i) => (
            <Link key={t.id} to={`/tokens/${t.id}`} className="leader-row">
              <span className="rank">0{i + 1}</span>
              <TokenAvatar token={t} />
              <div>
                <strong>${t.ticker}</strong>
                <div className={`leader-bar ${t.faction}`}>
                  <span
                    style={{
                      width: `${(t.contribution / Math.max(1, top[0].contribution)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <b>{money(t.contribution, true)}</b>
            </Link>
          ))}
          <Link className="button full subtle" to="/tokens">
            All the usual suspects
          </Link>
          <div className="accounting-note">
            <h3>A quick reality check</h3>
            <p>
              These are cumulative simulated creator fees. They are not trading
              volume, liquidity, treasury balances or payouts.
            </p>
            <Link to="/docs#accounting" className="text-link">
              Read the accounting notes
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
