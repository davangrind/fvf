import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Copy, Swords } from "lucide-react";
import { FVF_CA, FVF_SWAP_URL } from "../domain/solana";
import { bleep, useUI } from "../state";

export function SolanaMark() {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 24 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5 1h18l-4 4H1zM1 8h18l4 4H5zM5 15h18l-4 4H1z" />
    </svg>
  );
}

export function Welcome() {
  const ui = useUI();
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<"fly" | "astra" | null>(null);
  async function copy() {
    if (!FVF_SWAP_URL) return;
    try {
      await navigator.clipboard.writeText(FVF_CA);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      ui.toast("Select the address to copy it manually");
    }
  }
  function poke(side: "fly" | "astra") {
    setReaction(side);
    bleep(ui.sound, side === "fly" ? 210 : 730);
  }
  return (
    <section className="welcome" aria-label="FVF on Solana">
      <div className="welcome-topline">
        <span>
          <i className="live-dot" /> ARENA LIVE NOW
        </span>
        <span>
          <SolanaMark /> SOLANA <span className="welcome-divider">/</span>{" "}
          PUMP.FUN
        </span>
      </div>
      <div className="welcome-radial welcome-radial-fly" />
      <div className="welcome-radial welcome-radial-astra" />
      <div className="welcome-wordmark" aria-hidden="true">
        FVF<span>®</span>
      </div>
      <div className="welcome-fighter welcome-fly">
        <span className="welcome-side-label">
          NEURO FLY <small>ORGANIC CHAOS</small>
        </span>
        <button
          onClick={() => poke("fly")}
          aria-label="Provoke Neuro Fly"
          className={reaction === "fly" ? "is-poked" : ""}
        >
          <img
            src="/art/fly.webp"
            alt="Neuro Fly, champion of the swarm"
            fetchPriority="high"
          />
        </button>
        {reaction === "fly" && (
          <span className="welcome-speech" role="status">
            YOUR RAM LOOKS EDIBLE
          </span>
        )}
      </div>
      <div className="welcome-fighter welcome-astra">
        <span className="welcome-side-label">
          GPT-6 ASTRA <small>ARTIFICIAL AUDACITY</small>
        </span>
        <button
          onClick={() => poke("astra")}
          aria-label="Provoke Astra"
          className={reaction === "astra" ? "is-poked" : ""}
        >
          <img
            src="/art/astra.webp"
            alt="Astra, the machine with an attitude"
            fetchPriority="high"
          />
        </button>
        {reaction === "astra" && (
          <span className="welcome-speech" role="status">
            BUG DETECTED. IT HAS LEGS.
          </span>
        )}
      </div>
      <div className="welcome-center">
        <span className="welcome-edition">FEES VERSUS FEES / EST. ONLINE</span>
        <h1>
          THE INTERNET
          <br />
          PICKED A FIGHT
        </h1>
        <p>
          Tokens on Solana. Rivalries on FVF.
          <br />
          Launch on pump.fun. Let the fees fuel the chaos.
        </p>
        <div className="welcome-contract">
          <div className="welcome-contract-title">
            <strong>$FVF</strong>
            <span>
              <SolanaMark /> SOL
            </span>
          </div>
          <div className="welcome-address">
            <span>CA</span>
            <code>
              {FVF_SWAP_URL ? FVF_CA : "CONTRACT ADDRESS COMING SOON"}
            </code>
            <button
              onClick={copy}
              disabled={!FVF_SWAP_URL}
              aria-label={copied ? "Address copied" : "Copy contract address"}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
            </button>
          </div>
          {FVF_SWAP_URL ? (
            <a
              className="welcome-swap"
              href={FVF_SWAP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              SWAP ON PUMP.FUN <ArrowUpRight size={23} />
            </a>
          ) : (
            <button className="welcome-swap" disabled>
              SWAP <ArrowUpRight size={23} />
            </button>
          )}
          <small>
            {FVF_SWAP_URL
              ? "ONE TOKEN. MANY BAD IDEAS."
              : "Swap opens when the official CA is announced"}
          </small>
        </div>
        <Link className="welcome-enter" to="/arena/season-01">
          <Swords size={16} /> ENTER THE FIRST ARENA <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="welcome-bottom">
        <span>01 / THE ORIGINAL BEEF</span>
        <span>
          NEURO FLY <b>VS</b> GPT-6 ASTRA
        </span>
        <span>MORE ARENAS. MORE CHAOS.</span>
      </div>
    </section>
  );
}
