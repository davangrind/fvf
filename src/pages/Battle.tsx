import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Volume2,
  VolumeX,
  LockKeyhole,
  Check,
  FlaskConical,
  Cpu,
  Zap,
  Shield,
  Bug,
  Brain,
  Radio,
  Crown,
  RotateCcw,
  Plus,
} from "lucide-react";
import type { Faction } from "../domain/types";
import { factionStats, FACTIONS, THRESHOLDS, money } from "../domain/battle";
import { demoAdapter } from "../data/demo-adapter";
import { useBattle, useUI, bleep } from "../state";
import { LabScene } from "../components/LabScene";
import { Creature } from "../components/Creatures";
import { FeeChart, TokenAvatar } from "../components/Platform";
import { MemoryToy } from "../components/MemoryToy";
import { Modal } from "../components/Modal";
const skills = {
  fly: [
    {
      name: "Wing it",
      icon: Bug,
      effect: "swarm",
      detail:
        "The interns have unionized into a swarm. Fast wings, bad intentions. Unlocks the exposed brain and a new level of airborne confidence.",
    },
    {
      name: "Brain broadband",
      icon: Brain,
      effect: "pulse",
      detail:
        "One brain cell, now with a wired connection. A neural pulse passes through the lab. The cable is mostly for emotional support.",
    },
    {
      name: "Hive Wi-Fi",
      icon: Radio,
      effect: "swarm",
      detail:
        "A backpack router recruits a cloud of auxiliary bugs. All assistants are now connected to the same terrible idea.",
    },
    {
      name: "Lord of the pings",
      icon: Crown,
      effect: "ascend",
      detail:
        "The crown chooses its idiot. Maximum biomass, orbiting spores and an utterly unjustified sense of authority.",
    },
  ],
  astra: [
    {
      name: "More RAM",
      icon: Cpu,
      effect: "overclock",
      detail:
        "Downloads another gigabyte of audacity. The antenna comes online and the monitor runs several unnecessary processes at once.",
    },
    {
      name: "Emotional firewall",
      icon: Shield,
      effect: "shield",
      detail:
        "Mechanical hands and a perimeter shield. Blocks criticism, unsolicited advice and most attempts at emotional connection.",
    },
    {
      name: "Agent swarm",
      icon: Radio,
      effect: "overclock",
      detail:
        "Spawns orbiting compute agents. They hold a meeting about the meeting, then pretend this is parallel processing.",
    },
    {
      name: "God complex",
      icon: Crown,
      effect: "ascend",
      detail:
        "A floating halo marks the final upgrade. Astra is now absolutely certain of things it just made up.",
    },
  ],
};
export default function Battle() {
  const s = useBattle();
  const ui = useUI();
  const fly = factionStats(s, "fly"),
    astra = factionStats(s, "astra");
  const stats = { fly, astra };
  const [faction, setFaction] = useState<Faction>("fly");
  const [preview, setPreview] = useState<number | null>(null);
  const [selected, setSelected] = useState(1);
  const [effect, setEffect] = useState<{
    faction: Faction;
    name: string;
  } | null>(null);
  const [feed, setFeed] = useState<Faction | null>(null);
  const [amount, setAmount] = useState(25000);
  const previous = useRef({ fly: fly.stage, astra: astra.stage });
  useEffect(() => {
    for (const f of ["fly", "astra"] as Faction[]) {
      if (previous.current[f] !== stats[f].stage) {
        setEffect({ faction: f, name: "ascend" });
        previous.current[f] = stats[f].stage;
      }
    }
  }, [fly.stage, astra.stage]);
  useEffect(() => {
    if (!effect) return;
    const timer = setTimeout(() => setEffect(null), 3600);
    return () => clearTimeout(timer);
  }, [effect]);
  const show = (name: string) => {
    setEffect({ faction, name });
    bleep(ui.sound, faction === "fly" ? 260 : 800);
    document.getElementById("lab")?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  };
  const contribute = () => {
    if (!feed) return;
    if (s.phase !== "preparing") demoAdapter.restart();
    demoAdapter.simulate(feed, amount);
    bleep(ui.sound, feed === "fly" ? 260 : 680);
    setFeed(null);
  };
  const active = stats[faction];
  const shown = preview ?? active.stage;
  const skill = skills[faction][selected];
  return (
    <div className="page battle-page">
      <div className="battle-breadcrumb">
        <Link to="/arena">
          <ChevronLeft size={15} /> All arenas
        </Link>
        <span>/</span>
        <span>Experiment 001</span>
        <span className="badge mint">Recruiting</span>
      </div>
      <div className="page-heading heading-row battle-heading">
        <div>
          <h1>Two species, zero chill</h1>
          <p>
            Organic stupidity meets artificial intelligence. The lab is open.
          </p>
        </div>
        <div className="button-row">
          <button className="button small" onClick={ui.toggleSound}>
            {ui.sound ? <Volume2 size={16} /> : <VolumeX size={16} />} Sound{" "}
            {ui.sound ? "on" : "off"}
          </button>
          <Link className="button primary small" to="/launch">
            <Plus size={16} /> Enlist a token
          </Link>
        </div>
      </div>
      <section id="lab" aria-label="Interactive preparation lab">
        <LabScene
          stages={{
            fly: faction === "fly" ? shown : fly.stage,
            astra: faction === "astra" ? shown : astra.stage,
          }}
          actualStages={{ fly: fly.stage, astra: astra.stage }}
          pools={{ fly: fly.pool, astra: astra.pool }}
          effect={effect}
          onFeed={setFeed}
        />
      </section>
      <div className="battle-summary">
        <div>
          <span className="eyebrow">Simulated creator-fee pools</span>
          <strong>
            {money(fly.pool + astra.pool)} <small>and counting</small>
          </strong>
        </div>
        <div className="battle-balance">
          <div>
            <span className="mint-text">Fly {fly.control.toFixed(1)}%</span>
            <span className="violet-text">
              Astra {astra.control.toFixed(1)}%
            </span>
          </div>
          <div className="pool-split">
            <span style={{ width: `${fly.control}%` }} />
          </div>
          <small>Share of contributions, not winning odds</small>
        </div>
        <div className="battle-phase">
          <span className="status-pip" /> Preparation mode{" "}
          <small>The actual fight comes later</small>
        </div>
      </div>
      <div className="battle-content-grid">
        <section className="panel mutation-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <FlaskConical size={13} /> Department of consequences
              </span>
              <h2>The mutation lab</h2>
            </div>
            <div className="segmented">
              {(["fly", "astra"] as Faction[]).map((f) => (
                <button
                  key={f}
                  className={faction === f ? "active" : ""}
                  aria-pressed={faction === f}
                  onClick={() => {
                    setFaction(f);
                    setPreview(null);
                    setSelected(1);
                  }}
                >
                  {f === "fly" ? "Neuro Fly" : "Astra"}
                </button>
              ))}
            </div>
          </div>
          <div className={`mutation-overview ${faction}`}>
            <div className="mutation-model">
              <Creature faction={faction} stage={shown} />
              <span className="badge">
                {preview === null ? "Actual evolution" : "Model preview"}
              </span>
            </div>
            <div className="mutation-info">
              <span className="eyebrow">Stage 0{shown + 1} / 05</span>
              <h3>{FACTIONS[faction].stages[shown]}</h3>
              <p>
                {faction === "fly"
                  ? [
                      "An egg with a concerning search history",
                      "The brain is now externally hosted",
                      "It has a cable and several opinions",
                      "The group chat is a single organism",
                      "Nature would like to unsubscribe",
                    ][shown]
                  : [
                      "A monitor with zero employable skills",
                      "An antenna for unsolicited takes",
                      "It has hands now, unfortunately",
                      "The agents have agents",
                      "The halo came from the clearance aisle",
                    ][shown]}
              </p>
              <div className="stat-pair">
                <span>
                  <small>Actual power index</small>
                  <b>{active.power.toLocaleString("en-US")}</b>
                </span>
                <span>
                  <small>Actual pool</small>
                  <b>{money(active.pool, true)}</b>
                </span>
              </div>
              <label className="evolution-slider" htmlFor="evolution-stage">
                <span>
                  Scrub through the mutations <b>{shown + 1} / 5</b>
                </span>
                <input
                  id="evolution-stage"
                  type="range"
                  min="0"
                  max="4"
                  value={shown}
                  onChange={(e) => setPreview(Number(e.target.value))}
                />
              </label>
              <button
                className="text-button"
                disabled={preview === null}
                onClick={() => setPreview(null)}
              >
                <RotateCcw size={12} /> Return to actual stage
              </button>
            </div>
          </div>
          <div className="skill-tree">
            <div className="skill-tree-heading">
              <h3>Questionable skill tree</h3>
              <span className="micro muted">{active.stage} / 4 unlocked</span>
            </div>
            <div className={`skill-nodes ${faction}`}>
              {skills[faction].map((sk, i) => (
                <button
                  key={sk.name}
                  className={`skill-node ${selected === i ? "selected" : ""} ${active.stage > i ? "unlocked" : "locked"}`}
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                >
                  <span className="skill-node-icon">
                    <sk.icon size={22} />
                    <i>
                      {active.stage > i ? (
                        <Check size={10} />
                      ) : (
                        <LockKeyhole size={10} />
                      )}
                    </i>
                  </span>
                  <strong>{sk.name}</strong>
                  <small>{money(THRESHOLDS[i + 1], true)}</small>
                </button>
              ))}
            </div>
            <div className="skill-detail">
              <div>
                <span
                  className={`badge ${active.stage > selected ? "mint" : ""}`}
                >
                  {active.stage > selected
                    ? "Unlocked"
                    : "Locked in actual progression"}
                </span>
                <h3>{skill.name}</h3>
                <p>{skill.detail}</p>
              </div>
              <button className="button" onClick={() => show(skill.effect)}>
                <Zap size={15} /> Preview ability
              </button>
            </div>
            <p className="micro muted">
              Ability previews are visual sandbox effects. They do not change
              pools or outcomes.
            </p>
          </div>
        </section>
        <aside className="battle-side-column">
          <section className="panel next-evolution">
            <span className="eyebrow">The next bad decision</span>
            <h2>
              {active.next
                ? "Almost a bigger problem"
                : "Maximum problem achieved"}
            </h2>
            <p>
              {active.next ? (
                <>
                  <b>{money(Math.max(0, active.next - active.pool))}</b> in
                  simulated fees until{" "}
                  <strong>{FACTIONS[faction].stages[active.stage + 1]}</strong>
                </>
              ) : (
                "The final evolution is unlocked. The pool can still grow."
              )}
            </p>
            <div className={`stage-progress ${faction}`}>
              <span style={{ width: `${active.progress}%` }} />
            </div>
            <div className="progress-labels">
              <span>Stage {active.stage + 1}</span>
              <span>{Math.round(active.progress)}%</span>
            </div>
            <button
              className="button primary full"
              onClick={() => setFeed(faction)}
            >
              Add a demo contribution
            </button>
            <Link className="text-link" to={`/launch?faction=${faction}`}>
              Or enlist a token for this side
            </Link>
          </section>
          <MemoryToy />
        </aside>
      </div>
      <div className="battle-lower-grid">
        <section className="panel chart-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">The escalation graph</span>
              <h2>Two very different appetites</h2>
            </div>
          </div>
          <FeeChart />
        </section>
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">They made this happen</span>
              <h2>Lab sponsors</h2>
            </div>
            <Link className="text-link" to="/tokens">
              All tokens
            </Link>
          </div>
          {[...s.tokens]
            .sort((a, b) => b.contribution - a.contribution)
            .slice(0, 4)
            .map((t) => (
              <Link className="leader-row" key={t.id} to={`/tokens/${t.id}`}>
                <TokenAvatar token={t} />
                <div>
                  <strong>${t.ticker}</strong>
                  <small>
                    {t.faction === "fly"
                      ? "Feeding Neuro Fly"
                      : "Feeding Astra"}
                  </small>
                </div>
                <b>{money(t.contribution, true)}</b>
              </Link>
            ))}
          <div className="lab-log">
            <span className="eyebrow">Latest incident</span>
            <p>{s.events[0]?.text}</p>
            <Link className="text-link" to="/numbers#activity">
              Open the incident log
            </Link>
          </div>
        </section>
      </div>
      <div className="battle-note">
        <Shield size={17} />
        <p>
          Preparation sandbox. The battle itself is being designed. All pools,
          power and contributions are simulated.{" "}
          <Link to="/docs#battle">Read the current rules</Link>
        </p>
      </div>
      <Modal
        open={feed !== null}
        onClose={() => setFeed(null)}
        title={`Feed ${feed === "fly" ? "the wetware" : "the hardware"}`}
      >
        <p>
          Add a simulated creator-fee contribution to a token on this side. The
          pool, chart and evolution update together.
        </p>
        <div className="feed-options">
          {[5000, 25000, 75000].map((n) => (
            <button
              className={amount === n ? "selected" : ""}
              aria-pressed={amount === n}
              key={n}
              onClick={() => setAmount(n)}
            >
              {money(n, true)}
            </button>
          ))}
        </div>
        <div className="notice">
          <FlaskConical size={19} />
          <span>
            Demo credits only. No wallet request, liquidity transfer or real
            payment.
          </span>
        </div>
        <button className="button primary full" onClick={contribute}>
          Simulate {money(amount)} in fees
        </button>
      </Modal>
    </div>
  );
}
