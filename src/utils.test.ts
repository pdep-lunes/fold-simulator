import * as R from "ramda";
import { reduceUntil } from "./utils";

const numbersList = [1, 2, 3, 4, 5];

test("renders learn react link", () => {
  const reduced = reduceUntil(
    numbersList,
    numbersList.length - 1,
    R.add,
    "foldl",
    0
  );
  expect(reduced).toBe(15);
});