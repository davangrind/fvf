import { useState } from "react";
import { Download, Pause, Play, Radio } from "lucide-react";
import { useBattle } from "../state";
import { EventFeed } from "../components/DataViews";
import { PowerChart } from "../components/PowerChart";
import type { BattleEvent } from "../domain/types";
export default function Activity() {
  const state = useBattle();
  const [faction, setFaction] = useState("all");
  const [type, setType] = useState("all");
  const [frozen, setFrozen] = useState<BattleEvent[] | null>(null);
  const events = (frozen ?? state.events).filter(
    (e) =>
      (faction === "all" || e.faction === faction) &&
      (type === "all" || e.kind === type),
  );
  function download() {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { source: "demo", exportedAt: new Date().toISOString(), events },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "fvf-demo-events.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            <Radio size={14} /> TRANSMITTING FROM AN UNDISCLOSED BASEMENT
          </span>
          <h1>
            THE WAR <span className="orange">WIRE.</span>
          </h1>
          <p>
            Fees, mutations, and deeply questionable decisions. All simulated.
          </p>
        </div>
        <button className="button" onClick={download}>
          <Download size={16} /> Export demo log
        </button>
      </div>
      <div className="activity-layout">
        <section className="paper-panel">
          <div className="activity-toolbar">
            <div className="tabs">
              {[
                ["all", "Everyone"],
                ["fly", "The swarm"],
                ["astra", "Astra"],
              ].map(([f, label]) => (
                <button
                  key={f}
                  className={f === faction ? "active" : ""}
                  onClick={() => setFaction(f)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              className="icon-button"
              onClick={() => setFrozen(frozen ? null : [...state.events])}
              aria-label={frozen ? "Resume feed" : "Pause feed"}
            >
              {frozen ? <Play size={18} /> : <Pause size={18} />}
            </button>
          </div>
          <label className="event-filter">
            Show{" "}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Event type"
            >
              <option value="all">All events</option>
              <option value="fees">Fees added</option>
              <option value="launch">New recruits</option>
              <option value="evolution">Evolution unlocks</option>
              <option value="lead">Lead changes</option>
              <option value="decision">Fighter decisions</option>
            </select>
            <span className="micro muted">
              {frozen ? "FEED PAUSED" : "DEMO STREAM"} · {events.length} EVENTS
            </span>
          </label>
          {events.length ? (
            <EventFeed events={events} />
          ) : (
            <div className="empty-state">
              <h2>RADIO SILENCE.</h2>
              <p>No events match these filters yet.</p>
            </div>
          )}
        </section>
        <aside>
          <div className="paper-panel">
            <span className="eyebrow">ILLUSTRATIVE POOL TOTALS</span>
            <h2>THE BIGGER PROBLEM</h2>
            <PowerChart />
          </div>
          <div className="transmission-note">
            <span>✳</span>
            <h3>YES, IT'S A SIMULATION.</h3>
            <p>
              Events are generated locally while this tab is visible. Your
              launches and demo contributions join the same stream.
            </p>
            <p>
              No blockchain activity is represented here. No one's money is
              doing any of this.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
