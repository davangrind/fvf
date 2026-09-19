import { Link } from "react-router-dom";
import { ArrowUpRight, Zap, Radio, TrendingUp } from "lucide-react";
import type { BattleEvent, Token } from "../domain/types";
import { age, money } from "../domain/battle";
export function TokenIcon({ token }: { token: Token }) {
  return (
    <span className={`token-icon ${token.faction}`}>
      {token.image ? <img src={token.image} alt="" /> : token.emoji}
    </span>
  );
}
export function TokenRows({
  tokens,
  compact = false,
}: {
  tokens: Token[];
  compact?: boolean;
}) {
  return (
    <div className={`token-list ${compact ? "compact" : ""}`}>
      <div className="token-table-head">
        <span>RANK / TOKEN</span>
        <span>MARKET CAP</span>
        <span>FEES FED</span>
        <span />
      </div>
      {tokens.map((t, i) => (
        <Link to={`/tokens/${t.id}`} className="token-row" key={t.id}>
          <div className="token-identity">
            <span className="rank">{String(i + 1).padStart(2, "0")}</span>
            <TokenIcon token={t} />
            <div>
              <strong>{t.name}</strong>
              <span>
                ${t.ticker} <i className={`faction-dot ${t.faction}`} />
              </span>
            </div>
          </div>
          <div className="token-market">
            <strong>{money(t.marketCap, true)}</strong>
            <span className={t.change >= 0 ? "positive" : "negative"}>
              {t.change >= 0 ? "+" : ""}
              {t.change}%
            </span>
          </div>
          <div className="token-contribution">
            <strong>{money(t.contribution, true)}</strong>
            <span>{t.faction === "fly" ? "THE SWARM" : "ASTRA"}</span>
          </div>
          <ArrowUpRight size={17} />
        </Link>
      ))}
    </div>
  );
}
export function EventFeed({ events }: { events: BattleEvent[] }) {
  return (
    <div className="event-feed">
      {events.map((e, i) => (
        <div className={`event-row ${i === 0 ? "new" : ""}`} key={e.id}>
          <span className={`event-icon ${e.faction}`}>
            {e.kind === "fees" ? (
              <Zap size={15} />
            ) : e.kind === "launch" ? (
              <ArrowUpRight size={15} />
            ) : e.kind === "lead" ? (
              <TrendingUp size={15} />
            ) : (
              <Radio size={15} />
            )}
          </span>
          <div>
            {e.tokenId ? (
              <Link to={`/tokens/${e.tokenId}`}>{e.text}</Link>
            ) : (
              <p>{e.text}</p>
            )}
            <small>
              {age(e.at)} <b>·</b> SIMULATED
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
