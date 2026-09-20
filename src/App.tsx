import { Component, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Blob } from "./components/Creatures";
import Home from "./pages/Home";
const Battle = lazy(() => import("./pages/Battle"));
const Arenas = lazy(() => import("./pages/Arenas"));
const Launch = lazy(() => import("./pages/Launch"));
const Tokens = lazy(() => import("./pages/Tokens"));
const TokenDetail = lazy(() => import("./pages/TokenDetail"));
const Numbers = lazy(() => import("./pages/Numbers"));
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
        <Blob />
        <h1>The lab had a moment</h1>
        <p>Your saved demo data is still in this browser.</p>
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
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="*"
            element={
              <Suspense
                fallback={
                  <div className="page empty-state">
                    <Blob />
                    <h2>Locating the brain cell</h2>
                  </div>
                }
              >
                <Routes>
                  <Route path="arena" element={<Arenas />} />
                  <Route path="arena/season-01" element={<Battle />} />
                  <Route
                    path="battle/season-01"
                    element={<Navigate to="/arena/season-01" replace />}
                  />
                  <Route path="launch" element={<Launch />} />
                  <Route path="tokens" element={<Tokens />} />
                  <Route
                    path="explore"
                    element={<Navigate to="/tokens" replace />}
                  />
                  <Route path="tokens/:id" element={<TokenDetail />} />
                  <Route path="numbers" element={<Numbers />} />
                  <Route
                    path="activity"
                    element={<Navigate to="/numbers#activity" replace />}
                  />
                  <Route path="docs" element={<Docs />} />
                  <Route
                    path="*"
                    element={
                      <div className="page empty-state">
                        <Blob variant={2} />
                        <span className="eyebrow">
                          404 / brain cell not found
                        </span>
                        <h1>That rabbit hole goes nowhere</h1>
                        <Link className="button primary" to="/">
                          Take me home
                        </Link>
                      </div>
                    }
                  />
                </Routes>
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
