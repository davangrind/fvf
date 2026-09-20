import {
  Brain,
  Cpu,
  Bug,
  Crosshair,
  Radio,
  Disc3,
  Leaf,
  Printer,
  Pizza,
  MessagesSquare,
  FileText,
  Monitor,
} from "lucide-react";
import type { Faction } from "../domain/types";

export function FighterArtwork({
  faction,
  stage = 0,
}: {
  faction: Faction;
  stage?: number;
}) {
  return (
    <img
      className={`fighter-artwork artwork-${faction} artwork-stage-${stage}`}
      src={`/art/${faction}.webp`}
      alt=""
      loading="lazy"
    />
  );
}

const icons = [
  Brain,
  Cpu,
  Bug,
  Crosshair,
  Radio,
  Disc3,
  Leaf,
  Printer,
  Pizza,
  MessagesSquare,
  FileText,
  Monitor,
];
export function TopicIcon({ variant = 0 }: { variant?: number }) {
  const Icon = icons[((variant % icons.length) + icons.length) % icons.length];
  return <Icon className="topic-icon" strokeWidth={1.5} aria-hidden="true" />;
}

export function TokenSymbol({ ticker }: { ticker: string }) {
  const identities: Record<string, number> = {
    BRAIN: 0,
    BSOD: 1,
    BUZZ: 2,
    CLANK: 1,
    COOK: 5,
    SKILL: 3,
    TOXIC: 4,
    CTRL: 11,
    LARVA: 2,
    RAM: 1,
    SWARM: 2,
    HALO: 5,
  };
  return (
    <TopicIcon
      variant={
        identities[ticker] ??
        [...ticker].reduce((n, c) => n + c.charCodeAt(0), 0)
      }
    />
  );
}

export function tokenArtwork(image: string, faction: Faction) {
  return image.endsWith("-avatar.svg") ? `/art/${faction}.webp` : image;
}

export function contenderIcon(eventId: string, index: number) {
  const variants: Record<string, number[]> = {
    "touch-grass": [11, 6],
    "last-braincell": [11, 9, 10],
    council: [9, 4, 9, 1],
    printer: [7, 10],
    fridge: [5, 8, 6],
  };
  return variants[eventId]?.[index] ?? index;
}
