import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Zap,
  Swords,
  BookOpen,
  LockKeyhole,
} from "lucide-react";
import { Welcome } from "../components/Welcome";
import { useBattle } from "../state";
import { arenaEvents } from "../data/events";
import { Metrics, ArenaCard } from "../components/Platform";
import { TokenRows } from "../components/DataViews";

export default function Home() {
  const state = useBattle();
  const top = [...state.tokens]
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 5);
  return (
    <div className="page home-page">
      <Welcome />
      <div className="loop-strip platform-loop">
        <span>
          <span className="loop-number">01</span>
          <Plus size={18} />
          <b>MAKE A TOKEN</b>
        </span>
        <ArrowRight size={17} />
        <span>
          <span className="loop-number">02</span>
          <Swords size={18} />
          <b>CHOOSE YOUR EVENT</b>
        </span>
        <ArrowRight size={17} />
        <span>
          <span className="loop-number">03</span>
          <Zap size={18} />
          <b>LET THE FEES DO THEIR THING</b>
        </span>
        <Link className="text-link" to="/docs#fee-flow">
          How it works <ArrowUpRight size={15} />
        </Link>
      </div>
      <Metrics />
      <div className="home-main-grid">
        <section className="home-token-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SMALL TOKENS / BIG IDEAS</span>
              <h2>THE BIGGEST FEEDERS</h2>
            </div>
            <Link className="text-link" to="/tokens">
              All tokens <ArrowUpRight size={17} />
            </Link>
          </div>
          <TokenRows tokens={top} compact />
          <p className="micro muted home-data-note">
            Ranked by creator fees contributed across FVF
          </p>
        </section>
        <section className="home-arena-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <i className="live-dot" /> EVENT 001 / RECRUITING
              </span>
              <h2>FIRST ON THE BILL</h2>
            </div>
            <Link className="text-link" to="/arena">
              All arenas <ArrowUpRight size={17} />
            </Link>
          </div>
          <ArenaCard event={arenaEvents[0]} featured />
        </section>
      </div>
      <section className="upcoming-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ONE FIGHT IS JUST THE BEGINNING</span>
            <h2>NEXT BAD IDEAS</h2>
          </div>
          <Link className="text-link" to="/arena">
            The full lineup <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="event-tickets">
          {arenaEvents.slice(1, 4).map((event, i) => (
            <Link className="event-ticket" to="/arena" key={event.id}>
              <div>
                <span className="ticket-number">0{i + 2}</span>
                <span className="demo-tag">
                  <LockKeyhole size={10} /> PLANNED
                </span>
              </div>
              <h3>{event.title}</h3>
              <p>{event.subtitle}</p>
              <span className="ticket-type">
                {event.contenders.length} CONTENDERS <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="recruit-banner">
        <Zap className="recruit-emblem" strokeWidth={1.2} />
        <div>
          <span className="eyebrow">THE INTERNET WAS A MISTAKE</span>
          <h2>MAKE SOMETHING HAPPEN</h2>
          <p>A new token. A new allegiance. A new reason to watch.</p>
        </div>
        <Link to="/launch" className="button dark">
          Launch on FVF <ArrowUpRight size={20} />
        </Link>
      </section>
      <div className="home-manual">
        <BookOpen size={18} />
        <span>Know the rules before making your next bad decision</span>
        <Link to="/docs">
          Read the field manual <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
