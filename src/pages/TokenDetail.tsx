import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Copy, ExternalLink } from "lucide-react";
import { useBattle, useUI } from "../state";
import { money, age, factionStats } from "../domain/battle";
import { TokenAvatar } from "../components/Platform";
import { FighterArtwork, TopicIcon } from "../components/Artwork";
export default function TokenDetail() {
  const { id } = useParams();
  const s = useBattle();
  const ui = useUI();
  const t = s.tokens.find((t) => t.id === id);
  if (!t)
    return (
      <div className="page empty-state">
        <TopicIcon />
        <h1>This token escaped containment</h1>
        <p>It may belong to another browser’s local demo.</p>
        <Link className="button primary" to="/tokens">
          Back to tokens
        </Link>
      </div>
    );
  const stats = factionStats(s, t.faction);
  const events = s.events.filter((e) => e.tokenId === t.id);
  return (
    <div className="page token-detail-page">
      <Link className="text-link" to="/tokens">
        <ChevronLeft size={15} /> All tokens
      </Link>
      <div className="token-detail-heading">
        <TokenAvatar token={t} />
        <div>
          <span className="eyebrow">Local demo token</span>
          <h1>{t.name}</h1>
          <span className="mono">${t.ticker}</span>
        </div>
        <span className={`faction-pill ${t.faction}`}>
          {t.faction === "fly" ? "Team Fly" : "Team Astra"}
        </span>
      </div>
      <div className="token-detail-grid">
        <section className="panel token-dossier">
          <h2>The lore</h2>
          <p>{t.description}</p>
          <div className="token-detail-stats">
            <div>
              <small>Simulated market cap</small>
              <strong>{money(t.marketCap)}</strong>
            </div>
            <div>
              <small>Creator fees contributed</small>
              <strong>{money(t.contribution)}</strong>
            </div>
            <div>
              <small>Illustrative 24h change</small>
              <strong className={t.change < 0 ? "negative" : "positive"}>
                {t.change > 0 ? "+" : ""}
                {t.change}%
              </strong>
            </div>
            <div>
              <small>Joined the event</small>
              <strong>{age(t.createdAt)}</strong>
            </div>
          </div>
          <div className="record-id">
            <span>
              <small>Local record ID / not a contract address</small>
              <code>{t.id}</code>
            </span>
            <button
              className="icon-button"
              aria-label="Copy local token ID"
              onClick={() => {
                void navigator.clipboard
                  .writeText(t.id)
                  .then(() => ui.toast("Local record ID copied"))
                  .catch(() =>
                    ui.toast(
                      "Clipboard unavailable. Select the ID to copy it.",
                    ),
                  );
              }}
            >
              <Copy size={17} />
            </button>
          </div>
          {(t.website || t.x) && (
            <div className="button-row">
              {t.website && (
                <a
                  className="button small"
                  href={t.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website <ExternalLink size={13} />
                </a>
              )}
              {t.x && (
                <a
                  className="button small"
                  href={`https://x.com/${t.x.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  X profile <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}
          <h3>Attributed incidents</h3>
          <div className="activity-list">
            {events.map((e) => (
              <div className="activity-row" key={e.id}>
                <div>
                  <p>{e.text}</p>
                  <small>demo / {e.kind}</small>
                </div>
                <time>{age(e.at)}</time>
              </div>
            ))}
            {!events.length && (
              <p className="muted">
                No recent events for this token in the retained log.
              </p>
            )}
          </div>
        </section>
        <aside className={`panel token-allegiance ${t.faction}`}>
          <span className="eyebrow">Proudly enabling</span>
          <FighterArtwork faction={t.faction} stage={stats.stage} />
          <h2>{t.faction === "fly" ? "Neuro Fly" : "GPT-6 Astra"}</h2>
          <p>
            This token contributes{" "}
            {stats.pool
              ? ((t.contribution / stats.pool) * 100).toFixed(1)
              : "0"}
            % of its side’s simulated creator-fee pool.
          </p>
          <div className="stage-progress">
            <span
              style={{
                width: `${stats.pool ? (t.contribution / stats.pool) * 100 : 0}%`,
              }}
            />
          </div>
          <Link className="button primary full" to="/arena/season-01">
            Visit the preparation lab
          </Link>
          <Link className="text-link" to="/docs#attribution">
            Understand attribution
          </Link>
        </aside>
      </div>
    </div>
  );
}
