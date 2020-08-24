import * as React from "react";
import styled, { keyframes, css } from "styled-components";
import { PlayerState } from "./state";

const blink = keyframes`
50% {
  opacity: 0;
}
`;

const PlayerInfoContainer = styled.div<{ bg: string }>`
  flex: 1;
  background-color: ${(p) => p.bg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: black;
  margin: 24px;
`;

const PlayerInput = styled.input`
  font-size: 32px;
  font-family: "Press Start 2P", cursive;
  background: transparent;
  text-align: center;
  padding: 16px;
  border: none;
  border-bottom: 4px solid black;
  max-width: 300px;
`;

const Time = styled.h1<{ blink: boolean }>`
  ${(p) =>
    p.blink
      ? css`
          animation: ${blink} 1s step-start infinite;
        `
      : ""}
`;

export const PlayerInfo = ({
  bg,
  onChangePlayerName,
  pState,
  winner,
  raceDistanceM,
}: {
  bg: string;
  onChangePlayerName: (event: any) => void;
  pState: PlayerState;
  winner: boolean;
  raceDistanceM: number;
}) => (
  <PlayerInfoContainer bg={bg}>
    <PlayerInput
      onChange={onChangePlayerName}
      maxLength={6}
      type="text"
      value={pState.name}
    />
    <h1>
      {pState.finished ? "AVG" : ""}{" "}
      {pState.finished
        ? ((raceDistanceM / pState.time) * 3.6).toFixed(1)
        : pState.speed.toFixed()}{" "}
      km/h
    </h1>
    <h1>
      {pState.distance.toFixed()} / {raceDistanceM}m
    </h1>
    <Time blink={winner}>{pState.time.toFixed(pState.finished ? 3 : 1)} s</Time>
  </PlayerInfoContainer>
);
