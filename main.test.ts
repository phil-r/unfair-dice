import { test, expect } from 'bun:test';
import { createDice, createCoin, createFromState } from './index.js';

test('Create coin', () => {
  const coin = createCoin();
  const state = coin.getState();
  expect(state.sides.length).toBe(2);
  expect([0, 1]).toContain(coin.flip());
  expect([0, 1]).toContain(coin.flip());
  expect([0, 1]).toContain(coin.flip());
  expect(coin.getState().total).toBe(3);
  expect(state.total).toBe(0); // copy of state should be returned
});

test('Create d6', () => {
  const d6 = createDice(6);
  const state = d6.getState();
  expect(state.sides.length).toBe(6);
  expect([0, 1, 2, 3, 4, 5]).toContain(d6.roll());
  expect([0, 1, 2, 3, 4, 5]).toContain(d6.roll());
  expect([0, 1, 2, 3, 4, 5]).toContain(d6.roll());
  expect([0, 1, 2, 3, 4, 5]).toContain(d6.roll());
  expect(d6.getState().total).toBe(4);
  expect(state.total).toBe(0); // copy of state should be returned
});

test('Create from state', () => {
  const rolls = 100000;
  const state = {
    sides: [0, 1],
    rolls: { '0': 1, '1': rolls },
    total: rolls
  };
  const coin = createFromState(state);
  expect(coin.flip()).toBe(0); // it's almost impossible for 1 to be rolled here
  expect(coin.getState().total).toBe(rolls + 1);
});
