import * as R from "ramda";

(window as any).R = R;

export type FoldVersion = "foldl" | "foldl1" | "foldr" | "foldr1";

export const folds = ["foldl", "foldl1"]; //, "foldr", "foldr1"];

export const foldl = R.reduce;
export const foldl1 = R.reduce;
export const foldr = <T, TResult>(
  fn: (acc: TResult, elem: T) => TResult,
  acc: TResult,
  list: readonly T[]
) => R.reduceRight<T, TResult>(R.uncurryN(2, R.flip(fn)), acc, list);
export const foldr1 = R.reduceRight;

type FoldR = <T, TResult>(elem: T, acc: TResult) => TResult;
type FoldL = <T, TResult>(acc: TResult, elem: T) => TResult;
type FoldLR = <T>(acc: T, elem: T) => T;

export type ReductionL = { label: string; function: FoldL };
export type ReductionR = { label: string; function: FoldR };
export type ReductionLR = { label: string; function: FoldLR };

export const operaciones: ReductionLR[] = [
  { label: "+ (suma)", function: R.add },
  { label: "* (producto)", function: R.multiply },
  { label: "max", function: R.max },
  { label: "min", function: R.min },
];

export const reduceUntil = <T>(
  list: T[],
  index: number,
  fn: FoldLR,
  foldVersion: FoldVersion,
  seed?: T
) => {
  if (foldVersion.endsWith("1")) {
    if (seed === undefined) {
      const seed = list[0];
      const listToFold = list.slice(1, index + 1);
      const foldFunciton = foldVersion === "foldl1" ? foldl1 : foldr1;
      return foldFunciton(fn, seed, listToFold);
    }
  } else {
    if (seed !== undefined) {
      const listToFold = list.slice(0, index + 1);
      const foldFunciton = foldVersion === "foldl" ? foldl : foldr;
      return foldFunciton(fn, seed, listToFold);
    }
  }
};
