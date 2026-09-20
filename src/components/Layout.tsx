import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Search,
  Menu,
  X,
  Volume2,
  VolumeX,
  Wallet,
  Command,
  CircleHelp,
  Pause,
  Play,
  Zap,
  Radio,
  Sun,
  Moon,
  ArrowUpRight,
} from "lucide-react";
import { useBattle, useUI } from "../state";
import { WalletModal } from "./WalletModal";
import { Modal } from "./Modal";
import { arenaEvents } from "../data/events";
import { manualChapters } from "../data/manual";
import { demoAdapter } from "../data/demo-adapter";
import { TopicIcon } from "./Artwork";

function GlobalSearch({ open, close }: { open: boolean; close: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const state = useBattle();
  const navigate = useNavigate();
  const entries = [
    ...[
      { name: "Home", path: "/" },
      { name: "Tokens", path: "/tokens" },
      { name: "Arena", path: "/arena" },
      { name: "Numbers", path: "/numbers" },
      { name: "Field manual", path: "/docs" },
      { name: "Launch a token", path: "/launch" },
    ].map((p) => ({ ...p, kind: "Page" })),
    ...state.tokens.map((t) => ({
      name: `${t.name} / $${t.ticker}`,
      path: `/tokens/${t.id}`,
      kind: "Token",
    })),
    ...arenaEvents
      .filter((e) => e.status === "preparing")
      .map((e) => ({
        name: e.subtitle,
        path: `/arena/${e.id}`,
        kind: "Arena",
      })),
    ...manualChapters.map((c) => ({
      name: c.title,
      path: `/docs#${c.id}`,
      kind: "Manual",
    })),
  ];
  const results = entries
    .filter((e) =>
      `${e.name} ${e.kind}`.toLowerCase().includes(query.toLowerCase().trim()),
    )
    .slice(0, 9);
  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
    }
  }, [open]);
  const go = (path: string) => {
    close();
    navigate(path);
  };
  return (
    <Modal open={open} onClose={close} title="Find your rabbit hole">
      <div className="search-input">
        <Search size={20} />
        <input
          autoFocus
          placeholder="Tokens, arenas, existential questions..."
          aria-label="Search FVF"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded="true"
          aria-activedescendant={results[index] ? `result-${index}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(i + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            }
            if (e.key === "Enter" && results[index]) {
              e.preventDefault();
              go(results[index].path);
            }
          }}
        />
        <kbd>esc</kbd>
      </div>
      <div
        id="search-results"
        className="search-results"
        role="listbox"
        aria-label="Search results"
      >
        {results.map((r, i) => (
          <button
            key={r.path}
            id={`result-${i}`}
            role="option"
            aria-selected={index === i}
            onMouseEnter={() => setIndex(i)}
            onClick={() => go(r.path)}
          >
            <span>{r.name}</span>
            <small>{r.kind}</small>
          </button>
        ))}
      </div>
      {!results.length && (
        <div className="empty-state">
          <TopicIcon variant={4} />
          <h3>No results on this frequency</h3>
          <p>Try a token ticker, “fees” or “arena”.</p>
        </div>
      )}
      <p className="micro muted">
        Use your arrow keys to browse and Enter to open
      </p>
    </Modal>
  );
}
export function Layout() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("fvf:theme:v3") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const [motion, setMotion] = useState(() => {
    try {
      return localStorage.getItem("fvf:motion") !== "paused";
    } catch {
      return true;
    }
  });
  const ui = useUI();
  const state = useBattle();
  const location = useLocation();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("fvf:theme:v3", theme);
    } catch {
      /* optional preference */
    }
  }, [theme]);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "paused";
    try {
      localStorage.setItem("fvf:motion", motion ? "on" : "paused");
    } catch {
      /* optional preference */
    }
  }, [motion]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((s) => !s);
      }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  useLayoutEffect(() => {
    setMenu(false);
    if (!location.hash)
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const name = location.pathname.split("/")[1];
    document.title = `FVF / ${name ? name[0].toUpperCase() + name.slice(1) : "Fees fuel internet chaos"}`;
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-shell">
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
              Home
            </NavLink>
            <NavLink to="/tokens">Tokens</NavLink>
            <NavLink to="/arena">
              Arena <span className="nav-dot" />
            </NavLink>
            <NavLink to="/numbers">Numbers</NavLink>
            <NavLink to="/docs">Field manual</NavLink>
          </nav>
          <div className="header-actions">
            <button
              className="search-trigger"
              onClick={() => setSearch(true)}
              aria-label="Open global search"
            >
              <Search size={17} />
              <span>Search</span>
              <kbd>
                <Command size={10} /> K
              </kbd>
            </button>
            <button
              className={`icon-button theme-switch ${theme}`}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/launch" className="button primary nav-launch">
              Launch <ArrowUpRight size={15} />
            </Link>
            <button
              className="button wallet-button"
              onClick={ui.openWallet}
              aria-label={
                ui.wallet
                  ? ui.wallet.kind === "demo"
                    ? "Demo pilot"
                    : "Connected wallet"
                  : "Connect wallet"
              }
            >
              <Wallet size={16} />
              <span>
                {ui.wallet
                  ? ui.wallet.kind === "demo"
                    ? "Demo pilot"
                    : ui.wallet.label.slice(0, 6) + "..."
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
        </div>
      </header>
      <div className="ticker" aria-label="Simulated platform updates">
        <span className="ticker-label">
          <i /> FVF BROADCAST
        </span>
        <div className="ticker-window">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div className="ticker-copy" aria-hidden={copy === 1} key={copy}>
                <span>
                  <Radio size={13} /> ONE PLATFORM / MANY BAD IDEAS
                </span>
                <span>
                  <Zap size={13} /> LAUNCH ON PONS / FUEL YOUR EVENT
                </span>
                {state.events.slice(0, 3).map((e) => (
                  <span key={e.id}>
                    <Radio size={12} className={e.faction} />
                    {e.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Link to="/docs#demo" className="ticker-info">
          SIMULATED DATA <ArrowUpRight size={12} />
        </Link>
      </div>
      <main id="main" tabIndex={-1}>
        {!demoAdapter.persistenceAvailable && (
          <div className="storage-notice" role="status">
            SESSION-ONLY DEMO / Browser storage is unavailable. Your changes
            last for this session.
          </div>
        )}
        <Outlet />
      </main>
      <footer className="site-footer">
        <Link to="/" className="footer-logo">
          FVF<span>®</span>
        </Link>
        <div className="footer-copy">
          <strong>FEES FUEL INTERNET CHAOS</strong>
          <p>
            An independent launchpad concept for{" "}
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
            Local demo. No real tokens, trades or payouts. Not affiliated with
            pons, Robinhood or OpenAI.
          </small>
        </div>
        <div className="footer-links">
          <Link to="/docs#fee-flow">
            Follow the fees <ArrowUpRight size={14} />
          </Link>
          <Link to="/arena">
            Find your next event <ArrowUpRight size={14} />
          </Link>
          <div className="footer-controls">
            <button
              className="icon-button"
              onClick={ui.toggleSound}
              aria-label={ui.sound ? "Mute sound" : "Enable sound"}
            >
              {ui.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              className="icon-button"
              onClick={() => setMotion((m) => !m)}
              aria-label={
                motion ? "Pause ambient motion" : "Resume ambient motion"
              }
            >
              {motion ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <Link className="icon-button" to="/docs" aria-label="Help">
              <CircleHelp size={18} />
            </Link>
          </div>
          <span>FEES VERSUS FEES / © 2026 FVF</span>
        </div>
      </footer>
      <GlobalSearch open={search} close={() => setSearch(false)} />
      <WalletModal />
    </>
  );
}
