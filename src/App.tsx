import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { Track } from "./Track";
import {
  p1State,
  p2State,
  gameState,
  initialGameState,
  initialPlayerState,
  GameState,
} from "./state";
import { PlayerInfo } from "./PlayerInfo";
import {
  AppContainer,
  Title,
  BottomContainer,
  StartButton,
} from "./App.styles";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const useGameLogic = () => {
  const [p1, setP1State] = useRecoilState(p1State);
  const [p2, setP2State] = useRecoilState(p2State);
  const [game, setGame] = useRecoilState(gameState);
  const interval = React.useRef<any>();

  const startGame = React.useCallback(async () => {
    setGame((it: GameState) => ({
      ...it,
      state: "PLAYING",
    }));

    setGame(it => ({...it, countdown: 3}));
    await sleep(1000);
    setGame(it => ({...it, countdown: 2}));
    await sleep(1000);
    setGame(it => ({...it, countdown: 1}));
    await sleep(1000);
    setGame(it => ({...it, countdown: null}));

    const startTime = Date.now();

    interval.current = setInterval(() => {
      setP1State((s) => ({
        ...s,
        distance: Math.min(s.distance + 2, 400),
        time: s.finished ? s.time : (Date.now() - startTime) / 1000,
        finished: s.distance + 2 >= 400
      }));
      setP2State((s) => ({
        ...s,
        distance: Math.min(s.distance + 1.8, 400),
        time: s.finished ? s.time : (Date.now() - startTime) / 1000,
        finished: s.distance + 1.8 >= 400
      }));
    }, 100);
  }, [setP1State, setP2State, setGame]);

  const resetGame = React.useCallback(() => {
    clearInterval(interval.current);
    setGame(initialGameState);
    setP1State(initialPlayerState("Raipe"));
    setP2State(initialPlayerState("Juti"));
  }, [setGame, setP1State, setP2State]);

  return {
    p1,
    setP1State,
    p2,
    setP2State,
    startGame,
    resetGame,
    game,
  };
};

const App = () => {
  const {
    p1,
    p2,
    setP1State,
    setP2State,
    startGame,
    resetGame,
    game,
  } = useGameLogic();

  const onChangeP1Name = (event: any) => {
    setP1State({ ...p1, name: event.target.value });
  };

  const onChangeP2Name = (event: any) => {
    setP2State({ ...p2, name: event.target.value });
  };

  return (
    <AppContainer>
      <Title> {game.countdown ? game.countdown : game.state === 'IDLE' ? 'MANSEN RYKÄSY' : 'RYKII RYKII!'} </Title>
      <Track p1State={p1} p2State={p2} game={game} />
      <BottomContainer>
        <PlayerInfo
          pState={p1}
          onChangePlayerName={onChangeP1Name}
          bg="#01FFFF"
          winner={p1.finished && p1.time < p2.time}
        ></PlayerInfo>
        <StartButton
          onClick={() => {
            switch (game.state) {
              case "IDLE":
                startGame();
                break;
              case "PLAYING":
                resetGame();
                break;
              default:
                break;
            }
          }}
        >
          {game.state === "IDLE" ? "Rykäse!" : "Loppu ny!"}
        </StartButton>
        <PlayerInfo
          pState={p2}
          onChangePlayerName={onChangeP2Name}
          bg="#FD01FE"
          winner={p2.finished && p2.time < p1.time}
        ></PlayerInfo>
      </BottomContainer>
    </AppContainer>
  );
};

export default App;
