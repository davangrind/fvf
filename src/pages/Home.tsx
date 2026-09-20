import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, BookOpen, ChevronRight } from "lucide-react";
import { useBattle, useUI, bleep } from "../state";
import { arenaEvents } from "../data/events";
import { Metrics, TokenTable, ArenaCard } from "../components/Platform";
import { Blob } from "../components/Creatures";
export default function Home() {
  const state = useBattle();
  const ui = useUI();
  const top = [...state.tokens]
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 5);
  return (
    <div className="page home-page">
      <section className="home-hero">
        <button
          className="hero-goblin goblin-one"
          aria-label="Poke the homepage goblin"
          onClick={() => {
            bleep(ui.sound, 230);
            ui.toast("he has no idea what a blockchain is");
          }}
        >
          <Blob variant={0} />
          <span>financially illiterate</span>
        </button>
        <div className="hero-badge">
          <span className="pons-mark">p</span> A launchpad for pons{" "}
          <span className="tiny-divider" /> A home for bad ideas
        </div>
        <h1>
          Internet nonsense
          <br />
          <span>with consequences</span>
        </h1>
        <p>
          Launch a token. Pick a side. Turn creator fees into fuel
          <br className="desktop-break" /> for the internet’s next deeply
          unnecessary event.
        </p>
        <div className="button-row">
          <Link className="button primary large" to="/launch">
            <Plus size={18} /> Launch a token
          </Link>
          <Link className="button large" to="/arena">
            Find your arena <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="hero-footnote">
          <span className="status-pip" /> Currently cooking: 1 arena{" "}
          <span>/</span> Local demo
        </div>
        <button
          className="hero-goblin goblin-two"
          aria-label="Poke the other homepage goblin"
          onClick={() => {
            bleep(ui.sound, 720);
            ui.toast("source: the little guy told me");
          }}
        >
          <Blob variant={1} />
          <span>source: trust me bro</span>
        </button>
        <div className="hero-orbit" aria-hidden="true" />
      </section>
      <Metrics />
      <div className="home-main-grid">
        <section className="panel token-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">The usual suspects</span>
              <h2>Biggest enablers</h2>
            </div>
            <Link className="text-link" to="/tokens">
              All tokens <ChevronRight size={16} />
            </Link>
          </div>
          <TokenTable tokens={top} compact />
          <div className="panel-footnote">
            Ranked by simulated creator fees contributed{" "}
            <span className="mono">NOT FINANCIAL WISDOM</span>
          </div>
        </section>
        <section className="home-arena-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Meanwhile, in the lab</span>
              <h2>Currently escalating</h2>
            </div>
            <Link className="icon-button" to="/arena" aria-label="All arenas">
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <ArenaCard event={arenaEvents[0]} featured />
        </section>
      </div>
      <section className="home-bottom-grid">
        <Link to="/docs#fee-flow" className="flow-teaser panel">
          <div>
            <span className="eyebrow">Good question, actually</span>
            <h2>Where do the fees go?</h2>
            <p>A token. A side. A growing pool of questionable potential.</p>
            <span className="text-link">
              Follow the money <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="mini-flow" aria-hidden="true">
            <span>$</span>
            <i />
            <span className="mini-tank">
              <b />
            </span>
            <i />
            <Blob variant={0} />
          </div>
        </Link>
        <Link to="/arena" className="next-teaser panel">
          <div>
            <span className="eyebrow">This is bigger than one fight</span>
            <h2>
              More bad ideas
              <br />
              in the microwave
            </h2>
            <p>Duels, three-way beef and four-way chaos</p>
            <span className="text-link">
              See what’s cooking <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="teaser-blobs">
            <Blob variant={2} />
            <Blob variant={3} />
            <Blob variant={4} />
          </div>
        </Link>
      </section>
      <div className="home-manual">
        <BookOpen size={18} />
        <span>New here? We wrote down the rules before eating the paper.</span>
        <Link to="/docs">Read the field manual</Link>
      </div>
    </div>
  );
}
