import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Upload,
  Check,
  Zap,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { useUI } from "../state";
import { demoAdapter } from "../data/demo-adapter";
import { FACTIONS, validateLaunch } from "../domain/battle";
import type { Faction, LaunchInput, Token } from "../domain/types";
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
    const v = JSON.parse(sessionStorage.getItem("fvf:draft") ?? "null");
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
    /* Empty draft. */
  }
  return empty;
}
export default function Launch() {
  const [params] = useSearchParams();
  const [input, setInput] = useState<LaunchInput>(() => ({
    ...readDraft(),
    ...(params.get("faction") === "astra"
      ? { faction: "astra", image: "/art/astra.webp" }
      : params.get("faction") === "fly"
        ? { faction: "fly", image: "/art/fly.webp" }
        : {}),
  }));
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ack, setAck] = useState(false);
  const [created, setCreated] = useState<Token | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const ui = useUI();
  useEffect(() => {
    if (created) return;
    try {
      sessionStorage.setItem("fvf:draft", JSON.stringify(input));
    } catch {
      /* Draft persistence is best effort. */
    }
  }, [input, created]);
  const change = (key: keyof LaunchInput, value: string) => {
    setInput((v) => ({ ...v, [key]: value }));
    setError("");
  };
  function faction(f: Faction) {
    setInput((v) => ({
      ...v,
      faction: f,
      image: v.image.startsWith("/art/") ? `/art/${f}.webp` : v.image,
    }));
  }
  async function upload(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Use a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Keep your image under 2 MB.");
      return;
    }
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Image could not be read."));
        reader.readAsDataURL(file);
      });
      const image = new Image();
      image.src = data;
      await image.decode();
      change("image", data);
    } catch {
      setError("That image could not be opened. Try another file.");
    }
  }
  function next(event: FormEvent) {
    event.preventDefault();
    const err = validateLaunch(input);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep(2);
    window.scrollTo({ top: 180, behavior: "smooth" });
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
      const result = await demoAdapter.launch(input);
      if (result.source === "demo") {
        setCreated(result.token);
        sessionStorage.removeItem("fvf:draft");
        ui.toast("Your token is now a problem.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Launch failed. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  if (created)
    return (
      <div className={`page launch-page theme-${created.faction}`}>
        <section className="launch-success">
          <div className="success-seal">
            <Check size={52} />
          </div>
          <span className="eyebrow">LOCAL DEMO LAUNCH COMPLETE</span>
          <h1>
            YOUR TOKEN IS
            <br />
            NOW A <span className="orange">WEAPON.</span>
          </h1>
          <p>
            <strong>${created.ticker}</strong> joined{" "}
            {FACTIONS[created.faction].name}.<br />
            {demoAdapter.persistenceAvailable
              ? "It is saved in this browser and listed in the demo arsenal."
              : "It is listed for this session. Browser storage is unavailable; a reload will lose this recruit."}
          </p>
          <div className="notice">
            <ShieldCheck size={20} />
            <span>
              No token was deployed onchain. No transaction or signature was
              requested.
            </span>
          </div>
          <div className="button-row">
            <Link className="button primary" to={`/tokens/${created.id}`}>
              Meet your recruit <ArrowUpRight size={18} />
            </Link>
            <Link className="button" to="/battle/season-01">
              Back to the fight
            </Link>
          </div>
        </section>
      </div>
    );
  return (
    <div className={`page launch-page theme-${input.faction}`}>
      <div className="page-heading">
        <div>
          <span className="eyebrow">RECRUITMENT IS OPEN / DEMO LAUNCH</span>
          <h1>
            CREATE A <span className="orange">SMALL PROBLEM.</span>
          </h1>
          <p>Give it a name. Give it a side. Let the fees do the talking.</p>
        </div>
        <span className="hand-note">
          terrible ideas
          <br />
          welcome here ↙
        </span>
      </div>
      <div className="launch-layout">
        <section className="launch-form-panel">
          <div className="form-steps">
            <button
              className={step === 1 ? "active" : ""}
              onClick={() => setStep(1)}
              disabled={busy}
            >
              <b>01</b> Build your weapon
            </button>
            <span>→</span>
            <button
              className={step === 2 ? "active" : ""}
              onClick={() => {
                const err = validateLaunch(input);
                if (err) setError(err);
                else setStep(2);
              }}
              disabled={busy}
            >
              <b>02</b> Review & recruit
            </button>
          </div>
          {step === 1 ? (
            <form onSubmit={next} noValidate>
              <div className="form-section-title">
                <span>01 /</span>
                <h2>WHOSE SIDE ARE YOU ON?</h2>
              </div>
              <div className="faction-picker">
                {(["fly", "astra"] as Faction[]).map((f) => (
                  <button
                    type="button"
                    key={f}
                    className={`faction-option ${f} ${input.faction === f ? "selected" : ""}`}
                    onClick={() => faction(f)}
                    aria-pressed={input.faction === f}
                  >
                    <img src={`/art/${f}.webp`} alt="" />
                    <span>
                      <strong>{FACTIONS[f].cta}</strong>
                      <small>
                        {f === "fly"
                          ? "BIOLOGICALLY UNHINGED"
                          : "ARTIFICIALLY SUPERIOR"}
                      </small>
                    </span>
                    <i>{input.faction === f ? <Check size={15} /> : null}</i>
                  </button>
                ))}
              </div>
              <div className="form-section-title">
                <span>02 /</span>
                <h2>GIVE IT AN IDENTITY.</h2>
              </div>
              <div className="image-input">
                <button
                  className="upload-preview"
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Upload token image"
                >
                  <img src={input.image} alt="Token artwork preview" />
                  <span>
                    <Upload size={15} />
                  </span>
                </button>
                <div>
                  <strong>A face only the internet could love.</strong>
                  <p>
                    Upload PNG, JPG, or WebP. Max 2 MB.
                    <br />
                    Or keep your fighter as the token image.
                  </p>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    Choose image <ArrowUpRight size={14} />
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
                  Token name{" "}
                  <input
                    value={input.name}
                    onChange={(e) => change("name", e.target.value)}
                    maxLength={32}
                    placeholder="e.g. Definitely a Bug"
                    required
                    autoComplete="off"
                  />
                </label>
                <label>
                  Ticker{" "}
                  <div className="ticker-input">
                    <span aria-hidden="true">$</span>
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
                      placeholder="BUG"
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
                  placeholder="Tell us why this needed to exist."
                  required
                />
              </label>
              <details className="social-details">
                <summary>
                  Social links <span>OPTIONAL +</span>
                </summary>
                <div className="form-grid">
                  <label>
                    Website
                    <input
                      type="url"
                      value={input.website}
                      onChange={(e) => change("website", e.target.value)}
                      placeholder="https://your-chaos.com"
                    />
                  </label>
                  <label>
                    X handle
                    <input
                      value={input.x}
                      onChange={(e) => change("x", e.target.value)}
                      placeholder="@questionableideas"
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
              <button type="submit" className="button primary full">
                Review your weapon <ArrowRight size={19} />
              </button>
              <p className="micro muted form-footnote">
                Demo mode. Images stay in your browser. No upload to IPFS.
              </p>
            </form>
          ) : (
            <div className="review-step">
              <span className="eyebrow">
                LAST CHANCE TO DEVELOP COMMON SENSE
              </span>
              <h2>READY TO MAKE IT WORSE?</h2>
              <dl className="review-list">
                <div>
                  <dt>Token</dt>
                  <dd>
                    {input.name} <b>${input.ticker}</b>
                  </dd>
                </div>
                <div>
                  <dt>Fighter</dt>
                  <dd>{FACTIONS[input.faction].name}</dd>
                </div>
                <div>
                  <dt>Creator-fee destination</dt>
                  <dd>{FACTIONS[input.faction].short} battle pool</dd>
                </div>
                <div>
                  <dt>Creator fees routed</dt>
                  <dd>100% of this token's creator share</dd>
                </div>
                <div>
                  <dt>Network</dt>
                  <dd>Local demo · no chain transaction</dd>
                </div>
                <div>
                  <dt>Launch cost</dt>
                  <dd>$0 demo · no gas</dd>
                </div>
                <div>
                  <dt>Signatures now</dt>
                  <dd>None</dd>
                </div>
              </dl>
              <div className="notice">
                <ShieldCheck size={23} />
                <p>
                  In production, launch and any required approvals need your
                  wallet confirmation. The fee recipient and exact network fees
                  must be shown before signing. This demo only saves a local
                  recruit.
                </p>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  disabled={busy}
                />
                <span>
                  I understand this is a simulated launch and this token's
                  creator fees are assigned to {FACTIONS[input.faction].short}{" "}
                  in the demo.
                </span>
              </label>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button primary full"
                onClick={launch}
                disabled={busy || (!ack && !!ui.wallet)}
              >
                {busy ? (
                  <>
                    <LoaderCircle className="spin" size={18} /> Recruiting your
                    problem…
                  </>
                ) : ui.wallet ? (
                  <>
                    Launch demo token <Zap size={18} />
                  </>
                ) : (
                  <>
                    Connect to launch <ArrowRight size={18} />
                  </>
                )}
              </button>
              <button
                className="text-button back-button"
                onClick={() => setStep(1)}
                disabled={busy}
              >
                <ArrowLeft size={15} /> Back to editing
              </button>
            </div>
          )}
        </section>
        <aside className="launch-preview">
          <div className="preview-top">
            <span className="eyebrow">YOUR FUTURE PROBLEM</span>
            <span className="demo-tag">PREVIEW</span>
          </div>
          <div className={`preview-art ${input.faction}`}>
            <span className="preview-orbit" />
            <img src={input.image} alt="Your token preview" />
            <span className="preview-star">✧</span>
          </div>
          <div className="preview-details">
            <span className="faction-pill">
              {FACTIONS[input.faction].short} RECRUIT
            </span>
            <h2>{input.name || "An unnamed menace"}</h2>
            <span className="preview-ticker">
              ${input.ticker || "YOURTICKER"}
            </span>
            <p>
              {input.description ||
                "No lore yet. Just enormous potential for poor decisions."}
            </p>
            <div className="preview-flow">
              <span>YOUR TOKEN</span>
              <Zap size={17} />
              <span>CREATOR FEES</span>
              <ArrowRight size={17} />
              <strong>{FACTIONS[input.faction].short}</strong>
            </div>
            <p className="micro muted">
              Trading creates fees. Fees feed your fighter. Your token joins one
              shared battle.
            </p>
          </div>
          <div className="preview-sticker">
            100% OF CREATOR FEES.
            <br />
            0% COMMON SENSE.
          </div>
        </aside>
      </div>
    </div>
  );
}
