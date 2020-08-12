import { atom } from "recoil";

export interface PlayerState {
  name: string;
  distance: number;
  time: number;
  speed: number;
  finished: boolean;
}

export const p1State = atom<PlayerState>({
  key: "p1State",
  default: {
    name: "Raipe",
    distance: 0,
    time: 0,
    speed: 0,
    finished: false,
  },
});

export const p2State = atom<PlayerState>({
  key: "p2State",
  default: {
    name: "Juti",
    distance: 0,
    time: 0,
    speed: 0,
    finished: false,
  },
});

export interface GameState {
  state: "PLAYING" | "IDLE" | "FALSE_START";
  totalDistance: number;
  countdown: number | null;
  serverAdress: string;
  serverPort: string;
  rollDiameter: number;
}

export const gameState = atom({
  key: "gameState",
  default: {
    state: "IDLE",
    totalDistance: 400,
    countdown: null,
  },
});
