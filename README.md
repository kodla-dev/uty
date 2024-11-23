<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kodla-dev/uty/refs/heads/main/.github/assets/logo-dark.svg">
    <img alt="uty logo" src="https://raw.githubusercontent.com/kodla-dev/uty/refs/heads/main/.github/assets/logo.svg" width="80"/>
  </picture>
</div>

<p align="center">
  <br/>
  This utility package provides helper functions for JavaScript tasks.
  <br/><br/>
</p>

<div align="center">

[![test](https://github.com/kodla-dev/uty/actions/workflows/test.yaml/badge.svg?branch=main)][TEST]
&nbsp;[![npm](https://img.shields.io/npm/v/uty.svg)][PACKAGE]
&nbsp;[![shaking](https://img.shields.io/badge/tree%20shakeable-blue?color=gray&logo=gumtree&logoColor=72ef36)][SIZE]

</div>

## Install

```shell
npm i uty
```

## Overview

### :small_blue_diamond: Collection Interactions

Helpers for working with arrays and objects, providing functions for data extraction and manipulation.

```js
import { pluck } from 'uty/collect';

pluck('name', 'detail.date', [
  { name: 'Albert', detail: { date: 1879 } },
  { name: 'Isaac', detail: { date: 1643 } },
]);

//=> {1879: 'Albert', 1643: 'Isaac'}
```

### :small_blue_diamond: Define Hub

A set of consistent values used throughout the application to maintain clarity and reduce redundancy.

```js
import { MAX_SAFE_INTEGER, RGX_WHITESPACE } from 'uty/define';

console.log(MAX_SAFE_INTEGER); //=> 9007199254740991
console.log(RGX_WHITESPACE); //=> /^\s*$/
```

### :small_blue_diamond: Event Listeners

A simple, customizable event system for handling and emitting events.

```js
import { event } from 'uty/event';

const bus = event();

bus.on('tick', number => {
  console.log(number);
});

bus.emit('tick', 1);
//=> 1
```

### :small_blue_diamond: Helpers

Commonly used utility functions that streamline coding patterns and reduce repetitive tasks.

```js
import { pipe } from 'uty';
import { divisible, add, sum } from 'uty/math';

const total = pipe(divisible(2), add(10), sum);

total([1, 2, 3, 4, 5]);
//=> 26

await total(Promise.resolve([6, 7, 8, 9, 10]));
//=> 54
```

### :small_blue_diamond: Type and Value Checks

Provides functions to assess variable types, compare values, and gather information about the system environment.

```js
import { isArrayLike, isEqual } from 'uty/is';

isArrayLike('fruits'); //=> true

isEqual([1, 2, 3], [1, 2, 3, 4]); //=> false
```

### :small_blue_diamond: Mathematical Operations

Efficient tools for a wide range of mathematical calculations designed to simplify number handling and analysis.

```js
import { avg } from 'uty/math';

avg('pages', [
  { name: 'Les Miserables', pages: 176 },
  { name: 'My Left Foot', pages: 1096 },
]);
//=> 636
```

### :small_blue_diamond: String Tools

Utility functions for easy and efficient string manipulation and formatting.

```js
import { ucfirst, ucwords } from 'uty/string';

ucfirst('uty is simple'); //=> Uty is simple
ucwords('uty is simple'); //=> Uty Is Simple
```

### :small_blue_diamond: Data Transformation

Converts data types and structures, making it easy to switch between arrays, objects, and other formats.

```js
import { toArray } from 'uty/to';

toArray({ first: 'Lionel', middle: 'Andrés', last: 'Messi' });
//=> ['Lionel', 'Andrés', 'Messi']
```

### :small_blue_diamond: Type Utilities

Advanced type-checking and utilities to ensure safe operations.

```ts
import type { Include } from 'uty/type';

function isArray<T>(value: T): value is Include<T, unknown[] | Readonly<unknown[]>> {
  return Array.isArray(value);
}
```

## Documentation

Visit our [documentation](DOCUMENTATION) for detailed guides and references.

---

<details>
<summary>Release Notes</summary>

All notable changes to this project will be documented in the [changelog][CHANGELOG].

</details>

<details>
<summary>License</summary>

[MIT][LICENSE]

</details>

[TEST]: https://github.com/kodla-dev/uty/actions/workflows/test.yaml
[PACKAGE]: https://www.npmjs.com/package/uty
[SIZE]: https://bundlephobia.com/package/uty
[LICENSE]: https://github.com/kodla-dev/uty/blob/main/LICENSE
[CHANGELOG]: https://github.com/kodla-dev/uty/blob/main/CHANGELOG.md
[DOCUMENTATION]: https://github.com/kodla-dev/uty/tree/main/documentation
