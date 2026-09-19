import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
export default function Docs() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            <BookOpen size={14} /> REQUIRED READING. OPTIONAL COMMON SENSE.
          </span>
          <h1>
            THE FIELD <span className="orange">MANUAL.</span>
          </h1>
          <p>How the fees become the fight. Without the 40-page whitepaper.</p>
        </div>
        <span className="manual-stamp">
          READ BEFORE
          <br />
          FEEDING
        </span>
      </div>
      <div className="docs-layout">
        <nav className="docs-nav" aria-label="Documentation chapters">
          {[
            ["loop", "01 / The idea"],
            ["fees", "02 / Follow the fees"],
            ["evolution", "03 / Growing problems"],
            ["battle", "04 / The final fight"],
            ["demo", "05 / What is simulated"],
            ["wallet", "06 / Wallet & launch"],
            ["pons", "07 / pons integration"],
            ["controls", "08 / Human controls"],
          ].map(([id, label]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <article className="docs-content">
          <section id="loop">
            <span className="eyebrow">01 / THE IDEA</span>
            <h2>YOUR TOKEN HAS CHOSEN VIOLENCE.</h2>
            <p>
              FVF (FeesVFees) is a faction-based token launchpad concept for
              pons on Robinhood Chain. Each token backs one fighter in a shared
              battle: Zombie Neuro Fly or GPT-6 Astra.
            </p>
            <div className="doc-loop">
              LAUNCH → PICK A SIDE → GENERATE FEES → EVOLVE → FIGHT
            </div>
            <p>
              The tokens stay independent. Their creator-fee contributions feed
              the same two pools. Launching a token alone adds a recruit, not
              power; power grows when creator fees are contributed.
            </p>
          </section>
          <section id="fees">
            <span className="eyebrow">02 / FOLLOW THE FEES</span>
            <h2>FEED THE MONSTER. NOT ITS EGO.</h2>
            <p>
              The intended routing sends 100% of a participating token's{" "}
              <strong>creator share</strong> to its chosen faction's recipient.
              That is not 100% of trading volume or all protocol fees.
            </p>
            <p>
              In this demo, pool totals are the sum of each recruit's simulated
              contribution. Dollar amounts are illustrative, not converted from
              ETH or fetched from an oracle. Market caps and percentage changes
              are seeded examples.
            </p>
            <div className="notice">
              Production recipient addresses, fee claims, and the contribution
              indexer are not connected. No real funds are collected.
            </div>
          </section>
          <section id="evolution">
            <span className="eyebrow">03 / GROWING PROBLEMS</span>
            <h2>IT WAS CUTER BEFORE THE UPGRADES.</h2>
            <p>
              Both fighters have five stages at $0, $25K, $75K, $150K, and $250K
              in demo creator fees. Each threshold changes the fighter's aura,
              size, stage label, and unlocked skills.
            </p>
            <p>
              Demo power is floor(pool × 0.72). Battle control is the faction's
              share of the total pool. Skill names and effects are presentation
              only; they do not multiply fees or imply additional economic
              benefits.
            </p>
            <p>
              Use “Simulate $25K in fees” in the arena to watch the next form
              unlock.
            </p>
          </section>
          <section id="battle">
            <span className="eyebrow">04 / THE FINAL FIGHT</span>
            <h2>ONE TIMER. TWO BAD OUTCOMES.</h2>
            <p>
              The final ten seconds trigger a warning. At zero, recruitment and
              new demo contributions close, the fighters enter a short animated
              clash, and a winner is revealed.
            </p>
            <p>
              <strong>Demo rule:</strong> the larger creator-fee pool wins.
              Equal pools produce a draw. Combat swings are cinematic
              presentation; they do not change the underlying result.
            </p>
            <p>
              The result resolver is separate from the visuals so another rule
              can be introduced later. There are no wagers, rewards,
              distribution rules, or payouts in this MVP.
            </p>
            <Link className="text-button" to="/battle/season-01">
              Try the finale in the arena <ArrowUpRight size={16} />
            </Link>
          </section>
          <section id="demo">
            <span className="eyebrow">05 / WHAT IS SIMULATED</span>
            <h2>REAL INTERFACE. DEMO MAYHEM.</h2>
            <p>
              All tokens, pools, power, market caps, activity, history, and
              battle outcomes are local demo data. The “Demo broadcast” banner
              stays visible throughout the product.
            </p>
            <p>
              The simulator adds an event roughly every seven seconds while the
              tab is visible. New recruits and changes are saved in this
              browser's local storage. The countdown uses a persisted deadline.
              Pausing the activity feed freezes that view; it does not stop the
              battle.
            </p>
            <p>
              Drafts are saved for this browser session. Uploaded artwork
              remains local. If browser storage is blocked or full, the demo
              works in memory but may not survive a reload. Clearing site data
              resets the demo.
            </p>
          </section>
          <section id="wallet">
            <span className="eyebrow">06 / WALLET & LAUNCH</span>
            <h2>NO SIGNATURES IN THE SIMULATOR.</h2>
            <p>
              “Use demo pilot” creates a local identity. “Connect browser
              wallet” optionally requests account access from an installed EVM
              wallet. It does not sign messages, switch networks, approve
              spending, or send a transaction.
            </p>
            <p>
              The launch review names your fighter, token, and intended fee
              destination. The demo creates a local recruit with a demo ID, not
              an address or transaction hash. A real wallet connection does not
              enable production launch.
            </p>
            <p>
              For a future onchain launch, the interface must display the actual
              chain, verified recipient, current fee quote, approvals, and
              transaction simulation before wallet confirmation.
            </p>
          </section>
          <section id="pons">
            <span className="eyebrow">07 / PONS INTEGRATION</span>
            <h2>THE ADAPTER IS READY. THE RAILS COME NEXT.</h2>
            <p>
              Research found separate V1 and V2 pons launch mechanisms. The
              current V2 source exposes a creator-fee recipient in launch
              parameters. Production needs a verified deployment and dedicated
              faction recipients, metadata hosting, and an indexer that
              attributes received fees to each token.
            </p>
            <p>
              UsePaid's documentation currently labels its pons integration as
              not live. Its flow is an information-architecture reference, not
              proof of a working integration for FVF.
            </p>
            <div className="doc-links">
              <a
                href="https://github.com/ponsdotdev/pons-labs"
                target="_blank"
                rel="noreferrer"
              >
                Official pons contracts <ArrowUpRight size={16} />
              </a>
              <a
                href="https://docs.ponsfamily.com/"
                target="_blank"
                rel="noreferrer"
              >
                pons documentation <ArrowUpRight size={16} />
              </a>
              <a
                href="https://usepaid.app/docs"
                target="_blank"
                rel="noreferrer"
              >
                UsePaid documentation <ArrowUpRight size={16} />
              </a>
            </div>
            <p className="micro muted">
              Reviewed September 20, 2026. FVF is an independent experiment, not
              an official pons, Robinhood, or OpenAI product. Astra is a
              fictional character.
            </p>
          </section>
          <section id="controls">
            <span className="eyebrow">08 / HUMAN CONTROLS</span>
            <h2>YOU STILL HAVE A LITTLE CONTROL.</h2>
            <p>
              Sound is off until you enable it in the header or arena. System
              reduced-motion preferences stop idle, ticker, shake, and combat
              animations; the battle remains readable as state changes.
            </p>
            <p>
              Try poking a fighter. Repeatedly. They have opinions. Keyboard
              users can focus every control, open token profiles, choose skills,
              and dismiss dialogs with Escape.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
