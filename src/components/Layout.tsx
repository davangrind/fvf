import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { useBattle, useUI } from "../state";
import { WalletModal } from "./WalletModal";
import { Modal } from "./Modal";
import { arenaEvents } from "../data/events";
import { manualChapters } from "../data/manual";
import { demoAdapter } from "../data/demo-adapter";
import { Blob } from "./Creatures";

function CursorField() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    const move = (e: PointerEvent) => {
      if (!media.matches || !ref.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!ref.current) return;
        ref.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
        ref.current.dataset.active = String(
          Boolean(
            (e.target as Element).closest("a,button,input,select,summary"),
          ),
        );
        ref.current.style.opacity = "1";
      });
    };
    const hide = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={ref} className="cursor-field" aria-hidden="true">
      <div className="cursor-light" />
      <svg viewBox="-60 -60 120 120">
        <path d="M-23 -15L21 -22L31 21L-17 29Z M-23 -15L31 21" />
        <circle cx="-23" cy="-15" r="2" />
        <circle cx="21" cy="-22" r="2" />
        <circle cx="31" cy="21" r="2" />
        <circle cx="-17" cy="29" r="2" />
      </svg>
    </div>
  );
}
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
          <Blob variant={2} />
          <h3>No brain cells found</h3>
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
      return localStorage.getItem("fvf:theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
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
  const location = useLocation();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("fvf:theme", theme);
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
    document.title = `FVF / ${name ? name[0].toUpperCase() + name.slice(1) : "Internet nonsense, with consequences"}`;
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CursorField />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-shell">
          <Link className="brand" to="/" aria-label="FVF home">
            <svg viewBox="0 0 34 32" aria-hidden="true">
              <path
                d="M3 6H14V12H9V15H14V21H9V28H3ZM17 6H23L26 19L29 6H34L29 28H23Z"
                fill="currentColor"
              />
              <circle cx="5" cy="3" r="2" />
              <circle cx="29" cy="3" r="2" />
            </svg>
            <span>
              fvf
              <span className="brand-period" />
            </span>
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
              Arena <i className="live-dot" />
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
              className={`theme-switch ${theme}`}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              title={theme === "dark" ? "Day shift" : "Night shift"}
            >
              <span className="theme-orbit" />
              <span className="theme-creature">
                <i />
                <i />
              </span>
            </button>
            <Link to="/launch" className="button primary nav-launch">
              Launch
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
                    : `${ui.wallet.label.slice(0, 6)}...`
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
      <main id="main" tabIndex={-1}>
        {!demoAdapter.persistenceAvailable && (
          <div className="storage-notice" role="status">
            Browser storage is unavailable. Your demo changes last for this
            session.
          </div>
        )}
        <Outlet />
      </main>
      <footer className="site-footer">
        <div>
          <Link className="footer-brand" to="/">
            fvf
          </Link>
          <p>Good tech for deeply unserious things</p>
          <small>
            An independent launchpad concept for pons on Robinhood Chain
          </small>
        </div>
        <div className="footer-links">
          <Link to="/docs#fee-flow">Where do the fees go?</Link>
          <Link to="/docs#demo">About this demo</Link>
          <a
            href="https://www.ponsfamily.com/"
            target="_blank"
            rel="noreferrer"
          >
            Meet pons
          </a>
        </div>
        <div className="footer-controls">
          <span className="badge">
            <i className="live-dot" /> Local demo
          </span>
          <div>
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
          <small>© 2026 FeesVFees</small>
        </div>
        <p className="footer-disclaimer">
          Simulated tokens, fees and metrics. No real trades or payouts. FVF is
          not affiliated with pons, Robinhood or OpenAI.
        </p>
      </footer>
      <GlobalSearch open={search} close={() => setSearch(false)} />
      <WalletModal />
    </>
  );
}
