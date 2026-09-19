import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Zap } from "lucide-react";
import { useBattle } from "../state";
import { TokenIcon, EventFeed } from "../components/DataViews";
import { FACTIONS, factionStats, money, age } from "../domain/battle";
export default function TokenDetail() {
  const { id } = useParams();
  const state = useBattle();
  const token = state.tokens.find((t) => t.id === id);
  if (!token)
    return (
      <div className="page empty-state">
        <h1>RECRUIT MISSING IN ACTION.</h1>
        <p>This demo token may belong to another browser.</p>
        <Link className="button primary" to="/tokens">
          Back to the arsenal
        </Link>
      </div>
    );
  const stats = factionStats(state, token.faction);
  const rank =
    [...state.tokens]
      .sort((a, b) => b.contribution - a.contribution)
      .findIndex((t) => t.id === id) + 1;
  return (
    <div className={`page token-detail theme-${token.faction}`}>
      <Link className="text-button" to="/tokens">
        <ArrowLeft size={16} /> Back to the arsenal
      </Link>
      <div className="token-profile">
        <TokenIcon token={token} />
        <div>
          <span className="eyebrow">
            {FACTIONS[token.faction].short} / DEMO RECRUIT #{rank}
          </span>
          <h1>{token.name}</h1>
          <span className="token-ticker">${token.ticker}</span>
        </div>
        <span className="demo-tag">LOCAL DEMO TOKEN</span>
      </div>
      <div className="summary-strip">
        <div>
          <small>CREATOR FEES FED</small>
          <strong>{money(token.contribution)}</strong>
        </div>
        <div>
          <small>FACTION CONTRIBUTION</small>
          <strong>
            {stats.pool
              ? ((token.contribution / stats.pool) * 100).toFixed(1)
              : 0}
            %
          </strong>
        </div>
        <div>
          <small>DEMO MARKET CAP</small>
          <strong>{money(token.marketCap, true)}</strong>
        </div>
        <div>
          <small>RECRUITED</small>
          <strong className="smaller">{age(token.createdAt)}</strong>
        </div>
      </div>
      <div className="detail-grid">
        <section className="paper-panel">
          <span className="eyebrow">THE OFFICIAL EXCUSE</span>
          <h2>THE LORE</h2>
          <p className="token-description">{token.description}</p>
          <div className="notice">
            <Zap size={21} />
            <p>
              100% of this token's simulated creator-fee share feeds{" "}
              {FACTIONS[token.faction].name}. It has generated{" "}
              {Math.floor(token.contribution * 0.72).toLocaleString("en-US")}{" "}
              demo power.
            </p>
          </div>
          <p className="micro muted">
            This local demo record has no onchain contract, trading pool, or
            transaction hash.
          </p>
          {token.website && (
            <a
              className="text-button"
              href={token.website}
              target="_blank"
              rel="noreferrer"
            >
              Website <ArrowUpRight size={16} />
            </a>
          )}
          {token.x && (
            <a
              className="text-button"
              href={`https://x.com/${token.x.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
            >
              X profile <ArrowUpRight size={16} />
            </a>
          )}
          <Link className="button primary" to="/battle/season-01">
            Watch your fighter <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="paper-panel">
          <span className="eyebrow">A PAPER TRAIL OF BAD DECISIONS</span>
          <h2>RECRUIT ACTIVITY</h2>
          {state.events.some((e) => e.tokenId === id) ? (
            <EventFeed
              events={state.events.filter((e) => e.tokenId === id).slice(0, 8)}
            />
          ) : (
            <p className="muted">
              No recent events for this recruit. The lab is watching.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
