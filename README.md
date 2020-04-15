# (Un)fair dice

> Dice that protects you from time travelers!

## Description

Imagine a simple coin. Is it possible to always get heads? Yes! Well.. if you can time travel of course, just travel back and re-roll until you get heads(in computer gaming it's called [save scumming](https://www.urbandictionary.com/define.php?term=save%20scumming)), continue ad infinitum.

To solve this problem (un)fair dice was invented! It keeps track of every roll and adjusts outcomes based on previous rolls. Time traveller will die of old age trying to scam this!

## Usage

```js
const { createCoin } = require('unfair-dice');
const coin = createCoin(); // or createDice(2)
console.log(coin.flip()); // 0 or 1
```

or using array:

```js
const { createDice } = require('unfair-dice');
const coin = createDice(['heads', 'tails']);
console.log(coin.flip()); // heads or tails
```

or create a d6:

```js
const { createDice } = require('unfair-dice');
const d6 = createDice(6);
console.log(d6.roll()); // 0, 1, 2, 3, 4 or 5
```

## State

```js
const { createDice, createFromState } = require('unfair-dice');
const d6 = createDice(6);
d6.roll();
// ...
const saveState = d6.getState(); // save it somewhere as json, etc..
const d6Clone = createFromState(saveState); // recover it from state
```