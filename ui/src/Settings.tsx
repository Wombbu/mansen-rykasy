import * as React from "react";
import { useRecoilState } from "recoil";
import { gameOptions } from "./state";

export const Settings = ({connect}: {  connect: (url: string, port: number) => void;
}) => {
  const [options, setOptions] = useRecoilState(gameOptions);

  return (
    <div>
      <label>Palvelimen osoite</label>
      <input
        type="text"
        value={options.serverAddress}
        onChange={(e: any) =>
          setOptions((it) => ({ ...it, serverAddress: e.target.value }))
        }
      />
      <label>Palvelimen portti</label>
      <input
        type="text"
        value={options.serverPort}
        onChange={(e: any) =>
          setOptions((it) => ({ ...it, serverPort: e.target.value }))
        }
      />
      <label>Rullan halkaisija (mm)</label>
      <input
        type="text"
        value={options.rollDiameterMm}
        onChange={(e: any) =>
          setOptions((it) => ({ ...it, rollDiameterMm: e.target.value }))
        }
      />
      <label>Kilpailun pituus (m)</label>
      <input
        type="number"
        value={options.raceDistanceM}
        onChange={(e: any) =>
          setOptions((it) => ({ ...it, raceDistanceM: e.target.value }))
        }
      />
      <button onClick={() => {
        connect(options.serverAddress, Number(options.serverPort));
      }}>Connect</button>
    </div>
  );
};
