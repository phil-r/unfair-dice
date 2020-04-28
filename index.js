function _create(state) {
  function fairRoll() {
    const result = state.sides[Math.floor(Math.random() * state.sides.length)];
    state.rolls[result]++;
    state.total++;
    return result;
  }

  function roll() {
    const decider = state.sides.reduce((acc, i) => {
      const share = (state.rolls[i] + 1) / (state.total + state.sides.length);
      acc[i] = Math.random() / share;
      return acc;
    }, {});

    const result = state.sides.reduce((current, next) => {
      return decider[next] > decider[current] ? next : current;
    });

    // console.log('Decider:', decider, '\nResult:', result);

    state.rolls[result]++;
    state.total++;
    return result;
  }

  function getState() {
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

function createDice(n) {
  let sides = [];
  if (typeof n === 'number') {
    if (n < 2) {
      throw Error('Only numbers bigger then 1 are allowed');
    }
    for (let i = 0; i < n; i++) {
      sides.push(i);
    }
  } else if (Array.isArray(n)) {
    sides = [...n];
  } else {
    throw TypeError('Only numbers and arrays are allowed');
  }

  const state = {
    sides,
    rolls: sides.reduce((acc, x) => {
      acc[x] = 0;
      return acc;
    }, {}),
    total: 0,
  };
  return _create(state);
}

function createFromState(state) {
  return _create({ ...state });
}

module.exports = {
  createCoin: () => createDice(2),
  createDice,
  createFromState,
};
