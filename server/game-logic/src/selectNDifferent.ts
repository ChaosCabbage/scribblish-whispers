import { randomInt } from "./randomInt";

export const selectNDifferent = <T>(n: number, list: readonly T[]): T[] => {
  const copy = [...list];
  const out: T[] = [];
  for (let i = 0; i < n; ++i) {
    const pick = i + randomInt(list.length - i);
    const val = copy[pick];
    out.push(val);
    copy[pick] = copy[i];
  }
  return out;
};
