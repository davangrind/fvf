import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Volume2,
  VolumeX,
  Menu,
  X,
  Zap,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useBattle, useUI } from "../state";
import { WalletModal } from "./WalletModal";
import { demoAdapter } from "../data/demo-adapter";
export function Layout() {
  const [menu, setMenu] = useState(false);
  const ui = useUI();
  const location = useLocation();
  const state = useBattle();
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
    const names: Record<string, string> = {
      "/": "Fees feed the fight.",
      "/launch": "Recruit a token",
      "/tokens": "The arsenal",
      "/activity": "War wire",
      "/docs": "Field manual",
    };
    document.title = `FVF — ${names[location.pathname] ?? "The arena"}`;
  }, [location.pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="FVF home">
          <Zap className="brand-bolt" fill="currentColor" />
          <span>
            FVF<span className="brand-dot">®</span>
          </span>
          <small>
            FEES
            <br />
            VERSUS FEES
          </small>
        </Link>
        <nav
          className={menu ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/battle/season-01">
            The arena <span className="nav-dot" />
          </NavLink>
          <NavLink to="/tokens">Tokens</NavLink>
          <NavLink to="/activity">Activity</NavLink>
          <NavLink to="/docs">
            Field manual <ArrowUpRight size={13} />
          </NavLink>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button sound-button"
            onClick={ui.toggleSound}
            aria-label={ui.sound ? "Mute sound" : "Enable sound"}
            title={ui.sound ? "Sound on" : "Sound off"}
          >
            {ui.sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button className="button wallet-button" onClick={ui.openWallet}>
            <Wallet size={16} />
            <span>
              {ui.wallet
                ? ui.wallet.kind === "demo"
                  ? "Demo pilot"
                  : `${ui.wallet.label.slice(0, 6)}…`
                : "Connect wallet"}
            </span>
          </button>
          <button
            className="icon-button menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label="Toggle navigation"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <div className="ticker" aria-label="Simulated battle updates">
        <span className="ticker-label">
          <i /> DEMO BROADCAST
        </span>
        <div className="ticker-window">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div className="ticker-copy" aria-hidden={copy === 1} key={copy}>
                {state.events.slice(0, 4).map((e) => (
                  <span key={e.id}>
                    <b className={e.faction}>✦</b>
                    {e.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Link to="/docs#demo" className="ticker-info">
          SIMULATED DATA ↗
        </Link>
      </div>
      <main id="main" tabIndex={-1}>
        {!demoAdapter.persistenceAvailable && (
          <div className="storage-notice" role="status">
            SESSION-ONLY DEMO · Your browser could not save changes. Keep this
            tab open to retain your recruits.
          </div>
        )}
        <Outlet />
      </main>
      <footer className="site-footer">
        <Link to="/" className="footer-logo">
          FVF<span>®</span>
        </Link>
        <div>
          <strong>FEES FEED THE FIGHT.</strong>
          <p>
            An independent experiment for{" "}
            <a
              href="https://www.ponsfamily.com/"
              target="_blank"
              rel="noreferrer"
            >
              pons
            </a>{" "}
            on Robinhood Chain.
          </p>
          <small>
            Playable demo. No real tokens, trades, or payouts. Not affiliated
            with pons, Robinhood, or OpenAI.
          </small>
        </div>
        <div className="footer-links">
          <Link to="/docs">
            Read the field manual <ArrowUpRight size={15} />
          </Link>
          <Link to="/launch">
            Make something unhinged <ArrowUpRight size={15} />
          </Link>
          <span>SEASON 001 / © 2026 FVF</span>
        </div>
      </footer>
      <WalletModal />
    </>
  );
}
