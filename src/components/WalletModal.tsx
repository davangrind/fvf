import { useEffect, useState } from "react";
import { ArrowUpRight, FlaskConical, Wallet } from "lucide-react";
import { useUI } from "../state";
import { Modal } from "./Modal";
interface Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?: (event: string, fn: (value: unknown) => void) => void;
  removeListener?: (event: string, fn: (value: unknown) => void) => void;
}
declare global {
  interface Window {
    ethereum?: Provider;
  }
}
export function WalletModal() {
  const ui = useUI();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const p = window.ethereum;
    if (!p || ui.wallet?.kind !== "browser") return;
    const disconnect = () => {
      ui.setWallet(null);
    };
    p.on?.("accountsChanged", disconnect);
    p.on?.("chainChanged", disconnect);
    return () => {
      p.removeListener?.("accountsChanged", disconnect);
      p.removeListener?.("chainChanged", disconnect);
    };
  }, [ui.wallet?.kind, ui.setWallet]);
  async function connect() {
    setError("");
    const provider = window.ethereum;
    if (!provider) {
      setError(
        "No browser wallet detected. Install an EVM wallet, or use the demo pilot below.",
      );
      return;
    }
    setBusy(true);
    try {
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      const chainId = (await provider.request({
        method: "eth_chainId",
      })) as string;
      if (!accounts[0]) throw new Error("No account selected.");
      ui.setWallet({ kind: "browser", label: accounts[0], chainId });
      ui.closeWallet();
      ui.toast("Wallet connected. Launches still run in demo mode.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Wallet connection was cancelled.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open={ui.walletOpen}
      onClose={ui.closeWallet}
      title={ui.wallet ? "Pilot connected" : "Identify yourself, human"}
    >
      {ui.wallet ? (
        <>
          <p className="wallet-address">{ui.wallet.label}</p>
          <p>
            {ui.wallet.kind === "demo"
              ? "Demo pilot · local session"
              : `Browser wallet · chain ${parseInt(ui.wallet.chainId ?? "0", 16)}`}
            <br />
            This arena uses simulated data.
          </p>
          <button
            className="button dark full"
            onClick={() => {
              ui.setWallet(null);
              ui.closeWallet();
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <p>
            No funds needed. Get a demo identity and recruit your first token.
          </p>
          <button
            className="wallet-option"
            disabled={busy}
            onClick={() => {
              ui.setWallet({ kind: "demo", label: "DEMO PILOT #0042" });
              ui.closeWallet();
              ui.toast("Demo pilot online. Questionable judgment confirmed.");
            }}
          >
            <FlaskConical />
            <span>
              <strong>Use demo pilot</strong>
              <small>No wallet. No signatures. Just chaos.</small>
            </span>
            <ArrowUpRight />
          </button>
          <button className="wallet-option" disabled={busy} onClick={connect}>
            <Wallet />
            <span>
              <strong>
                {busy ? "Waiting for wallet…" : "Connect browser wallet"}
              </strong>
              <small>Read your account. No transaction requested.</small>
            </span>
            <ArrowUpRight />
          </button>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <p className="micro muted">
            Connecting a real wallet does not enable onchain launches in this
            MVP.
          </p>
        </>
      )}
    </Modal>
  );
}
