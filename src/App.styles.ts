import styled from "styled-components";

export const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-around;
  color: white;
`;

export const Title = styled.h1`
  padding-top: 16px;
  text-align: center;
  font-size: 64px;
  &:hover {
    cursor: pointer;
  }
`;

export const StartButton = styled.button`
  color: white;
  padding: 32px;
  background: black;
  border: 8px solid white;
  cursor: pointer;
  height: 150px;
  width: 440px;
  font-size: 40px;
  font-family: "Press Start 2P", cursive;
  align-self: center;
  &:active {
    border-color: grey;
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  align-items: center;
`;
