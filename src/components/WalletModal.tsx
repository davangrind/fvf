import { useEffect, useState } from "react";
import { ArrowUpRight, UserRound, Wallet } from "lucide-react";
import { useUI } from "../state";
import { Modal } from "./Modal";
interface SolanaProvider {
  isPhantom?: boolean;
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  on?: (event: string, fn: (value: unknown) => void) => void;
  removeListener?: (event: string, fn: (value: unknown) => void) => void;
}
declare global {
  interface Window {
    phantom?: { solana?: SolanaProvider };
    solana?: SolanaProvider;
  }
}
const provider = () =>
  window.phantom?.solana ??
  (window.solana?.isPhantom ? window.solana : undefined);
export function WalletModal() {
  const ui = useUI();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const p = provider();
    if (!p || ui.wallet?.kind !== "browser") return;
    const disconnect = () => ui.setWallet(null);
    p.on?.("accountChanged", disconnect);
    p.on?.("disconnect", disconnect);
    return () => {
      p.removeListener?.("accountChanged", disconnect);
      p.removeListener?.("disconnect", disconnect);
    };
  }, [ui.wallet?.kind, ui.setWallet]);
  async function connect() {
    setError("");
    const p = provider();
    if (!p) {
      setError(
        "Phantom was not detected. Open FVF in Phantom or install the browser extension.",
      );
      return;
    }
    setBusy(true);
    try {
      const { publicKey } = await p.connect();
      if (!publicKey) throw new Error("No Solana account selected.");
      ui.setWallet({
        kind: "browser",
        label: publicKey.toString(),
        network: "solana",
      });
      ui.closeWallet();
      ui.toast("Solana wallet connected");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Wallet connection was cancelled.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function disconnect() {
    try {
      if (ui.wallet?.kind === "browser") await provider()?.disconnect();
    } catch {
      /* Clear the local session even when the extension is unavailable. */
    }
    ui.setWallet(null);
    ui.closeWallet();
  }
  return (
    <Modal
      open={ui.walletOpen}
      onClose={ui.closeWallet}
      title={ui.wallet ? "You're in" : "Connect to the chaos"}
    >
      {ui.wallet ? (
        <>
          <p className="wallet-address">{ui.wallet.label}</p>
          <p>
            {ui.wallet.kind === "demo" ? "Guest session" : "Phantom / Solana"}
          </p>
          <button
            className="button dark full"
            onClick={() => void disconnect()}
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <p>Your wallet. Your tokens. Your questionable allegiance.</p>
          <button
            className="wallet-option"
            disabled={busy}
            onClick={() => void connect()}
          >
            <Wallet />
            <span>
              <strong>
                {busy ? "Waiting for wallet..." : "Connect Phantom"}
              </strong>
              <small>Solana wallet / account connection only</small>
            </span>
            <ArrowUpRight />
          </button>
          <button
            className="wallet-option"
            disabled={busy}
            onClick={() => {
              ui.setWallet({ kind: "demo", label: "GUEST #0042" });
              ui.closeWallet();
              ui.toast("Guest session ready");
            }}
          >
            <UserRound />
            <span>
              <strong>Continue as guest</strong>
              <small>Explore arenas and prepare a token draft</small>
            </span>
            <ArrowUpRight />
          </button>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <p className="micro muted">
            Connecting does not request a signature or move funds.{" "}
            <a
              href="https://phantom.com/download"
              target="_blank"
              rel="noreferrer"
            >
              Get Phantom
            </a>
          </p>
        </>
      )}
    </Modal>
  );
}
