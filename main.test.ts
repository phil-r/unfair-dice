import { test, expect } from 'bun:test';
import { createDice, createCoin, createFromState } from './index';

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

// Note: this test is flaky, but it's a nature of this library
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

test('Create dice with array', () => {
  const coin = createDice(['heads', 'tails']);
  const state = coin.getState();
  expect(state.sides).toEqual(['heads', 'tails']);
  expect(['heads', 'tails']).toContain(coin.flip());
  expect(['heads', 'tails']).toContain(coin.flip());
  expect(coin.getState().total).toBe(2);
});

test('Error cases', () => {
  expect(() => createDice(1)).toThrow('Only numbers bigger than 1 are allowed');
  expect(() => createDice('invalid' as any)).toThrow('Only numbers and arrays are allowed');
  const empty = createDice([]);
  expect(() => empty.roll()).toThrow(); // Empty sides cause error in roll
});

test('Large dice', () => {
  const d100 = createDice(100);
  const state = d100.getState();
  expect(state.sides.length).toBe(100);
  const result = d100.roll();
  expect(result).toBeGreaterThanOrEqual(0);
  expect(result).toBeLessThan(100);
  expect(d100.getState().total).toBe(1);
});

// Note: this test is flaky, but it's a nature of this library
test('Create from state with strings', () => {
  const state = {
    sides: ['A', 'B', 'C'],
    rolls: { 'A': 100000, 'B': 0, 'C': 100000 },
    total: 200000
  };
  const dice = createFromState(state);
  expect(dice.roll()).toBe('B'); // B has lowest rolls, should be favored
  expect(dice.getState().total).toBe(200001);
});

test('createFromState should not mutate original state', () => {
  const originalState = {
    sides: [0, 1],
    rolls: { '0': 10, '1': 5 },
    total: 15
  };
  
  // Create first dice and roll it
  const dice1 = createFromState(originalState);
  dice1.roll(); // This mutates internal state
  
  // Create second dice from same original state
  const dice2 = createFromState(originalState);
  
  // Second dice should have original state, not mutated by first
  expect(dice2.getState()).toEqual(originalState);
  
  // Let's also check that the originalState object itself wasn't mutated
  expect(originalState.total).toBe(15);
  expect(originalState.rolls['0']).toBe(10);
  expect(originalState.rolls['1']).toBe(5);
});
