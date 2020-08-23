import * as React from "react";
import { useRecoilState } from "recoil";
import { gameOptions } from "./state";

export const Settings = () => {
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
      <label>Rullan halkaisija mm</label>
      <input
        type="text"
        value={options.rollDiameterMm}
        onChange={(e: any) =>
          setOptions((it) => ({ ...it, rollDiameterMm: e.target.value }))
        }
      />
    </div>
  );
};
