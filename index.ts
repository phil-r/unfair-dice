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
      const share = (state.rolls[String(i)] + 1) / (state.total + state.sides.length);
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

function createDice<T = number>(n: number | T[]): Dice<T> {
  let sides: T[] = [];
  if (typeof n === 'number') {
    if (n < 2) {
      throw new Error('Only numbers bigger than 1 are allowed');
    }
    sides = Array.from({ length: n }, (_, i) => i) as T[];
  } else if (Array.isArray(n)) {
    sides = [...n];
  } else {
    throw new TypeError('Only numbers and arrays are allowed');
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

function createFromState<T>(state: State<T>): Dice<T> {
  return _create({ ...state });
}

const createCoin = (): Dice<number> => createDice(2);

export { createCoin, createDice, createFromState };
