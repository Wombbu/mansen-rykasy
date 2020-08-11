import React from 'react';
import styled from 'styled-components';
import { Track } from './Track';

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
`

const StartButton = styled.button`
  color: white;
  padding: 32px;
  background: black;
  border: 8px solid white;
  cursor: pointer;
  height: 150px;
  font-size: 40px;
  font-family: 'Press Start 2P', cursive;
  align-self: center;
  &:active {
    border-color: grey;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PlayerInfoContainer = styled.div<{bg: string}>`
  flex: 1;
  background-color: ${p => p.bg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: black;
  margin: 24px;
`;

const PlayerInput = styled.input`
  font-size: 32px;
  font-family: 'Press Start 2P', cursive;
  background: transparent;
  text-align: center;
  padding: 16px;
  border: none;
  border-bottom: 4px solid black;
  max-width: 300px;
`;

function App() {
  return (
    <AppContainer>
      <Title> MANSEN RYKÄSY </Title>
        <Track p1Name="Pekka" p2Name="Jani"/>
      <BottomContainer>
        <PlayerInfoContainer bg="#01FFFF"><PlayerInput type="text" value="Pekka" /><h1>50 km/h</h1><h1>300 / 400m</h1><h1>40.54 s</h1></PlayerInfoContainer>
        <StartButton>Rykäse!</StartButton>
        <PlayerInfoContainer bg="#FD01FE"><PlayerInput type="text" value="Jani" /><h1>50 km/h</h1><h1>300 / 400m</h1><h1>40.54 s</h1></PlayerInfoContainer>
      </BottomContainer>
    </AppContainer>
  );
}

export default App;
