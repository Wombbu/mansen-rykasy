import React from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { Track } from "./Track";
import { p1State, p2State, PlayerState } from "./state";

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-around;
  color: white;
`;

const Title = styled.h1`
  padding-top: 16px;
  text-align: center;
  font-size: 64px;
`;

const StartButton = styled.button`
  color: white;
  padding: 32px;
  background: black;
  border: 8px solid white;
  cursor: pointer;
  height: 150px;
  font-size: 40px;
  font-family: "Press Start 2P", cursive;
  align-self: center;
  &:active {
    border-color: grey;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
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

const PlayerInfo = ({
  bg,
  onChangePlayerName,
  pState,
}: {
  bg: string;
  onChangePlayerName: (event: any) => void;
  pState: PlayerState;
}) => (
  <PlayerInfoContainer bg={bg}>
    <PlayerInput
      onChange={onChangePlayerName}
      maxLength={6}
      type="text"
      value={pState.name}
    />
    <h1>{pState.speed.toFixed()} km/h</h1>
    <h1>{pState.distance.toFixed()} / 400m</h1>
    <h1>{pState.time.toFixed(1)} s</h1>
  </PlayerInfoContainer>
);

/*
Säädettävät parametrit johonkin, eli:
- palvelimen osoite (nimi/ip)
- palvelimen portti
- ajettava matka (m)
- rullan halkaisija (mm)
*/

function App() {
  const [p1, setP1State] = useRecoilState(p1State);
  const [p2, setP2State] = useRecoilState(p2State);

  const onChangeP1Name = (event: any) => {
    setP1State({ ...p1, name: event.target.value });
  };

  const onChangeP2Name = (event: any) => {
    setP2State({ ...p2, name: event.target.value });
  };

  React.useEffect(() => {
    const startTime = Date.now();
    setInterval(() => {
      setP1State((s) => ({
        ...s,
        distance: Math.min(s.distance + 2, 400),
        time: (Date.now() - startTime) / 1000,
      }));
      setP2State((s) => ({
        ...s,
        distance: Math.min(s.distance + 1.8, 400),
        time: (Date.now() - startTime) / 1000,
      }));
    }, 200);
  }, [setP1State, setP2State]);

  return (
    <AppContainer>
      <Title> MANSEN RYKÄSY </Title>
      <Track p1State={p1} p2State={p2} />
      <BottomContainer>
        <PlayerInfo
          pState={p1}
          onChangePlayerName={onChangeP1Name}
          bg="#01FFFF"
        ></PlayerInfo>
        <StartButton>Rykäse!</StartButton>
        <PlayerInfo
          pState={p2}
          onChangePlayerName={onChangeP2Name}
          bg="#FD01FE"
        ></PlayerInfo>
      </BottomContainer>
    </AppContainer>
  );
}

export default App;
