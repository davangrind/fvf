import { useState } from "react";
import { Layers3 } from "lucide-react";
import { arenaEvents } from "../data/events";
import { ArenaCard } from "../components/Platform";
export default function Arenas() {
  const [filter, setFilter] = useState("all");
  const shown = arenaEvents.filter(
    (e) => filter === "all" || e.status === filter,
  );
  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">
          <Layers3 size={14} /> The entertainment department
        </span>
        <h1>Pick your rabbit hole</h1>
        <p>
          Different worlds. Different rules. Equally questionable decisions.
        </p>
      </div>
      <div className="filter-bar">
        <div className="segmented">
          {[
            ["all", "All events", 6],
            ["preparing", "Recruiting", 1],
            ["planned", "Coming later", 5],
          ].map(([id, label, count]) => (
            <button
              key={id}
              className={filter === id ? "active" : ""}
              aria-pressed={filter === id}
              onClick={() => setFilter(String(id))}
            >
              {label} <small>{count}</small>
            </button>
          ))}
        </div>
        <span className="micro muted">No dates. Let them cook.</span>
      </div>
      <div className="arena-directory">
        {shown.map((e) => (
          <ArenaCard event={e} key={e.id} />
        ))}
      </div>
      <p className="page-note">
        One recruiting arena. Five future concepts. All fees and token
        activity are simulated.
      </p>
    </div>
  );
}
