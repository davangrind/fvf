import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Beaker,
  Cpu,
  LockKeyhole,
  Zap,
  FastForward,
  Volume2,
  VolumeX,
  Share2,
} from "lucide-react";
import { Arena } from "../components/Arena";
import { useBattle, useUI } from "../state";
import { demoAdapter } from "../data/demo-adapter";
import { FACTIONS, factionStats, money, THRESHOLDS } from "../domain/battle";
import type { Faction } from "../domain/types";
import { EventFeed } from "../components/DataViews";
import { PowerChart } from "../components/PowerChart";
export default function Battle() {
  const state = useBattle();
  const ui = useUI();
  const [selected, setSelected] = useState<{ f: Faction; i: number } | null>(
    null,
  );
  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/battle/season-01`,
      );
      ui.toast("Arena link copied. Ruin someone else’s productivity.");
    } catch {
      ui.toast("Copy the arena URL from your address bar.");
    }
  }
  return (
    <div className="page battle-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">SEASON 001 / THE GREAT BRAIN DRAIN</span>
          <h1>
            WELCOME TO <span className="orange">THE PROBLEM.</span>
          </h1>
          <p>
            One shared war. Every token picks a side. Every creator fee feeds
            the fight.
          </p>
        </div>
        <button className="button" onClick={share}>
          <Share2 size={16} /> Share arena
        </button>
      </div>
      <Arena expanded />
      <div className="arena-controls">
        <span>
          <Beaker size={17} /> DEMO LAB{" "}
          <small>Try the full progression. No funds involved.</small>
        </span>
        <div>
          <button className="text-button" onClick={ui.toggleSound}>
            {ui.sound ? <Volume2 size={16} /> : <VolumeX size={16} />} Sound{" "}
            {ui.sound ? "on" : "off"}
          </button>
          <button
            className="button small"
            disabled={state.phase !== "preparing"}
            onClick={() => demoAdapter.fastForward()}
          >
            <FastForward size={16} /> Fast-forward finale
          </button>
        </div>
      </div>
      <section className="evolution-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THEY GROW UP SO WRONG.</span>
            <h2>EVOLUTION IS A TERRIBLE THING.</h2>
          </div>
          <span className="micro">SKILLS ARE VISUAL FLAVOUR</span>
        </div>
        <div className="evolution-grid">
          {(["fly", "astra"] as Faction[]).map((f) => {
            const stats = factionStats(state, f);
            return (
              <article className={`evolution-card ${f}`} key={f}>
                <div className="evolution-title">
                  {f === "fly" ? <Beaker size={27} /> : <Cpu size={27} />}
                  <div>
                    <span className="eyebrow">
                      {FACTIONS[f].short} / LEVEL {stats.stage + 1}
                    </span>
                    <h3>{FACTIONS[f].stages[stats.stage]}</h3>
                  </div>
                  <span className="evolution-number">0{stats.stage + 1}</span>
                </div>
                <p>
                  {stats.next ? (
                    <>
                      <strong>
                        {money(stats.next - stats.pool, true)} more
                      </strong>{" "}
                      until {FACTIONS[f].stages[stats.stage + 1]}.
                    </>
                  ) : (
                    <>Final form reached. Someone unplug it.</>
                  )}
                </p>
                <div className="evolution-progress">
                  <span style={{ width: `${stats.progress}%` }} />
                </div>
                <div className="skill-tree">
                  {FACTIONS[f].skills.map((skill, i) => (
                    <button
                      className={`skill-node ${stats.stage > i ? "unlocked" : ""} ${selected?.f === f && selected.i === i ? "selected" : ""}`}
                      key={skill}
                      onClick={() => setSelected({ f, i })}
                      aria-label={`${skill}, ${stats.stage > i ? "unlocked" : "locked"}`}
                    >
                      <span>
                        {stats.stage > i ? (
                          <Zap size={21} />
                        ) : (
                          <LockKeyhole size={18} />
                        )}
                      </span>
                      <strong>{skill}</strong>
                      <small>
                        {stats.stage > i
                          ? "UNLOCKED"
                          : money(THRESHOLDS[i + 1], true)}
                      </small>
                    </button>
                  ))}
                </div>
                {selected?.f === f && (
                  <p className="skill-description" role="status">
                    {FACTIONS[f].skills[selected.i]}:{" "}
                    {
                      [
                        "A little more attitude. A little less supervision.",
                        "Defense upgraded. Common sense remains at zero.",
                        "A new aura and an entirely unreasonable ego.",
                        "Final form. Even the developers are concerned.",
                      ][selected.i]
                    }{" "}
                    Unlocks at {money(THRESHOLDS[selected.i + 1])} in simulated
                    fees.
                  </p>
                )}
                <button
                  className="text-button feed-demo"
                  disabled={state.phase !== "preparing"}
                  onClick={() => {
                    demoAdapter.simulate(f, 25000);
                    ui.toast(
                      `${FACTIONS[f].short} received $25K in demo fees.`,
                    );
                  }}
                >
                  <Zap size={15} /> Simulate $25K in fees{" "}
                  <ArrowUpRight size={16} />
                </button>
              </article>
            );
          })}
        </div>
      </section>
      <div className="battle-lower">
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE PLOT THICKENS</span>
              <h2>POWER STRUGGLE</h2>
            </div>
            <span className="demo-tag">DEMO HISTORY</span>
          </div>
          <PowerChart />
        </section>
        <section className="war-wire">
          <div className="section-heading">
            <h2>LIVE FROM THE LAB</h2>
            <Link to="/activity" aria-label="View all activity">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <EventFeed events={state.events.slice(0, 4)} />
        </section>
      </div>
      <div className="lore-strip">
        <span>FIELD NOTE #001</span>
        <p>
          A lab fly ate the wrong server. The server took it personally.
          <br />
          <strong>The internet is now funding both sides.</strong>
        </p>
        <Link to="/docs#battle">
          Read the rules <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
