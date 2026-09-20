import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Upload,
  Check,
  LoaderCircle,
  FlaskConical,
  LockKeyhole,
  ChevronLeft,
  Plus,
} from "lucide-react";
import { useUI } from "../state";
import { demoAdapter } from "../data/demo-adapter";
import { validateLaunch } from "../domain/battle";
import { imageMimeFromBytes } from "../domain/artwork";
import type { Faction, LaunchInput, Token } from "../domain/types";
import { FighterArtwork } from "../components/Artwork";
import { TokenAvatar } from "../components/Platform";
const empty: LaunchInput = {
  name: "",
  ticker: "",
  description: "",
  image: "/art/fly.webp",
  faction: "fly",
  website: "",
  x: "",
};
function readDraft(): LaunchInput {
  try {
    const v = JSON.parse(sessionStorage.getItem("fvf:draft:v3") ?? "null");
    if (
      v &&
      typeof v.name === "string" &&
      typeof v.ticker === "string" &&
      typeof v.description === "string" &&
      typeof v.image === "string" &&
      ["fly", "astra"].includes(v.faction)
    )
      return v;
  } catch {
    /* empty draft */
  }
  return empty;
}
export default function Launch() {
  const [params] = useSearchParams();
  const [input, setInput] = useState<LaunchInput>(() => {
    const draft = readDraft();
    const f = params.get("faction");
    return f === "fly" || f === "astra"
      ? {
          ...draft,
          faction: f,
          image: draft.image.startsWith("data:")
            ? draft.image
            : `/art/${f}.webp`,
        }
      : draft;
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ack, setAck] = useState(false);
  const [created, setCreated] = useState<Token | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const ui = useUI();
  useEffect(() => {
    if (!created)
      try {
        sessionStorage.setItem("fvf:draft:v3", JSON.stringify(input));
      } catch {
        /* best effort */
      }
  }, [input, created]);
  const change = (key: keyof LaunchInput, value: string) => {
    setInput((v) => ({ ...v, [key]: value }));
    setError("");
  };
  const pick = (f: Faction) =>
    setInput((v) => ({
      ...v,
      faction: f,
      image: v.image.startsWith("/art/") ? `/art/${f}.webp` : v.image,
    }));
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Keep your image under 2 MB.");
      return;
    }
    try {
      const bytes = await file.arrayBuffer();
      const mime = imageMimeFromBytes(new Uint8Array(bytes));
      if (!mime) {
        setError("Use a PNG, JPG, or WebP image.");
        return;
      }
      const data = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error());
        r.readAsDataURL(new Blob([bytes], { type: mime }));
      });
      const image = new Image();
      image.src = data;
      await image.decode();
      change("image", data);
    } catch {
      setError("That image could not be opened. Try another file.");
    }
  }
  function next(e: FormEvent) {
    e.preventDefault();
    const err = validateLaunch(input);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep(2);
  }
  async function launch() {
    if (!ui.wallet) {
      ui.openWallet();
      return;
    }
    if (!ack) {
      setError("Confirm the demo and fee destination before launching.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await demoAdapter.launch(input);
      if (r.source === "demo") {
        setCreated(r.token);
        try {
          sessionStorage.removeItem("fvf:draft:v3");
        } catch {
          /* optional storage */
        }
        ui.toast("A new problem has entered the chat");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Launch failed. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  if (created)
    return (
      <div className="page">
        <section className="launch-success panel">
          <div className="success-creature">
            <FighterArtwork faction={created.faction} stage={2} />
            <span>
              <Check size={25} />
            </span>
          </div>
          <span className="eyebrow">Local demo launch complete</span>
          <h1>
            A new problem
            <br />
            has entered the chat
          </h1>
          <p>
            <b>${created.ticker}</b> joined{" "}
            {created.faction === "fly" ? "Neuro Fly" : "GPT-6 Astra"} in event
            001.
          </p>
          <p className="muted">
            {demoAdapter.persistenceAvailable
              ? "Saved in this browser and listed in Tokens."
              : "Available for this session. Storage is unavailable; a reload will lose this record."}
          </p>
          <div className="notice">
            <FlaskConical size={19} />
            <span>
              No token was deployed onchain. No signature or transaction was
              requested.
            </span>
          </div>
          <div className="button-row">
            <Link className="button primary" to={`/tokens/${created.id}`}>
              Meet your token
            </Link>
            <Link className="button" to="/arena/season-01">
              Visit the arena
            </Link>
          </div>
        </section>
      </div>
    );
  return (
    <div className="page launch-page">
      <div className="page-heading">
        <span className="eyebrow">The idea was probably fine in your head</span>
        <h1>Launch your token</h1>
        <p>Give your token a name, a face and a questionable allegiance.</p>
      </div>
      <div className="launch-layout">
        <section className="panel launch-form-panel">
          <div className="form-steps">
            <button
              className={step === 1 ? "active" : ""}
              disabled={busy}
              onClick={() => setStep(1)}
            >
              <span>01</span> Token details
            </button>
            <button
              className={step === 2 ? "active" : ""}
              disabled={busy}
              onClick={() => {
                const err = validateLaunch(input);
                if (err) setError(err);
                else {
                  setError("");
                  setStep(2);
                }
              }}
            >
              <span>02</span> Read the fine print
            </button>
          </div>
          {step === 1 ? (
            <form onSubmit={next} noValidate>
              <div className="form-section-title">
                <span>01</span>
                <h2>Choose your event</h2>
              </div>
              <label>
                Arena
                <select aria-label="Arena">
                  <option>Neuro Fly vs GPT-6 Astra / Recruiting</option>
                  <option disabled>The Touch Grass Incident / Planned</option>
                  <option disabled>The Last Brain Cell / Planned</option>
                  <option disabled>Council of Bad Advice / Planned</option>
                </select>
              </label>
              <div className="faction-picker">
                {(["fly", "astra"] as Faction[]).map((f) => (
                  <button
                    type="button"
                    key={f}
                    className={`faction-option ${f} ${input.faction === f ? "selected" : ""}`}
                    aria-pressed={input.faction === f}
                    onClick={() => pick(f)}
                  >
                    <FighterArtwork faction={f} stage={1} />
                    <div>
                      <strong>
                        {f === "fly" ? "Neuro Fly" : "GPT-6 Astra"}
                      </strong>
                      <small>
                        {f === "fly"
                          ? "Wetware enjoyer"
                          : "Hardware enthusiast"}
                      </small>
                    </div>
                    <span className="selection-dot">
                      {input.faction === f && <Check size={12} />}
                    </span>
                  </button>
                ))}
              </div>
              <div className="form-section-title">
                <span>02</span>
                <h2>Give it an identity</h2>
              </div>
              <div className="image-input">
                <button
                  className="upload-preview"
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Upload token image"
                >
                  {input.image.startsWith("data:") ? (
                    <img src={input.image} alt="Token artwork preview" />
                  ) : (
                    <FighterArtwork faction={input.faction} stage={1} />
                  )}
                  <span>
                    <Upload size={14} />
                  </span>
                </button>
                <div>
                  <strong>A face only the internet could love</strong>
                  <p>PNG, JPG or WebP / Max 2 MB</p>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    Choose image
                  </button>
                </div>
                <input
                  ref={fileRef}
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => void upload(e.target.files?.[0])}
                  aria-label="Token image"
                />
              </div>
              <div className="form-grid">
                <label>
                  Token name
                  <input
                    value={input.name}
                    onChange={(e) => change("name", e.target.value)}
                    maxLength={32}
                    placeholder="e.g. Emotionally Liquid"
                    required
                    autoComplete="off"
                  />
                </label>
                <label>
                  Ticker
                  <div className="ticker-input">
                    <span>$</span>
                    <input
                      aria-label="Ticker"
                      value={input.ticker}
                      onChange={(e) =>
                        change(
                          "ticker",
                          e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, ""),
                        )
                      }
                      maxLength={10}
                      placeholder="COPE"
                      required
                      autoComplete="off"
                    />
                  </div>
                </label>
              </div>
              <label>
                The lore{" "}
                <span className="optional">{input.description.length}/256</span>
                <textarea
                  value={input.description}
                  onChange={(e) => change("description", e.target.value)}
                  maxLength={256}
                  rows={3}
                  placeholder="Explain yourself. Or make it worse."
                  required
                />
              </label>
              <details className="social-details">
                <summary>
                  Optional social links <Plus size={15} />
                </summary>
                <div className="form-grid">
                  <label>
                    Website
                    <input
                      type="url"
                      value={input.website}
                      onChange={(e) => change("website", e.target.value)}
                      placeholder="https://"
                    />
                  </label>
                  <label>
                    X handle
                    <input
                      value={input.x}
                      onChange={(e) => change("x", e.target.value)}
                      placeholder="@yourhandle"
                      maxLength={16}
                    />
                  </label>
                </div>
              </details>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="button primary full" type="submit">
                Review your token
              </button>
            </form>
          ) : (
            <div className="launch-review">
              <span className="eyebrow">One last vibe check</span>
              <h2>Know where the fees go</h2>
              <dl className="review-list">
                <div>
                  <dt>Token</dt>
                  <dd>
                    {input.name} / ${input.ticker}
                  </dd>
                </div>
                <div>
                  <dt>Event</dt>
                  <dd>Neuro Fly vs GPT-6 Astra</dd>
                </div>
                <div>
                  <dt>Supporting</dt>
                  <dd>
                    {input.faction === "fly"
                      ? "Neuro Fly / Wetware"
                      : "GPT-6 Astra / Hardware"}
                  </dd>
                </div>
                <div>
                  <dt>Mode</dt>
                  <dd>Local demo</dd>
                </div>
                <div>
                  <dt>Gas or payment</dt>
                  <dd>None</dd>
                </div>
              </dl>
              <div className="notice">
                <FlaskConical size={20} />
                <span>
                  Creator fees are simulated and attributed to this side’s pool.
                  The production pons launch and fee collector are not
                  connected.
                </span>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                />
                <span>
                  I understand this creates a local demo record, not an onchain
                  token, and the selected side receives its simulated
                  contributions.
                </span>
              </label>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button primary full"
                onClick={() => void launch()}
                disabled={busy}
              >
                {busy ? (
                  <>
                    <LoaderCircle size={17} className="spin" /> Creating your
                    problem
                  </>
                ) : ui.wallet ? (
                  "Create demo token"
                ) : (
                  "Choose a pilot to continue"
                )}
              </button>
              <button
                className="text-button"
                disabled={busy}
                onClick={() => setStep(1)}
              >
                <ChevronLeft size={14} /> Back to editing
              </button>
            </div>
          )}
        </section>
        <aside className="launch-preview">
          <div className={`panel launch-preview-card ${input.faction}`}>
            <span className="eyebrow">Your token preview</span>
            <div className="launch-art">
              {input.image.startsWith("data:") ? (
                <img src={input.image} alt="Token artwork preview" />
              ) : (
                <FighterArtwork faction={input.faction} stage={2} />
              )}
            </div>
            <div className="preview-token-identity">
              <TokenAvatar
                token={{
                  ...input,
                  id: "preview",
                  emoji: "",
                  createdAt: 0,
                  marketCap: 0,
                  contribution: 0,
                  change: 0,
                  source: "demo",
                }}
              />
              <div>
                <h2>{input.name || "Your token name"}</h2>
                <span className="mono">${input.ticker || "???"}</span>
              </div>
            </div>
            <p>
              {input.description ||
                "No lore yet. The mystery is part of the charm."}
            </p>
            <div className="preview-routing">
              <span className={`faction-pill ${input.faction}`}>
                {input.faction === "fly" ? "Team Fly" : "Team Astra"}
              </span>
              <span className="micro muted">Event 001</span>
            </div>
          </div>
          <div className="launch-fineprint">
            <LockKeyhole size={16} />
            <p>
              No payment. No signing. Your draft stays in this browser.{" "}
              <Link to="/docs#launch">How launches work</Link>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
