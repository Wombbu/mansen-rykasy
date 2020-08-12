import * as React from "react";
import styled, { keyframes } from "styled-components";
import { PlayerState, gameState } from "./state";
import { useRecoilState } from "recoil";

const borderMove = keyframes`
    0% {
      background-position: 120px 0px;
    }
    100% {
      background-position: 0px 0px;
    }
`;
const carDrive = keyframes`
    0% {
      transform: translate(0px, 3px) scaleX(-1);
    }
    50% {
        transform: translate(0px, 3px) scaleX(-1);
    }
    51% {
        transform: translate(0px, 0px) scaleX(-1);
    }
    100% {
        transform: translate(0px, 0px) scaleX(-1);
    }
`;

const TrackContainer = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  position: relative;
`;

const Cyclist = styled.img<{ top: number; size: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  height: ${(p) => p.size}px;
  transition: left 0.5s;
`;

const Car = styled.img`
  position: absolute;
  left: 92%;
  top: 80px;
  height: 140px;
  transform: scaleX(-1);
  animation: ${carDrive} 0.1s infinite linear;
`;

const Pavement = styled.div`
  height: 48px;
  background-color: grey;
  border-bottom: 14px solid #686868;
`;

const Dashlane = styled.div`
  height: 5px;
  background: linear-gradient(90deg, white 50%, #383838 51%, #383838 100%);
  background-repeat: repeat-x;
  background-size: 120px 5px;
  animation: ${borderMove} 0.3s infinite linear;
`;

const RoadTop = styled.div`
  background-color: #383838;
  height: 88px;
  font-size: 36px;
  display: flex;
  align-items: center;
  padding-left: 36px;
  color: #01ffff;
`;

const RoadBottom = styled.div`
  background-color: #383838;
  height: 120px;
  font-size: 36px;
  display: flex;
  align-items: center;
  padding-left: 36px;
  color: #fd01fe;
`;

const SpeechBubble = styled.img`
  position: absolute;
  top: 10px;
  right: 5px;
  height: 80px;
`;

const speechBubbles = ["./puhe1.gif", "./puhe2.png", "./puhe3.gif"];

export const Track = ({
  p1State,
  p2State,
}: {
  p1State: PlayerState;
  p2State: PlayerState;
}) => {
  const [speechBubbleSrc, setSpeechBubbleSrc] = React.useState(
    speechBubbles[0]
  );

  const [game, setGame] = useRecoilState(gameState);

  React.useEffect(() => {
    setInterval(() => {
      setSpeechBubbleSrc(speechBubbles[Math.floor(Math.random() * 2.99)]);
    }, 5000);
  }, []);

  return (
    <TrackContainer>
      {game.state === "IDLE" && <SpeechBubble src={speechBubbleSrc} />}
      <Cyclist
        style={{
          left: `${Math.min(
            18 + (p1State.distance / game.totalDistance) * 72,
            90
          )}%`,
        }}
        top={35}
        size={90}
        src="./cyclist.gif"
      />
      <Car src="./car2.png" />
      <Cyclist
        style={{
          left: `${Math.min(
            18 + (p2State.distance / game.totalDistance) * 72,
            90
          )}%`,
        }}
        top={130}
        size={100}
        src="./cyclist.gif"
      />
      <Pavement />
      <RoadTop>{p1State.name}</RoadTop>
      <Dashlane />
      <RoadBottom>{p2State.name}</RoadBottom>
    </TrackContainer>
  );
};
