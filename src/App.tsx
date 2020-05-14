import React from "react";
import "./styles/main.css";

import "./utils";
import {
  operaciones,
  reduceUntil,
  FoldVersion,
  ReductionLR,
  folds,
} from "./utils";

interface BoxesRowProps {
  values: number[];
  seed?: number;
  reduction: ReductionLR;
  foldVersion: FoldVersion;
}

interface BoxProps {
  i: number;
  label: string;
  onBoxClick: (box: number) => void;
  isSeed?: boolean;
}

function Box({ i, label, onBoxClick, isSeed }: BoxProps) {
  return (
    <div
      id={`box-${i}`}
      className={`z-10 bg-gray-600 text-gray-300 w-full mt-10 mb-10 pt-10 pb-10 pl-5 pr-5 ${
        isSeed ? "bg-red-600" : ""
      }`}
      style={{
        textAlign: "center",
        transformOrigin: "right",
        transition: "all 0.4s",
      }}
      onClick={(e) => {
        onBoxClick(i);
      }}
    >
      {label}
    </div>
  );
}

function Boxes({ values, seed, reduction, foldVersion }: BoxesRowProps) {
  const [lastFlipped, setLastFlipped] = React.useState<number | undefined>(-2);

  React.useEffect(() => {
    if (seed !== undefined) {
      setLastFlipped(-2);
      const seedElement = document.querySelector(`#box--1`);
      if (seedElement !== null) {
        seedElement.classList.remove("flipped");
        seedElement.classList.remove("opacity-0");
        seedElement.classList.remove("z-0");
        seedElement.classList.remove("hidden");
      }
    } else {
      setLastFlipped(-1);
    }
    values.forEach((value, i) => {
      const element = document.querySelector(`#box-${i}`);
      if (element !== null) {
        element.innerHTML = value.toString();
        element.classList.remove("flipped");
        element.classList.remove("opacity-0");
        element.classList.remove("bg-red-600");
        element.classList.remove("z-0");
        element.classList.remove("hidden");
      }
    });
  }, [values, seed, reduction, foldVersion]);

  const onBoxClick = (box: number) => {
    const boxElement = document.querySelector(`#box-${box}`);
    const nextBoxElement = document.querySelector(`#box-${box + 1}`);
    if (boxElement !== null && nextBoxElement !== null) {
      boxElement.classList.add("flipped");
      setLastFlipped(box);
      setTimeout(() => {
        boxElement.classList.add("opacity-0");
        boxElement.classList.add("z-0");
        if (foldVersion.startsWith("foldr")) {
          boxElement.classList.add("hidden");
        }
      }, 500);
      nextBoxElement.innerHTML = JSON.stringify(
        reduceUntil(values, box + 1, reduction.function, foldVersion, seed)
      );
      nextBoxElement.classList.add("bg-red-600");
    }
  };

  return (
    <div className="bg-white w-3/4 shadow-md rounded m-auto mt-10 mb-10 pt-10 pb-10 pl-5 pr-5">
      <div
        className={`flex divide-x ${
          foldVersion.startsWith("foldl") ? "justify-end" : "justify-end"
        }`}
      >
        {seed !== undefined ? (
          <Box label={seed.toString()} onBoxClick={onBoxClick} i={-1} isSeed />
        ) : null}
        {values.map((item, i) => (
          <Box
            key={i}
            label={item.toString()}
            onBoxClick={
              lastFlipped !== i - 1 || i === values.length - 1
                ? () => {}
                : onBoxClick
            }
            i={i}
          />
        ))}
      </div>
    </div>
  );
}

type AppState = {
  lista: number[];
  reduction?: number;
  seed?: number;
  foldVersion?: FoldVersion;
};

function App() {
  const [{ lista, reduction, seed, foldVersion }, setAppState] = React.useState<
    AppState
  >({ lista: [] as number[] });

  const onRadioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAppState((prev: AppState) => ({
      ...prev,
      foldVersion: value as FoldVersion,
    }));
  };

  const reset = () => {
    (document.querySelector("#form") as HTMLFormElement)?.reset();
    setAppState({ lista: [] });
  };

  React.useEffect(() => {
    if (!foldVersion?.endsWith("1")) {
      setAppState((prev) => ({
        ...prev,
        seed: undefined,
      }));
    }
  }, [foldVersion]);

  return (
    <div className="flex flex-col justify-center w-full h-full bg-gray-500 ">
      <form
        id="form"
        className="bg-white w-3/4 shadow-md rounded m-auto mt-10 mb-10 pt-10 pb-10 pl-5 pr-5"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="list"
          >
            Lista
          </label>
          <input
            id="list"
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            type="text"
            placeholder="[1, 2, 3, 4]"
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                if (parsed instanceof Array) {
                  setAppState((prev: AppState) => ({ ...prev, lista: parsed }));
                }
              } catch (e) {
                return;
              }
            }}
          />
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 text-sm font-bold mb-2">
            Fold
          </span>
          <div className="mt-2 flex flex-col">
            {folds.map((fold) => (
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="accountType"
                  value={fold}
                  checked={foldVersion === fold}
                  onChange={onRadioInputChange}
                />
                <span className="ml-2">{fold}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="reduction"
          >
            Operación
          </label>
          <div className="inline-block relative w-full">
            <div>
              <select
                id="reduction"
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => {
                  const index = parseInt(e.target.value);
                  setAppState((prev: AppState) => ({
                    ...prev,
                    reduction: index,
                  }));
                }}
                value={reduction}
              >
                <option>Una operación</option>
                {operaciones.map((op, index) => {
                  return <option value={index} label={op.label} key={index} />;
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {foldVersion !== undefined && !foldVersion?.endsWith("1") ? (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="seed"
            >
              Semilla
            </label>
            <input
              id="seed"
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              type="text"
              placeholder="0"
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setAppState((prev: AppState) => ({ ...prev, seed: parsed }));
                } catch (e) {
                  setAppState((prev: AppState) => ({ ...prev, seed: 0 }));
                  return;
                }
              }}
            />
          </div>
        ) : null}
        <div className="mb-4">
          <button
            className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </form>
      {reduction !== undefined &&
      (foldVersion?.endsWith("1") || seed !== undefined) &&
      foldVersion !== undefined ? (
        <Boxes
          values={lista}
          seed={seed}
          foldVersion={foldVersion}
          reduction={operaciones[reduction]}
        />
      ) : null}
    </div>
  );
}

export default App;
