import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { demoAdapter } from "./data/demo-adapter";
export interface WalletSession {
  kind: "demo" | "browser";
  label: string;
  chainId?: string;
}
interface UIState {
  wallet: WalletSession | null;
  setWallet: (w: WalletSession | null) => void;
  walletOpen: boolean;
  openWallet: () => void;
  closeWallet: () => void;
  sound: boolean;
  toggleSound: () => void;
  toast: (message: string) => void;
}
const Context = createContext<UIState | null>(null);
let audioContext: AudioContext | null = null;
export function bleep(enabled: boolean, frequency = 520) {
  if (!enabled) return;
  try {
    audioContext ??= new AudioContext();
    void audioContext.resume();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "square";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.12,
    );
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.12);
  } catch {
    /* Audio is optional. */
  }
}
export function StateProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletSession | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [message, setMessage] = useState("");
  const snapshot = useSyncExternalStore(
    demoAdapter.subscribe,
    demoAdapter.getSnapshot,
  );
  const lastEvent = useRef(snapshot.events[0]?.id);
  useEffect(() => {
    const event = snapshot.events[0];
    if (!event || event.id === lastEvent.current) return;
    lastEvent.current = event.id;
    if (event.kind === "evolution" || event.kind === "lead") {
      setMessage(event.text);
      bleep(sound, event.kind === "evolution" ? 880 : 330);
    }
  }, [snapshot.events, sound]);
  useEffect(() => {
    demoAdapter.start();
    return () => demoAdapter.stop();
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [message]);
  return (
    <Context.Provider
      value={{
        wallet,
        setWallet,
        walletOpen,
        openWallet: () => setWalletOpen(true),
        closeWallet: () => setWalletOpen(false),
        sound,
        toggleSound: () => {
          bleep(!sound);
          setSound(!sound);
        },
        toast: setMessage,
      }}
    >
      {children}
      <div className={`toast ${message ? "show" : ""}`} role="status">
        ✦ {message}
      </div>
    </Context.Provider>
  );
}
export const useUI = () => {
  const context = useContext(Context);
  if (!context) throw new Error("Missing StateProvider");
  return context;
};
export const useBattle = () =>
  useSyncExternalStore(demoAdapter.subscribe, demoAdapter.getSnapshot);
