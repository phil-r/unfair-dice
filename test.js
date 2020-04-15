const test = require('ava');
const { createDice, createCoin, createFromState } = require('./index');

test('Create coin', (t) => {
  const coin = createCoin();
  const state = coin.getState();
  t.is(state.sides.length, 2);
  t.true([0, 1].includes(coin.flip()));
  t.true([0, 1].includes(coin.flip()));
  t.true([0, 1].includes(coin.flip()));
  t.is(coin.getState().total, 3);
  t.is(state.total, 0); // copy of state should be returned
});

test('Create d6', (t) => {
  const d6 = createDice(6);
  const state = d6.getState();
  t.is(state.sides.length, 6);
  t.true([0, 1, 2, 3, 4, 5].includes(d6.roll()));
  t.true([0, 1, 2, 3, 4, 5].includes(d6.roll()));
  t.true([0, 1, 2, 3, 4, 5].includes(d6.roll()));
  t.true([0, 1, 2, 3, 4, 5].includes(d6.roll()));
  t.is(d6.getState().total, 4);
  t.is(state.total, 0); // copy of state should be returned
});


test.only('Create from state', (t) => {
  const rolls = 100000;
  const state = {
    sides: [ 0, 1 ],
    rolls: { '0': 1, '1': rolls },
    total: rolls
  }
  const coin = createFromState(state);
  t.is(coin.flip(), 0); // it's almost impossible for 1 to be rolled here
  t.is(coin.getState().total, rolls + 1);
});
