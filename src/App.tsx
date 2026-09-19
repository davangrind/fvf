import { Component, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
const Battle = lazy(() => import("./pages/Battle"));
const Launch = lazy(() => import("./pages/Launch"));
const Tokens = lazy(() => import("./pages/Tokens"));
const TokenDetail = lazy(() => import("./pages/TokenDetail"));
const Activity = lazy(() => import("./pages/Activity"));
const Docs = lazy(() => import("./pages/Docs"));
class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="page empty-state">
        <h1>THE LAB HAD A MOMENT.</h1>
        <p>Your local demo data is still in your browser.</p>
        <button className="button primary" onClick={() => location.reload()}>
          Reload the lab
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function App() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="loading-screen">
            <span className="loading-star">✳</span>
            <h2>WARMING UP THE BAD IDEAS…</h2>
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="battle/season-01" element={<Battle />} />
            <Route path="launch" element={<Launch />} />
            <Route path="tokens" element={<Tokens />} />
            <Route path="explore" element={<Tokens />} />
            <Route path="tokens/:id" element={<TokenDetail />} />
            <Route path="activity" element={<Activity />} />
            <Route path="docs" element={<Docs />} />
            <Route
              path="*"
              element={
                <div className="page empty-state">
                  <span className="eyebrow">404 / LOST IN THE BIOMASS</span>
                  <h1>WRONG TUNNEL, HUMAN.</h1>
                  <Link className="button primary" to="/">
                    Back to the fight ↗
                  </Link>
                </div>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
