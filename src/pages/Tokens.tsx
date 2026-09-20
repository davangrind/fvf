import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, List, LayoutGrid, Plus } from "lucide-react";
import { useBattle } from "../state";
import { TokenTable, TokenAvatar, Sparkline } from "../components/Platform";
import { money } from "../domain/battle";
import { TopicIcon } from "../components/Artwork";
export default function Tokens() {
  const s = useBattle();
  const [query, setQuery] = useState("");
  const [faction, setFaction] = useState("all");
  const [sort, setSort] = useState("fees");
  const [grid, setGrid] = useState(false);
  const tokens = useMemo(
    () =>
      s.tokens
        .filter(
          (t) =>
            (faction === "all" || t.faction === faction) &&
            `${t.name} ${t.ticker}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "fees"
            ? b.contribution - a.contribution
            : sort === "cap"
              ? b.marketCap - a.marketCap
              : b.createdAt - a.createdAt,
        ),
    [s.tokens, query, faction, sort],
  );
  return (
    <div className="page">
      <div className="page-heading heading-row">
        <div>
          <span className="eyebrow">SMALL CAPS / LARGE PERSONALITIES</span>
          <h1>The arsenal</h1>
          <p>Explore the tokens fueling events across FVF.</p>
        </div>
        <Link className="button primary" to="/launch">
          <Plus size={16} /> Launch a token
        </Link>
      </div>
      <div className="token-summary">
        <span>
          <b>{s.tokens.length}</b> local recruits
        </span>
        <span>
          <b>
            {money(
              s.tokens.reduce((n, t) => n + t.contribution, 0),
              true,
            )}
          </b>{" "}
          fees contributed
        </span>
        <span className="badge">Simulated data</span>
      </div>
      <section className="panel">
        <div className="token-filters">
          <div className="search-input">
            <Search size={17} />
            <input
              aria-label="Search tokens"
              placeholder="Search name or ticker"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="text-button" onClick={() => setQuery("")}>
                Clear
              </button>
            )}
          </div>
          <div className="segmented">
            {[
              ["all", "All sides"],
              ["fly", "Neuro Fly"],
              ["astra", "Astra"],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-pressed={faction === id}
                className={faction === id ? "active" : ""}
                onClick={() => setFaction(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <select
            aria-label="Sort tokens"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="fees">Most fees</option>
            <option value="cap">Market cap</option>
            <option value="new">Newest</option>
          </select>
          <div className="view-toggle">
            <button
              className={`icon-button ${!grid ? "active" : ""}`}
              aria-label="Table view"
              aria-pressed={!grid}
              onClick={() => setGrid(false)}
            >
              <List size={18} />
            </button>
            <button
              className={`icon-button ${grid ? "active" : ""}`}
              aria-label="Grid view"
              aria-pressed={grid}
              onClick={() => setGrid(true)}
            >
              <LayoutGrid size={17} />
            </button>
          </div>
        </div>
        {grid ? (
          <div className="token-grid">
            {tokens.map((t, i) => (
              <Link
                className="token-grid-card"
                to={`/tokens/${t.id}`}
                key={t.id}
              >
                <div className="token-identity">
                  <TokenAvatar token={t} />
                  <span>
                    <strong>{t.name}</strong>
                    <small>${t.ticker}</small>
                  </span>
                  <span className={`faction-pill ${t.faction}`}>
                    {t.faction === "fly" ? "Fly" : "Astra"}
                  </span>
                </div>
                <p>{t.description}</p>
                <div className="token-grid-stats">
                  <span>
                    <small>Market cap</small>
                    <b>{money(t.marketCap, true)}</b>
                  </span>
                  {t.marketCap > 0 ? (
                    <Sparkline variant={i} negative={t.change < 0} />
                  ) : (
                    <small className="muted">No history</small>
                  )}
                  <span>
                    <small>Contributed</small>
                    <b>{money(t.contribution, true)}</b>
                  </span>
                </div>
              </Link>
            ))}
            {!tokens.length && (
              <div className="empty-state">
                <TopicIcon />
                <h3>No matching tokens</h3>
                <button
                  className="button"
                  onClick={() => {
                    setQuery("");
                    setFaction("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <TokenTable tokens={tokens} />
        )}
        <div className="panel-footnote">
          <span>
            {tokens.length} of {s.tokens.length} tokens
          </span>
          <span>All tokens currently support experiment 001</span>
        </div>
      </section>
      <p className="page-note">
        Market caps, changes and sparklines are illustrative. Creator-fee
        contributions reflect this browser’s simulation.
      </p>
    </div>
  );
}
