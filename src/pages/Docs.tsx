import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import { manualChapters } from "../data/manual";
import { FeeFlow } from "../components/Platform";
import { Blob } from "../components/Creatures";
export default function Docs() {
  const [query, setQuery] = useState("");
  const location = useLocation();
  const chapters = manualChapters.filter((c) =>
    `${c.title} ${c.summary} ${c.paragraphs.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const groups = [...new Set(chapters.map((c) => c.group))];
  useEffect(() => {
    if (location.hash) {
      setQuery("");
      const timer = setTimeout(
        () =>
          document
            .getElementById(location.hash.slice(1))
            ?.scrollIntoView({ behavior: "instant" }),
        100,
      );
      return () => clearTimeout(timer);
    }
  }, [location.hash]);
  return (
    <div className="page manual-page">
      <div className="page-heading">
        <span className="eyebrow">
          <BookOpen size={14} /> Instructions were, in fact, included
        </span>
        <h1>The field manual</h1>
        <p>Everything you need to know before adopting a financial goblin.</p>
      </div>
      <div className="manual-layout">
        <aside className="manual-sidebar">
          <div className="search-input">
            <Search size={16} />
            <input
              aria-label="Search manual"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the manual"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-button">
                Clear
              </button>
            )}
          </div>
          <span className="micro muted">
            {chapters.length} chapters / about 20 min
          </span>
          <nav aria-label="Manual chapters">
            {groups.map((g) => (
              <div className="manual-nav-group" key={g}>
                <h3>{g}</h3>
                {chapters
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <a
                      className={location.hash === `#${c.id}` ? "active" : ""}
                      key={c.id}
                      href={`#${c.id}`}
                    >
                      {c.title}
                    </a>
                  ))}
              </div>
            ))}
          </nav>
        </aside>
        <div className="manual-content">
          <section className="manual-intro panel">
            <div>
              <span className="badge">Edition 02 / Local demo</span>
              <h2>
                Read the room
                <br />
                Then read the rules
              </h2>
              <p>
                FVF turns creator fees into fuel for community events. The weird
                little guys are optional. Understanding where your fees go
                isn’t.
              </p>
              <a className="text-link" href="#fee-flow">
                Start with the fee flow <ChevronRight size={16} />
              </a>
            </div>
            <Blob variant={3} />
          </section>
          {chapters.map((c) => (
            <article className="manual-chapter" id={c.id} key={c.id}>
              <span className="eyebrow">
                {c.group} /{" "}
                {String(manualChapters.indexOf(c) + 1).padStart(2, "0")}
              </span>
              <h2>
                <a href={`#${c.id}`}>{c.title}</a>
              </h2>
              <p className="chapter-summary">{c.summary}</p>
              {c.paragraphs.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
              {c.bullets && (
                <ul>
                  {c.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {c.id === "fee-flow" && <FeeFlow />}
              {c.id === "evolution" && (
                <div className="threshold-table">
                  {["$0", "$25K", "$75K", "$150K", "$250K"].map((n, i) => (
                    <div key={n}>
                      <span>Stage {i + 1}</span>
                      <b>{n}</b>
                      <small>
                        {
                          [
                            "Suspicious",
                            "Connected",
                            "Concerning",
                            "Unsupervised",
                            "Uninsurable",
                          ][i]
                        }
                      </small>
                    </div>
                  ))}
                </div>
              )}
              {c.id === "pons" && (
                <p>
                  <a
                    className="text-link"
                    href="https://github.com/ponsdotdev/pons-labs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Official pons source
                  </a>{" "}
                  <span className="muted">/</span>{" "}
                  <a
                    className="text-link"
                    href="https://www.ponsfamily.com/launchpad/create"
                    target="_blank"
                    rel="noreferrer"
                  >
                    pons creation flow
                  </a>
                </p>
              )}
            </article>
          ))}
          {!chapters.length && (
            <div className="empty-state">
              <Blob />
              <h2>No matching chapters</h2>
              <button className="button" onClick={() => setQuery("")}>
                Show the whole manual
              </button>
            </div>
          )}
          <section className="manual-outro panel">
            <h2>Enough reading, go poke something</h2>
            <p>The lab is open. The assistants are unsupervised.</p>
            <Link className="button primary" to="/arena/season-01">
              Enter the lab
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
