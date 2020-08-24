import { atom } from "recoil";

export interface PlayerState {
  name: string;
  distance: number;
  time: number;
  speed: number;
  finished: boolean;
}

export const initialPlayerState = (name: string) => ({
  name,
  distance: 0,
  time: 0,
  speed: 0,
  finished: false,
});

export const p1State = atom<PlayerState>({
  key: "p1State",
  default: initialPlayerState("Raipe"),
});

export const p2State = atom<PlayerState>({
  key: "p2State",
  default: initialPlayerState("Juti"),
});

export interface GameState {
  state: "PLAYING" | "IDLE";
  countdown: number | null;
}

export const initialGameState: GameState = {
  state: "IDLE",
  countdown: null,
};

export const gameState = atom<GameState>({
  key: "gameState",
  default: initialGameState,
});

export interface GameOptions {
  totalDistance: number;
  serverAdress: string;
  serverPort: string;
  rollDiameterMm: number;
}

export const gameOptions = atom({
  key: "gameOptions",
  default: {
    serverAddress: "mansen.rykasy",
    serverPort: "9001",
    rollDiameterMm: "80",
    totalDistance: 400,
  },
});
