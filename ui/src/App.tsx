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
  gameOptions,
} from "./state";
import { PlayerInfo } from "./PlayerInfo";
import {
  AppContainer,
  Title,
  BottomContainer,
  StartButton,
} from "./App.styles";
import { Settings } from "./Settings";
import { MessageHandler, Ticks } from "./messageHandler";

const MAGNET_COUNT = 1;
const RACE_DISTANCE = 400;
const ROLLER_DIAMETER_METERS = 0.0787;
const TICKS_PER_METER = MAGNET_COUNT / (ROLLER_DIAMETER_METERS * Math.PI);

const SCROLLER_TEXT =
  "CREATED FOR 1v12v by LAURI & LEEVI - Enjoy the afterparty! - Greetings to: Leo - Joonas - tutam - sairaannopee - tahmatassu - :) - oulufixed - Lahti - Kokkola - Ylämäkivaihteettomat - Sponsored by: Pelago - Bike Polo Tampere - Red Lights - Pyöräkauppa Keskiö - Yksivaihde.net";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const calculateTicksPerMeter = (rollerDiameterMm: number) =>
  MAGNET_COUNT / ((rollerDiameterMm / 1000) * Math.PI);

const useGameLogic = () => {
  const [p1, setP1State] = useRecoilState(p1State);
  const [p2, setP2State] = useRecoilState(p2State);
  const [game, setGame] = useRecoilState(gameState);
  const interval = React.useRef<any>();
  const messageHandlerRef = React.useRef<{
    reset: () => void;
    start: () => void;
    getTicks: () => Ticks;
    setTickCountToFinish: (count: number) => void;
    connect: (url: string, port: number) => void;
  }>();

  React.useEffect(() => {
    messageHandlerRef.current = new MessageHandler();
  }, []);

  const startGame = React.useCallback(
    async (raceDistanceM: number, rollDiameterMm: number) => {
      setGame((it: GameState) => ({
        ...it,
        state: "PLAYING",
      }));

      // Reset just in case someone has ridden over race distance between races
      // otherwise we would prolly get finishingTime in the first payload
      messageHandlerRef.current?.reset();

      setGame((it) => ({ ...it, countdown: 3 }));
      await sleep(1000);
      setGame((it) => ({ ...it, countdown: 2 }));
      await sleep(1000);
      setGame((it) => ({ ...it, countdown: 1 }));
      await sleep(1000);
      setGame((it) => ({ ...it, countdown: null }));

      const ticksPerMeter = calculateTicksPerMeter(rollDiameterMm);

      messageHandlerRef?.current?.setTickCountToFinish(
        raceDistanceM * ticksPerMeter
      );

      messageHandlerRef?.current?.start();

      const startTime = Date.now();

      interval.current = setInterval(() => {
        const ticks: Ticks = messageHandlerRef.current?.getTicks() as any;
        setP1State((s) => ({
          ...s,
          distance: Math.min(
            ticks.p1TickCount / ticksPerMeter,
            raceDistanceM
          ),
          time:
            ticks.p1FinishingTime != null
              ? (ticks.p1FinishingTime - startTime) / 1000
              : (Date.now() - startTime) / 1000,
          finished: ticks.p1FinishingTime != null,
          speed: ticks.p1TicksPerHour / (ticksPerMeter * 1000),
        }));
        setP2State((s) => ({
          ...s,
          distance: Math.min(
            ticks.p2TickCount / ticksPerMeter,
            raceDistanceM
          ),
          time:
            ticks.p2FinishingTime != null
              ? (ticks.p2FinishingTime - startTime) / 1000
              : (Date.now() - startTime) / 1000,
          finished: ticks.p2FinishingTime != null,
          speed: ticks.p2TicksPerHour / (ticksPerMeter * 1000),
        }));
      }, 100);
    },
    [setP1State, setP2State, setGame]
  );

  const resetGame = React.useCallback(() => {
    messageHandlerRef.current?.reset();
    clearInterval(interval.current);
    setGame(initialGameState);
    setP1State(initialPlayerState("Raipe"));
    setP2State(initialPlayerState("Juti"));
  }, [setGame, setP1State, setP2State]);

  const connect = React.useCallback(
    (url: string, port: number) => {
      messageHandlerRef.current?.connect(url, port);
    },
    [messageHandlerRef]
  );

  return {
    p1,
    setP1State,
    p2,
    setP2State,
    startGame,
    resetGame,
    game,
    connect,
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
    connect,
  } = useGameLogic();

  const onChangeP1Name = (event: any) => {
    setP1State({ ...p1, name: event.target.value });
  };

  const onChangeP2Name = (event: any) => {
    setP2State({ ...p2, name: event.target.value });
  };

  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const [options] = useRecoilState(gameOptions);

  React.useEffect(() => {
    connect(options.serverAddress, Number(options.serverPort));
  }, [])

  return (
    <AppContainer>
      {settingsVisible && <Settings connect={connect} />}
      <Title onClick={() => setSettingsVisible((it) => !it)}>
        {game.countdown
          ? game.countdown
          : game.state === "IDLE"
          ? "MANSEN RYKÄSY"
          : "RYKII RYKII!"}
      </Title>
      {React.createElement("marquee", {
        children: SCROLLER_TEXT,
        style: { visibility: game.state === "IDLE" ? "visible" : "hidden" },
      })}
      <Track p1State={p1} p2State={p2} game={game} />
      <BottomContainer>
        <PlayerInfo
          pState={p1}
          onChangePlayerName={onChangeP1Name}
          bg="#01FFFF"
          winner={p1.finished && p1.time < p2.time}
          raceDistanceM={options.raceDistanceM}
        ></PlayerInfo>
        <StartButton
          disabled={game.countdown != null}
          onClick={() => {
            switch (game.state) {
              case "IDLE":
                startGame(
                  options.raceDistanceM,
                  Number(options.rollDiameterMm)
                );
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
          raceDistanceM={options.raceDistanceM}
        ></PlayerInfo>
      </BottomContainer>
    </AppContainer>
  );
};

export default App;
