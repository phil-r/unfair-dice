interface State<T> {
  sides: T[];
  rolls: Record<string, number>;
  total: number;
}

interface Dice<T> {
  roll(): T;
  flip(): T;
  fairRoll(): T;
  fairFlip(): T;
  getState(): State<T>;
}

function _create<T>(state: State<T>): Dice<T> {
  function fairRoll(): T {
    const result = state.sides[Math.floor(Math.random() * state.sides.length)];
    state.rolls[String(result)]++;
    state.total++;
    return result;
  }

  function roll(): T {
    const decider = state.sides.reduce((acc, i) => {
      const share =
        (state.rolls[String(i)] + 1) / (state.total + state.sides.length);
      acc[String(i)] = Math.random() / share;
      return acc;
    }, {} as Record<string, number>);

    const result = state.sides.reduce((current, next) => {
      return decider[String(next)] > decider[String(current)] ? next : current;
    });

    // console.log('Decider:', decider, '\nResult:', result);

    state.rolls[String(result)]++;
    state.total++;
    return result;
  }

  function getState(): State<T> {
    return { ...state };
  }

  return {
    roll,
    flip: roll,
    fairRoll,
    fairFlip: fairRoll,
    getState,
  };
}

/**
 * Creates a dice that becomes increasingly unfair the more it's rolled,
 * favoring sides that have been rolled less frequently.
 * @param n - Number of sides (creates [0,1,...,n-1]) or array of side values
 * @returns A dice object with roll, flip, etc. methods
 */
function createDice<T = number>(n: number | T[]): Dice<T> {
  let sides: T[] = [];
  if (typeof n === "number") {
    if (n < 2) {
      throw new Error("Only numbers bigger than 1 are allowed");
    }
    sides = Array.from({ length: n }, (_, i) => i as T);
  } else if (Array.isArray(n)) {
    sides = [...n];
    if (sides.length === 0) {
      throw new Error("can't have dice with no sides");
    }
  } else {
    throw new TypeError("Only numbers and arrays are allowed");
  }

  const state: State<T> = {
    sides,
    rolls: sides.reduce((acc, x) => {
      acc[String(x)] = 0;
      return acc;
    }, {} as Record<string, number>),
    total: 0,
  };
  return _create(state);
}

/**
 * Recreates a dice from a saved state.
 * @param state - The state object from getState()
 * @returns A dice object restored to the given state
 */
function createFromState<T>(state: State<T>): Dice<T> {
  if (state.sides.length === 0) {
    throw new Error("can't have dice with no sides");
  }

  return _create({
    sides: [...state.sides],
    rolls: { ...state.rolls },
    total: state.total,
  });
}

/**
 * Creates a coin (2-sided dice) that becomes unfair over time.
 * @returns A coin object with flip, roll, etc. methods
 */
const createCoin = (): Dice<number> => createDice(2);

export { createCoin, createDice, createFromState };
export type { State, Dice };
