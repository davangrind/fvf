import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Crosshair,
  Zap,
  Swords,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { useBattle, useUI, bleep } from "../state";
import { factionStats, FACTIONS, money } from "../domain/battle";
import type { Faction } from "../domain/types";
import { demoAdapter } from "../data/demo-adapter";
export function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}
export function Arena({ expanded = false }: { expanded?: boolean }) {
  const state = useBattle();
  const now = useNow();
  const ui = useUI();
  const [pokes, setPokes] = useState(0);
  const [taunt, setTaunt] = useState<Faction | null>(null);
  const fly = factionStats(state, "fly");
  const astra = factionStats(state, "astra");
  const remaining = Math.max(0, Math.floor((state.endsAt - now) / 1000));
  const units = [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];
  useEffect(() => {
    if (!taunt) return;
    const t = setTimeout(() => setTaunt(null), 2600);
    return () => clearTimeout(t);
  }, [taunt]);
  const phase = state.phase;
  const fightAge = state.fightStartedAt ? now - state.fightStartedAt : 0;
  useEffect(() => {
    if (!ui.sound || (phase !== "fighting" && phase !== "warning")) return;
    bleep(true, phase === "warning" ? 220 : 110);
    if (phase !== "fighting") return;
    const second = setTimeout(() => bleep(true, 660), 3000);
    const third = setTimeout(() => bleep(true, 150), 6000);
    return () => {
      clearTimeout(second);
      clearTimeout(third);
    };
  }, [phase, ui.sound]);
  return (
    <section
      className={`arena ${expanded ? "expanded" : ""} phase-${phase}`}
      aria-label="Zombie Neuro Fly versus GPT-6 Astra battle"
    >
      <div className="arena-top">
        <span>
          <i className="live-dot" />{" "}
          {phase === "preparing"
            ? "THE WAR IS WARMING UP"
            : phase === "warning"
              ? "FINAL FORM INCOMING"
              : phase === "fighting"
                ? "ABSOLUTE CINEMA"
                : "THE DUST HAS SETTLED"}
        </span>
        <span className="arena-season">
          SEASON 001 <b>/</b> BIOLOGY VS. TECHNOLOGY
        </span>
        <span className="demo-tag">DEMO</span>
      </div>
      <div className="arena-stage">
        <div className="arena-countdown">
          <small>
            {phase === "finished"
              ? "ROUND COMPLETE"
              : phase === "fighting"
                ? "FINAL BATTLE"
                : "FINAL BATTLE IN"}
          </small>
          <div
            className="clock"
            role="timer"
            aria-label={`${units[0]} days ${units[1]} hours ${units[2]} minutes ${units[3]} seconds`}
          >
            {units.map((u, i) => (
              <span key={i}>
                <b>{String(u).padStart(2, "0")}</b>
                <em>{["D", "H", "M", "S"][i]}</em>
                {i < 3 && <i>:</i>}
              </span>
            ))}
          </div>
        </div>
        {(["fly", "astra"] as Faction[]).map((f) => {
          const stats = f === "fly" ? fly : astra;
          const lead = stats.control > 50;
          return (
            <div
              key={f}
              className={`fighter-side ${f} evolution-${stats.stage}`}
            >
              <div className="radial-rays" />
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="fighter-copy">
                <span className="fighter-kicker">
                  {f === "fly"
                    ? "SUBJECT 001 / ORGANIC"
                    : "SUBJECT 002 / SYNTHETIC"}
                </span>
                <h2>
                  {f === "fly" ? (
                    <>
                      ZOMBIE
                      <br />
                      NEURO FLY
                    </>
                  ) : (
                    <>
                      GPT-6
                      <br />
                      ASTRA
                    </>
                  )}
                </h2>
                <p>{FACTIONS[f].motto}</p>
                <span className={`stage-stamp ${lead ? "leading" : ""}`}>
                  {lead ? "↗ CURRENT MENACE" : "✧ CALCULATING REVENGE"}
                </span>
              </div>
              <button
                className="character-button"
                aria-label={`Poke ${FACTIONS[f].name}`}
                onClick={() => {
                  setPokes(pokes + 1);
                  setTaunt(f);
                  bleep(ui.sound, f === "fly" ? 180 : 780);
                }}
              >
                <img
                  className="character"
                  src={`/art/${f}.webp`}
                  alt={
                    f === "fly"
                      ? "Muscular radioactive fly with a giant pink brain and insect wings"
                      : "Smug blue AI robot with a cyan core, floating drones, and a halo"
                  }
                  fetchPriority="high"
                />
                <span className="character-shadow" />
              </button>
              {taunt === f && (
                <div className="speech-bubble">
                  {pokes > 4
                    ? "STOP POKING THE APOCALYPSE."
                    : f === "fly"
                      ? "YOUR CURSOR LOOKS EDIBLE."
                      : "HUMAN DETECTED. UNFORTUNATE."}
                </div>
              )}
              <div className="fighter-level">
                <Crosshair size={14} />
                <span>
                  LVL {stats.stage + 1} <b>·</b>{" "}
                  {FACTIONS[f].stages[stats.stage]}
                </span>
                <span className="level-pips">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <i className={n <= stats.stage ? "filled" : ""} key={n} />
                  ))}
                </span>
              </div>
              <span className="debris debris-one">✧</span>
              <span className="debris debris-two">+</span>
              <span className="debris debris-three">✦</span>
            </div>
          );
        })}
        <div className="versus">
          <span>VS</span>
          <Zap className="versus-zap" fill="currentColor" />
        </div>
        <span className="arena-scribble">
          choose your
          <br />
          bad influence ↗
        </span>
        {phase === "fighting" && (
          <div
            className={`combat-effects attack-${fightAge < 3000 ? "fly" : fightAge < 6000 ? "astra" : "both"}`}
            aria-hidden="true"
          >
            <span className="energy-beam fly-beam" />
            <span className="energy-beam astra-beam" />
            <span className="collision-spark">✷</span>
            <span className="hit-word">
              {fightAge < 3000 ? "BZZZT!" : fightAge < 6000 ? "404!" : "K.O.?"}
            </span>
          </div>
        )}
        {phase === "warning" && (
          <div className="battle-overlay warning-overlay" role="status">
            <Swords size={38} />
            <h2>OH, IT'S HAPPENING.</h2>
            <p>Final forms loading. {remaining}s.</p>
          </div>
        )}
        {phase === "fighting" && (
          <div className="fight-caption" role="status">
            <span>
              {fightAge < 3000
                ? "ROUND ONE"
                : fightAge < 6000
                  ? "CRITICAL DAMAGE"
                  : "LAST HIT"}
            </span>
            <h2>
              {fightAge < 3000
                ? "NEURO SWARM!"
                : fightAge < 6000
                  ? "ORBITAL DELETE!"
                  : "WHO GETS THE LAST BYTE?"}
            </h2>
            <div className="combat-meter">
              <i
                style={{
                  width: `${fightAge < 3000 ? 62 : fightAge < 6000 ? 38 : fly.control}%`,
                }}
              />
            </div>
          </div>
        )}
        {phase === "finished" && state.result && (
          <div className="battle-overlay result-overlay" role="status">
            <Trophy size={34} />
            <span className="eyebrow">SIMULATED FINAL / NO PAYOUTS</span>
            <h2>
              {state.result.winner === "draw"
                ? "MUTUAL EMBARRASSMENT."
                : `${FACTIONS[state.result.winner].short} WINS.`}
            </h2>
            <p>{state.result.reason}</p>
            <button
              className="button primary"
              onClick={() => demoAdapter.restart()}
            >
              <RotateCcw size={17} /> Restart demo round
            </button>
          </div>
        )}
      </div>
      <div
        className="control-bar"
        aria-label={`Swarm control ${fly.control.toFixed(1)} percent, Astra ${astra.control.toFixed(1)} percent`}
      >
        <div className="fly-control" style={{ width: `${fly.control}%` }}>
          <span>
            THE SWARM <strong>{fly.control.toFixed(1)}%</strong>
          </span>
        </div>
        <div className="astra-control" style={{ width: `${astra.control}%` }}>
          <span>
            <strong>{astra.control.toFixed(1)}%</strong> ASTRA
          </span>
        </div>
        <span className="control-caption">BATTLE CONTROL</span>
      </div>
      <div className="arena-stats">
        {(["fly", "astra"] as Faction[]).map((f) => {
          const s = f === "fly" ? fly : astra;
          return (
            <div className={`faction-stats ${f}`} key={f}>
              <div>
                <small>CREATOR-FEE POOL</small>
                <strong>{money(s.pool)}</strong>
              </div>
              <div>
                <small>POWER</small>
                <strong>
                  <Zap size={16} />
                  {Intl.NumberFormat("en", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(s.power)}
                </strong>
              </div>
              <div>
                <small>SUPPORTING TOKENS</small>
                <strong>{String(s.count).padStart(2, "0")}</strong>
              </div>
              <Link
                className={`button ${f === "fly" ? "green" : "blue"}`}
                to={`/launch?faction=${f}`}
              >
                {FACTIONS[f].cta}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          );
        })}
      </div>
      <div className="arena-bottom">
        <span>
          <span className="dot-orange" /> Simulated pools & power. Real bad
          intentions.
        </span>
        <Link to={expanded ? "/docs#battle" : "/battle/season-01"}>
          {expanded ? "Battle rules" : "Enter the full arena"}{" "}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}
