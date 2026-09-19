import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { useBattle } from "../state";
import { TokenRows } from "../components/DataViews";
import { money } from "../domain/battle";
export default function Tokens() {
  const state = useBattle();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("contribution");
  const faction = params.get("faction") ?? "all";
  const tokens = state.tokens
    .filter(
      (t) =>
        (faction === "all" || t.faction === faction) &&
        `${t.name} ${t.ticker}`.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "newest"
        ? b.createdAt - a.createdAt
        : sort === "marketCap"
          ? b.marketCap - a.marketCap
          : b.contribution - a.contribution,
    );
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            SMALL CAPS. LARGE PERSONALITY DISORDERS.
          </span>
          <h1>
            THE <span className="orange">ARSENAL.</span>
          </h1>
          <p>Every token is somebody's bad idea. These ones have a side.</p>
        </div>
        <Link className="button primary" to="/launch">
          Add your weapon <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="summary-strip">
        <div>
          <small>ACTIVE RECRUITS</small>
          <strong>{state.tokens.length}</strong>
        </div>
        <div>
          <small>TOTAL FEES FED</small>
          <strong>
            {money(state.tokens.reduce((s, t) => s + t.contribution, 0))}
          </strong>
        </div>
        <div>
          <small>SIDES TO REGRET</small>
          <strong>02</strong>
        </div>
        <span className="demo-tag">ALL VALUES SIMULATED</span>
      </div>
      <div className="token-filters">
        <div className="tabs" aria-label="Filter tokens by faction">
          {[
            ["all", "All weapons"],
            ["fly", "The swarm"],
            ["astra", "Astra elite"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={faction === value ? "active" : ""}
              onClick={() =>
                setParams(value === "all" ? {} : { faction: value })
              }
            >
              {label}
            </button>
          ))}
        </div>
        <div className="filter-inputs">
          <label className="search-input">
            <Search size={17} />
            <input
              placeholder="Find a problem…"
              aria-label="Search tokens"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="sort-input">
            <SlidersHorizontal size={16} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort tokens"
            >
              <option value="contribution">Biggest feeders</option>
              <option value="newest">New recruits</option>
              <option value="marketCap">Market cap</option>
            </select>
          </label>
        </div>
      </div>
      {tokens.length ? (
        <TokenRows tokens={tokens} />
      ) : (
        <div className="empty-state">
          <Search size={40} />
          <h2>NO PROBLEMS FOUND.</h2>
          <p>Try another name or choose a different faction.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setParams({});
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="list-footer">
        <span>{tokens.length} weapons found</span>
        <span>Demo tokens have no contract address and cannot be traded.</span>
      </div>
    </div>
  );
}
