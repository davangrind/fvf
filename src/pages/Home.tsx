import { Link } from "react-router-dom";
import { ArrowUpRight, Zap, Skull, Swords, Plus } from "lucide-react";
import { Arena } from "../components/Arena";
import { EventFeed, TokenRows } from "../components/DataViews";
import { useBattle } from "../state";
export default function Home() {
  const state = useBattle();
  return (
    <div className="page home-page">
      <section className="home-intro">
        <div>
          <span className="eyebrow">
            <span className="mini-star">✳</span> A TOKEN LAUNCHPAD. A VERY BAD
            IDEA.
          </span>
          <h1>
            FEES FEED <span>THE FIGHT.</span>
            <span className="title-asterisk" aria-hidden="true">
              ✳
            </span>
          </h1>
        </div>
        <div className="intro-action">
          <p>
            Launch a token. Pick a monster.
            <br />
            Your creator fees make it stronger.
          </p>
          <Link to="/launch" className="button primary">
            Launch your token <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <Arena />
      <div className="loop-strip">
        <span>
          <span className="loop-number">01</span>
          <Plus size={18} />
          <b>MAKE A TOKEN.</b>
        </span>
        <i>↝</i>
        <span>
          <span className="loop-number">02</span>
          <Skull size={18} />
          <b>PICK YOUR PROBLEM.</b>
        </span>
        <i>↝</i>
        <span>
          <span className="loop-number">03</span>
          <Zap size={18} />
          <b>FEES BECOME FIREPOWER.</b>
        </span>
        <i>↝</i>
        <span>
          <Swords size={18} />
          <b>ENJOY THE DAMAGE.</b>
        </span>
      </div>
      <div className="home-data">
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">SMALL TOKENS. BIG PROBLEMS.</span>
              <h2>
                THE BIGGEST FEEDERS<span className="orange">*</span>
              </h2>
            </div>
            <Link to="/tokens">
              All tokens <ArrowUpRight size={17} />
            </Link>
          </div>
          <TokenRows
            tokens={[...state.tokens]
              .sort((a, b) => b.contribution - a.contribution)
              .slice(0, 5)}
            compact
          />
          <p className="micro muted">
            * Ranked by simulated creator fees contributed to their fighter.
          </p>
        </section>
        <section className="war-wire">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <i className="live-dot" /> TRANSMISSION: UNHINGED
              </span>
              <h2>THE WAR WIRE</h2>
            </div>
            <Link to="/activity" aria-label="View all activity">
              <ArrowUpRight size={23} />
            </Link>
          </div>
          <EventFeed events={state.events.slice(0, 5)} />
          <div className="wire-bottom">
            <span className="demo-tag">DEMO FEED</span>
            <span>Somewhere, a server is crying.</span>
          </div>
        </section>
      </div>
      <section className="recruit-banner">
        <span className="recruit-star">✳</span>
        <div>
          <span className="eyebrow">THE INTERNET WAS A MISTAKE.</span>
          <h2>MAKE IT EVERYONE'S PROBLEM.</h2>
          <p>
            Your next token could be the difference. Probably a terrible one.
          </p>
        </div>
        <Link to="/launch" className="button dark">
          Pick a side. Launch a token. <ArrowUpRight size={20} />
        </Link>
      </section>
    </div>
  );
}
