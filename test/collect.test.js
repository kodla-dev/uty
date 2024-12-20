import { describe, expect, it } from 'vitest';
import {
  apply,
  chunk,
  diff,
  each,
  entries,
  every,
  filter,
  flat,
  has,
  implode,
  join,
  keyMap,
  keys,
  last,
  loop,
  map,
  merge,
  pluck,
  pop,
  prepend,
  push,
  reduce,
  remove,
  reverse,
  shift,
  slice,
  some,
  splice,
  split,
  take,
  takeUntil,
  value,
  values,
} from '../src/collect.js';
import { pipe } from '../src/index.js';

describe('apply', () => {
  it('apply:array:number', () => {
    const sum = (a, b) => a + b;
    const data = [5, 3];
    const appliedSum = apply(sum, data);
    expect(appliedSum).toBe(8);
    expect(data).toEqual([5, 3]);
  });

  it('apply:array:string', () => {
    const greet = (name, greeting) => `${greeting} ${name}!`;
    const appliedGreet = apply(greet, ['John', 'Hello']);
    expect(appliedGreet).toBe('Hello John!');
  });

  it('apply:promise:array', async () => {
    const sum = (a, b) => a + b;
    const appliedSum = await apply(sum, Promise.resolve([5, 3]));
    expect(appliedSum).toBe(8);
  });

  it('apply:create:array', async () => {
    const sum = (a, b) => a + b;
    const applied = apply(sum);
    const appliedSum1 = applied([5, 3]);
    expect(appliedSum1).toBe(8);
    const appliedSum2 = await applied(Promise.resolve([2, 2]));
    expect(appliedSum2).toBe(4);
  });

  it('apply:object:number', () => {
    const sum = (a, b) => a + b;
    const data = { grape: 3, apple: 5 };
    const appliedSum = apply(sum, data);
    expect(appliedSum).toBe(8);
    expect(data).toEqual({ grape: 3, apple: 5 });
  });

  it('apply:pipe', () => {
    const sum = (a, b) => a + b;
    // prettier-ignore
    const appliedSum = pipe(
      [5, 3],
      apply(sum)
    );
    expect(appliedSum).toBe(8);
  });

  it('apply:promise:pipe', async () => {
    const sum = (a, b) => a + b;
    // prettier-ignore
    const appliedSum = await pipe(
      Promise.resolve([5, 3]),
      apply(sum)
    );
    expect(appliedSum).toBe(8);
  });
});

describe('chunk', () => {
  it('chunk:array', () => {
    const chunks = chunk(4, [1, 2, 3, 4, 5, 6, 7]);
    const result = [
      [1, 2, 3, 4],
      [5, 6, 7],
    ];
    expect(chunks).toEqual(result);
  });

  it('chunk:object', () => {
    const chunks = chunk(2, { name: 'Albert', last: 'Einstein', age: '∞' });
    const result = [{ name: 'Albert', last: 'Einstein' }, { age: '∞' }];
    expect(chunks).toEqual(result);
  });

  it('chunk:promise', async () => {
    const chunks = await chunk(4, Promise.resolve([1, 2, 3, 4, 5, 6, 7]));
    const result = [
      [1, 2, 3, 4],
      [5, 6, 7],
    ];
    expect(chunks).toEqual(result);
  });

  it('chunk:create', async () => {
    const custom = chunk(2);
    const result1 = custom([1, 2, 3, 4, 5, 6, 7]);
    expect(result1).toEqual([[1, 2], [3, 4], [5, 6], [7]]);

    const result2 = custom({ name: 'Albert', last: 'Einstein', age: '∞' });
    expect(result2).toEqual([{ name: 'Albert', last: 'Einstein' }, { age: '∞' }]);
  });

  it('chunk:pipe', () => {
    const result = pipe([1, 2, 3, 4, 5, 6, 7], chunk(2));
    expect(result).toEqual([[1, 2], [3, 4], [5, 6], [7]]);
  });
});

describe('diff', () => {
  it('diff:array', () => {
    const data1 = [1, 2, 3, 4, 7];
    const data2 = [1, 2, 3, 4, 5, 6, 7];
    const result = [5, 6];
    expect(diff(data1, data2)).toEqual(result);
    expect(data1).toEqual([1, 2, 3, 4, 7]);
    expect(data2).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('diff:object', () => {
    const data1 = { name: 'Of Mice and Men' };
    const data2 = { name: 'Of Mice and Men', writer: 'John Steinbeck' };
    const result = { writer: 'John Steinbeck' };
    expect(diff(data1, data2)).toEqual(result);
    expect(data1).toEqual({ name: 'Of Mice and Men' });
    expect(data2).toEqual({ name: 'Of Mice and Men', writer: 'John Steinbeck' });
  });

  it('diff:object:notEqualKey', () => {
    const data1 = { name: 'Of Mice and Men', page: 325 };
    const data2 = {
      name: 'Of Mice and Men',
      writer: 'John Steinbeck',
      page: 612,
    };
    const result = { writer: 'John Steinbeck', page: 612 };
    expect(diff(data1, data2)).toEqual(result);
  });

  it('diff:promise', async () => {
    const data1 = Promise.resolve([1, 2, 3, 4, 7]);
    const data2 = Promise.resolve([1, 2, 3, 4, 5, 6, 7]);
    const result = [5, 6];
    expect(await diff(data1, data2)).toEqual(result);
  });

  it('diff:create', () => {
    const data1 = [1, 2, 3, 4, 7];
    const compare = diff(data1);

    const result = compare([1, 2, 3, 4, 5, 6, 7]);
    const result2 = compare([1, 2, 3, 4, 12, 15]);

    expect(result).toEqual([5, 6]);
    expect(result2).toEqual([12, 15]);
  });

  it('diff:pipe', () => {
    const result = pipe([1, 2, 3, 4, 5, 6, 7], diff([1, 2, 3, 4, 7]));
    expect(result).toEqual([5, 6]);
  });
});

describe('each', () => {
  it('each:array', () => {
    const data = [1, 2, 3, 4];
    each((item, index) => {
      expect(item).toEqual(data[index]);
    }, data);
  });

  it('each:object', () => {
    const data = { name: 'İbn', lastname: 'Sînâ' };
    each((key, value) => {
      expect(data[key]).toEqual(value);
    }, data);
  });

  it('each:promise', async () => {
    const data = Promise.resolve([1, 2]);
    await each(item => {
      if (item == 1) expect(item).toEqual(1);
      if (item == 2) expect(item).toEqual(2);
    }, data);
  });

  it('each:async:promise', async () => {
    const data = Promise.resolve([1, 2]);
    await each(async item => {
      if (item == 1) expect(item).toEqual(1);
      if (item == 2) expect(item).toEqual(2);
    }, data);
  });

  it('each:create', () => {
    let total = 0;
    const addTotal = each(item => (total += item));

    addTotal([1, 2]);
    expect(total).toEqual(3);

    addTotal([3, 4]);
    expect(total).toEqual(10);
  });

  it('each:pipe', () => {
    const data = [1, 2, 3, 4];
    // prettier-ignore
    pipe(
      data,
      each((item, index) => expect(item).toEqual(data[index]))
    );
  });
});

describe('entries', () => {
  it('entries:default', () => {
    const data = { a: 1, b: '2', c: true };
    const result = [
      ['a', 1],
      ['b', '2'],
      ['c', true],
    ];
    expect(entries(data)).toEqual(result);
    expect(data).toEqual({ a: 1, b: '2', c: true });
  });

  it('entries:promise', async () => {
    const data = Promise.resolve({ a: 1, b: '2', c: true });
    const result = [
      ['a', 1],
      ['b', '2'],
      ['c', true],
    ];
    expect(await entries(data)).toEqual(result);
  });

  it('entries:create', () => {
    const data = { a: 1, b: '2', c: true };
    const result = [
      ['a', 1],
      ['b', '2'],
      ['c', true],
    ];
    const entry = entries();
    expect(entry(data)).toEqual(result);
  });

  it('entries:pipe', () => {
    const data = { a: 1, b: '2', c: true };
    const result = [
      ['a', 1],
      ['b', '2'],
      ['c', true],
    ];
    expect(pipe(data, entries)).toEqual(result);
  });
});

describe('every', () => {
  it('every:array', () => {
    const data1 = [3, 4, 5, 6];
    const data2 = [1, 2, 3, 4];
    const fn = value => value > 2;
    expect(every(fn, data1)).toBe(true);
    expect(every(fn, data2)).toBe(false);
    expect(data1).toEqual([3, 4, 5, 6]);
    expect(data2).toEqual([1, 2, 3, 4]);
  });

  it('every:object', () => {
    const data = { grape: 5, pineapple: 10 };
    expect(every(value => value >= 5, data)).toBe(true);
    expect(every(value => value > 10, data)).toBe(false);
    expect(data).toEqual({ grape: 5, pineapple: 10 });
  });

  it('every:promise', async () => {
    // prettier-ignore
    expect(await every(value => value > 2, Promise.resolve([1, 2, 3, 4]))).toBe(false);
  });

  it('every:create', () => {
    const data1 = [1, 2, 3, 4];
    const data2 = [3, 4, 5, 6];
    const isGreaterThanTwo = every(value => value > 2);
    expect(isGreaterThanTwo(data1)).toBe(false);
    expect(isGreaterThanTwo(data2)).toBe(true);
  });

  it('every:pipe', () => {
    // prettier-ignore
    const result = pipe(
      [3, 4, 5, 6],
      every(value => value > 2)
    );
    expect(result).toBe(true);
  });
});

describe('filter', () => {
  it('filter:array', () => {
    const data = [1, 2, 3, 4];
    const result = filter(value => value > 2, data);
    expect(result).toEqual([3, 4]);
    expect(data).toEqual([1, 2, 3, 4]);
  });

  it('filter:promise', async () => {
    const result = await filter(value => value > 2, Promise.resolve([1, 2, 3, 4]));
    expect(result).toEqual([3, 4]);
  });

  it('filter:create', () => {
    const greaterThanTwo = filter(value => value > 2);
    const result = greaterThanTwo([1, 2, 3, 4]);
    expect(result).toEqual([3, 4]);
    const result2 = greaterThanTwo([1, 2, 3, 4, 5]);
    expect(result2).toEqual([3, 4, 5]);
  });

  it('filter:array:clear', () => {
    // prettier-ignore
    const result = filter([0, 1, 2, null, true, 3, 4, "", undefined,
    false, 5, 6, '', 7, [], 8, 9, {}, 10]);
    expect(result).toEqual([0, 1, 2, true, 3, 4, false, 5, 6, 7, 8, 9, 10]);
  });

  it('filter:object', () => {
    const data = {
      books: 194,
      users: 1458,
      collections: 500,
    };
    const result = filter(value => value < 1000, data);
    expect(result).toEqual({ books: 194, collections: 500 });
    expect(data).toEqual({
      books: 194,
      users: 1458,
      collections: 500,
    });
  });

  it('filter:object:clear', () => {
    const result = filter({
      books: 194,
      users: 1458,
      collections: 500,
      kits: null,
    });
    expect(result).toEqual({ books: 194, users: 1458, collections: 500 });
  });

  it('filter:pipe', () => {
    // prettier-ignore
    expect(pipe([0, 1, 2, null, true, 3, 4, "", undefined,
    false, 5, 6, '', 7, [], 8, 9, {}, 10], filter)).toEqual([0, 1, 2, true, 3, 4, false, 5, 6, 7, 8, 9, 10]);
  });
});

describe('flat', () => {
  it('flat:array', () => {
    const data = [0, 1, 2, [3, 4]];
    expect(flat(data)).toEqual([0, 1, 2, 3, 4]);

    const data2 = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(flat(data2)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const data3 = [0, 1, [2, [3, [4, 5]]]];
    expect(flat(data3)).toEqual([0, 1, 2, [3, [4, 5]]]);
    expect(flat(2, data3)).toEqual([0, 1, 2, 3, [4, 5]]);
    expect(flat(Infinity, data3)).toEqual([0, 1, 2, 3, 4, 5]);

    expect(data).toEqual([0, 1, 2, [3, 4]]);
  });

  it('flat:object', () => {
    const data = {
      day: 'monday',
      appointments: ['09:00', '10:00', '11:00'],
    };
    expect(flat(data)).toEqual(['monday', '09:00', '10:00', '11:00']);

    const data2 = {
      monday: [
        {
          name: 'Adriana Ellis',
          start: '09:00',
        },
      ],
      tuesday: [
        {
          name: 'Wilma Barrett',
          start: '10:00',
        },
      ],
    };

    expect(flat(data2)).toEqual([
      { name: 'Adriana Ellis', start: '09:00' },
      { name: 'Wilma Barrett', start: '10:00' },
    ]);

    expect(data).toEqual({
      day: 'monday',
      appointments: ['09:00', '10:00', '11:00'],
    });
  });

  it('flat:promise', async () => {
    const data = Promise.resolve([0, 1, 2, [3, 4]]);
    expect(await flat(data)).toEqual([0, 1, 2, 3, 4]);

    const data2 = Promise.resolve([0, 1, [2, [3, [4, 5]]]]);
    expect(await flat(Infinity, data2)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('flat:create', async () => {
    const data = Promise.resolve([0, 1, [2, [3, [4, 5]]]]);
    const flatten = flat(Infinity);
    const result = await flatten(data);
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('flat:pipe', () => {
    const data = [0, 1, 2, [3, 4]];
    expect(pipe(data, flat)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('implode', () => {
  it('implode:array', () => {
    expect(implode('-', [1, 2, 3, 4, 5])).toEqual('1-2-3-4-5');
  });
  it('implode:array', () => {
    expect(
      implode('product', ', ', [
        {
          product: 'ChromeOS',
          company: 'Google',
        },
        {
          product: 'ChatGPT',
          company: 'OpenAI',
        },
        {
          product: 'VS Code',
          company: 'Microsoft',
        },
      ])
    ).toEqual('ChromeOS, ChatGPT, VS Code');
  });
  it('implode:pipe', () => {
    expect(pipe([1, 2, 3], implode('-'))).toEqual('1-2-3');
  });
});

describe('join', () => {
  it('join:array', () => {
    expect(join(', ', ['a', 'b', 'c'])).toEqual('a, b, c');
  });
  it('join:array:final', () => {
    expect(join(', ', ', and ', ['a', 'b', 'c'])).toEqual('a, b, and c');
  });
  it('join:array:final:last', () => {
    expect(join(', ', ', and ', ['a'])).toEqual('a');
  });
  it('join:object', () => {
    expect(join(' ', { name: 'Marie', last: 'Curie' })).toEqual('Marie Curie');
  });
  it('join:pipe', () => {
    expect(pipe(['a', 'b', 'c'], join)).toEqual('a,b,c');
  });
});

describe('keyMap', () => {
  it('keyMap:object', () => {
    expect(
      keyMap([
        {
          name: 'John',
          roles: [
            {
              name: 'Editor',
            },
            {
              name: 'Admin',
            },
          ],
        },
      ])
    ).toEqual({
      0: { name: 'John', roles: [{ name: 'Editor' }, { name: 'Admin' }] },
      '0.name': 'John',
      '0.roles.0.name': 'Editor',
      '0.roles.0': { name: 'Editor' },
      '0.roles.1.name': 'Admin',
      '0.roles.1': { name: 'Admin' },
      '0.roles': [{ name: 'Editor' }, { name: 'Admin' }],
    });
  });
});

describe('has', () => {
  it('has:string', () => {
    expect(has('c', 'abcd')).toEqual(true);
    expect(has('e', 'abcd')).toEqual(false);
  });

  it('has:array', () => {
    expect(has(3, [1, 2, 3, 4])).toEqual(true);
    expect(has(5, [1, 2, 3, 4])).toEqual(false);
  });
  it('has:object', () => {
    expect(has('name', { name: 'Fârâbî' })).toEqual(true);
    expect(has('lastname', { name: 'Fârâbî' })).toEqual(false);
  });
});

describe('keys', () => {
  const data = {
    club: 'Liverpool',
    nickname: 'The Reds',
  };
  const promiseData = Promise.resolve(data);
  const result = ['club', 'nickname'];

  it('keys:object', () => {
    expect(keys(data)).toEqual(result);
    expect(data).toEqual({
      club: 'Liverpool',
      nickname: 'The Reds',
    });
  });

  it('keys:promise:object', async () => {
    expect(await keys(promiseData)).toEqual(result);
  });

  it('keys:create:promise:object', async () => {
    const getKeys = keys();
    expect(await getKeys(promiseData)).toEqual(result);
  });

  it('keys:pipe', () => {
    expect(pipe(data, keys)).toEqual(result);
  });
});

describe('last', () => {
  it('last:array', () => {
    const data = [1, 2, 3];
    expect(last(data)).toBe(3);
    expect(data).toEqual([1, 2, 3]);
  });

  it('last:fn:array', () => {
    expect(last(item => item < 2, [1, 2, 3])).toBe(1);
  });

  it('last:object', () => {
    const data = { name: 'İsmâil', last: 'Cezerî' };
    expect(last(data)).toBe('Cezerî');
    expect(data).toEqual({ name: 'İsmâil', last: 'Cezerî' });
  });

  it('last:fn:object', () => {
    expect(
      last(item => item < 300, {
        teachers: 30,
        books: 194,
        users: 1458,
        collections: 500,
      })
    ).toBe(194);
  });

  it('last:fn:promise', async () => {
    expect(await last(item => item < 2, Promise.resolve([1, 2, 3]))).toBe(1);
  });

  it('last:create', async () => {
    const data = Promise.resolve([1, 2, 3]);
    const lessThanTwoLast = last(item => item < 2);
    const result = await lessThanTwoLast(data);
    expect(result).toBe(1);
  });

  it('last:pipe', () => {
    expect(pipe([1, 2], last)).toBe(2);
  });
});

describe('loop', () => {
  it('loop:default', () => {
    const data = [1, 2, 3];
    let total = 0;
    loop(index => {
      total += data[index];
    }, data.length);
    expect(total).toEqual(6);
  });
});

describe('map', () => {
  it('map:array', () => {
    const data = [1, 2, 3, 4];
    const result = map(item => item + 10, data);
    expect(result).toEqual([11, 12, 13, 14]);
    expect(data).toEqual([1, 2, 3, 4]);
  });

  it('map:object', () => {
    const data = { apple: 5, pear: 10 };
    const result = map(item => item + 10, data);
    expect(result).toEqual({ apple: 15, pear: 20 });
    expect(data).toEqual({ apple: 5, pear: 10 });
  });

  it('map:promise', async () => {
    const data = Promise.resolve([1, 2, 3, 4]);
    const result = await map(item => item + 10, data);
    expect(result).toEqual([11, 12, 13, 14]);
  });

  it('map:create', () => {
    const data1 = [1, 2, 3, 4];
    const data2 = [5, 6, 7, 8];
    const add10 = map(item => item + 10);
    expect(add10(data1)).toEqual([11, 12, 13, 14]);
    expect(add10(data2)).toEqual([15, 16, 17, 18]);
  });

  it('map:pipe', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        map(item => item + 10)
      )
    ).toEqual([11, 12, 13, 14]);
  });
});

describe('merge', () => {
  it('merge:array', () => {
    const seed = ['apple', 'pear'];
    const collect = ['orange'];
    const merged = merge(seed, collect);
    expect(merged).toEqual(['orange', 'apple', 'pear']);
  });

  it('merge:object', () => {
    const seed = { name: 'Nikola', last: 'Tesla' };
    const collect = { age: 32 };
    const merged = merge(seed, collect);
    expect(merged).toEqual({ name: 'Nikola', last: 'Tesla', age: 32 });
  });

  it('merge:promise', async () => {
    // prettier-ignore
    expect(
      await merge(
        ['strawberry'],
        Promise.resolve(['blackberry'])
      )
    ).toEqual(
      ['blackberry', 'strawberry',]
    );

    // prettier-ignore
    expect(
      await merge(
        Promise.resolve(['strawberry']),
        ['blackberry']
      )
    ).toEqual(
      ['blackberry', 'strawberry',]
    );

    expect(await merge(Promise.resolve(['strawberry']), Promise.resolve(['blackberry']))).toEqual([
      'blackberry',
      'strawberry',
    ]);
  });

  it('merge:create', () => {
    const seed = ['orange'];
    const merged = merge(seed);
    const result = merged(['apple', 'pear']);
    expect(result).toEqual(['apple', 'pear', 'orange']);
  });

  it('merge:pipe', () => {
    expect(pipe(['apple', 'pear'], merge(['orange']))).toEqual(['apple', 'pear', 'orange']);
  });
});

describe('pluck', () => {
  it('pluck:object', () => {
    const result = pluck('name', { name: 'Sabuncuoğlu', last: 'Şerefeddin' });
    expect(result).toEqual(['Sabuncuoğlu']);
  });
  it('pluck:object:multiple', () => {
    const result = pluck('name', [
      { id: 78, name: 'Nikola' },
      { id: 79, name: 'Tesla' },
    ]);
    expect(result).toEqual(['Nikola', 'Tesla']);
  });
  it('pluck:object:multiple:key', () => {
    const result = pluck('name', 'subs.id', [
      { id: 78, subs: { id: 17 }, name: 'Thomas' },
      { id: 79, subs: { id: 18 }, name: 'Edison' },
    ]);
    expect(result).toEqual({ 17: 'Thomas', 18: 'Edison' });
  });
  it('pluck:object:index', () => {
    const result = pluck('roles.0.name', {
      name: 'John',
      roles: [{ name: 'Editor' }, { name: 'Admin' }],
    });
    expect(result).toEqual(['Editor']);
  });
  it('pluck:object:index:multiple', () => {
    const result = pluck('roles.0.name', [
      { id: 1, roles: [{ name: 'Editor' }, { name: 'Admin' }] },
      { id: 2, roles: [{ name: 'Super User' }, { name: 'Writer' }] },
    ]);
    expect(result).toEqual(['Editor', 'Super User']);
  });
  it('pluck:object:wildcard', () => {
    const result = pluck('roles.*.name', [
      { id: 1, roles: [{ name: 'Editor' }, { name: 'Admin' }] },
      { id: 2, roles: [{ name: 'Super User' }, { name: 'Writer' }] },
    ]);
    expect(result).toEqual([
      ['Editor', 'Admin'],
      ['Super User', 'Writer'],
    ]);
  });
  it('pluck:pipe', () => {
    expect(
      pipe(
        [
          { id: 1, roles: [{ name: 'Editor' }, { name: 'Admin' }] },
          { id: 2, roles: [{ name: 'Super User' }, { name: 'Writer' }] },
        ],
        pluck('roles.*.name')
      )
    ).toEqual([
      ['Editor', 'Admin'],
      ['Super User', 'Writer'],
    ]);
  });
});

describe('pop', () => {
  it('pop:array', () => {
    expect(pop([1, 2, 3, 4, 5])).toEqual(5);
  });

  it('pop:array:size', () => {
    expect(pop(2, [1, 2, 3, 4, 5])).toEqual([4, 5]);
  });

  it('pop:object', () => {
    expect(pop({ name: 'Ali', last: 'Kuşçu', birth: '1403' })).toEqual('1403');
  });

  it('pop:object:size', () => {
    expect(pop(2, { name: 'Ali', last: 'Kuşçu', birth: '1403' })).toEqual({
      last: 'Kuşçu',
      birth: '1403',
    });
  });

  it('pop:pipe', () => {
    expect(pipe([1, 2, 3, 4, 5], pop)).toEqual(5);
  });
});

describe('prepend', () => {
  it('prepend:array', () => {
    expect(prepend(0, [1, 2, 3, 4, 5])).toEqual([0, 1, 2, 3, 4, 5]);
  });
  it('prepend:array:multiple', () => {
    expect(prepend([0, 14], [1, 2, 3, 4, 5])).toEqual([0, 14, 1, 2, 3, 4, 5]);
  });
  it('prepend:object', () => {
    expect(
      prepend('brand', 'Google', {
        product: 'ChromeOS',
      })
    ).toEqual({ brand: 'Google', product: 'ChromeOS' });
  });
  it('prepend:string', () => {
    expect(prepend('?', 'category=1&book=5')).toEqual('?category=1&book=5');
  });
  it('prepend:pipe', () => {
    expect(pipe([1, 2, 3, 4, 5], prepend(0))).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

describe('push', () => {
  it('push:array', () => {
    const data = [1, 2, 3];
    push(4, data);
    expect(data).toEqual([1, 2, 3, 4]);
  });

  it('push:array:multiple', () => {
    const data = [1, 2, 3];
    push([4, 5], 1, data);
    expect(data).toEqual([1, 2, 3, 4, 5]);
  });

  it('push:object', () => {
    const data = { name: 'Aristoteles' };
    push('birth', '384 BC', data);
    expect(data).toEqual({ name: 'Aristoteles', birth: '384 BC' });
  });

  it('push:promise:array', async () => {
    const data = Promise.resolve([1, 2, 3]);
    const result = await push(4, data);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('push:promise:object', async () => {
    const data = Promise.resolve({ name: 'Aristoteles' });
    const result = await push('birth', '384 BC', data);
    expect(result).toEqual({ name: 'Aristoteles', birth: '384 BC' });
  });

  it('push:create', () => {
    const data = [1, 2, 3];
    const pushed = push(4);
    pushed(data);
    expect(data).toEqual([1, 2, 3, 4]);
  });
});

describe('reduce', () => {
  it('reduce:array', () => {
    const sum = (a, b) => a + b;
    const data = [1, 2, 3, 4];
    const result = reduce(sum, data);
    expect(result).toBe(10);
    expect(data).toEqual([1, 2, 3, 4]);
  });

  it('reduce:object', () => {
    const sum = (a, b) => a + b;
    const data = { wood: 150, stone: 50, gold: 10 };
    const result = reduce(sum, data);
    expect(result).toBe(210);
    expect(data).toEqual({ wood: 150, stone: 50, gold: 10 });
  });

  it('reduce:seed', () => {
    const sum = (a, b) => a + b;
    const data = [1, 2, 3, 4];
    const result = reduce(sum, 10, data);
    expect(result).toBe(20);
  });

  it('reduce:pipe', () => {
    const sum = (a, b) => a + b;
    // prettier-ignore
    const result = pipe(
      [1, 2, 3, 4],
      reduce(sum)
    );
    expect(result).toBe(10);
  });

  it('reduce:create', () => {
    const sum = (a, b) => a + b;
    const data = [1, 2, 3, 4];
    const total = reduce(sum);
    const result = total(data);
    expect(result).toBe(10);
  });
});

describe('remove', () => {
  it('remove:array', () => {
    expect(remove([0, 1], [1, 2, 3, 4])).toEqual([undefined, undefined, 3, 4]);
  });

  it('remove:object', () => {
    expect(
      remove('date', {
        name: 'Pîrî',
        last: 'Reis',
        date: 1553,
      })
    ).toEqual({ name: 'Pîrî', last: 'Reis' });
  });

  it('remove:object:array', () => {
    expect(
      remove(['subs', 'pages', 'roles'], {
        id: 78,
        subs: {
          id: 17,
        },
        name: 'Kevin',
        pages: {
          number: 176,
        },
        roles: [
          {
            name: 'Editor',
          },
          {
            name: 'Admin',
          },
        ],
      })
    ).toEqual({ id: 78, name: 'Kevin' });
  });
});

describe('reverse', () => {
  it('reverse:array', () => {
    const data = [1, 2, 3, 4, 5];
    expect(reverse(data)).toEqual([5, 4, 3, 2, 1]);
  });
});

describe('shift', () => {
  it('shift:array', () => {
    const data = [1, 2, 3, 4, 5];
    expect(shift(data)).toEqual(1);
    expect(data).toEqual([2, 3, 4, 5]);
  });

  it('shift:array:count', () => {
    const data = [1, 2, 3, 4, 5];
    expect(shift(2, data)).toEqual([1, 2]);
    expect(data).toEqual([3, 4, 5]);
  });
});

describe('slice', () => {
  it('slice:array:index', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = slice(4, data);
    expect(data).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result).toEqual([5, 6, 7, 8, 9, 10]);
  });

  it('slice:array:limit', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = slice([4, 2, 1], data);
    expect(data).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result).toEqual([5, 6]);
  });
});

describe('some', () => {
  it('some:array', () => {
    const result = some(3, [1, 2, 3]);
    expect(result).toBe(true);
  });

  it('some:array:fn', () => {
    const result = some(value => value > 5, [1, 2, 3, 4, 5]);
    expect(result).toBe(false);
  });

  it('some:object:key', () => {
    const result = some('name', { name: 'Aristokles', last: 'Platon' });
    expect(result).toBe(true);
  });

  it('some:object:value', () => {
    const result = some('Platon', { name: 'Aristokles', last: 'Platon' });
    expect(result).toBe(true);
  });

  it('some:object:key:value', () => {
    const result = some('name', 'Pisagor', {
      name: 'Theano',
      year: 570,
    });
    expect(result).toBe(false);
  });

  it('some:object:fn', () => {
    const result = some(item => item > 0, {
      books: 194,
      users: 1458,
      collections: 0,
    });
    expect(result).toBe(true);
    const result2 = some(item => item > 0, {
      books: 0,
      users: 0,
      collections: 0,
    });
    expect(result2).toBe(false);
  });

  it('some:promise:array', async () => {
    const result = await some(3, Promise.resolve([1, 2, 3]));
    expect(result).toBe(true);
  });

  it('some:promise:key', async () => {
    const result = await some(Promise.resolve(3), Promise.resolve([1, 2, 3]));
    expect(result).toBe(true);
  });

  it('some:promise:object', async () => {
    const result = await some(
      'name',
      'Pisagor',
      Promise.resolve({
        name: 'Theano',
        year: 570,
      })
    );
    expect(result).toBe(false);
  });

  it('some:promise:object:all', async () => {
    const result = await some(
      Promise.resolve('name'),
      Promise.resolve('Pisagor'),
      Promise.resolve({
        name: 'Theano',
        year: 570,
      })
    );
    expect(result).toBe(false);
  });
});

describe('splice', () => {
  it('splice:array:index', () => {
    const data = [1, 2, 3, 4, 5];
    const result = splice(2, data);
    expect(data).toEqual([1, 2]);
    expect(result).toEqual([3, 4, 5]);
  });

  it('splice:array:limit', () => {
    const data = [1, 2, 3, 4, 5];
    const result = splice([2, 1], data);
    expect(data).toEqual([1, 2, 4, 5]);
    expect(result).toEqual([3]);
  });

  it('splice:array:replace', () => {
    const data = [1, 2, 3, 4, 5];
    const result = splice([2, 1, [10, 11]], data);
    expect(data).toEqual([1, 2, 10, 11, 4, 5]);
    expect(result).toEqual([3]);
  });

  it('splice:promise', async () => {
    const data = Promise.resolve([1, 2, 3, 4, 5]);
    const result = await splice(2, data);
    expect(result).toEqual([3, 4, 5]);
  });

  it('splice:create', () => {
    const data = [1, 2, 3, 4, 5];
    const spliced = splice(2);
    const result = spliced(data);
    expect(data).toEqual([1, 2]);
    expect(result).toEqual([3, 4, 5]);
  });
});

describe('split', () => {
  it('split:string', () => {
    expect(split('&', 'id=1&book=5')).toEqual(['id=1', 'book=5']);
  });

  it('split:object', () => {
    expect(split(3, [1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe('take', () => {
  it('take:array:first', () => {
    expect(take(3, [1, 2, 3, 4, 5, 6, 7])).toEqual([1, 2, 3]);
  });
  it('take:array:last', () => {
    expect(take(-3, [1, 2, 3, 4, 5, 6, 7])).toEqual([5, 6, 7]);
  });
  it('take:object:first', () => {
    expect(take(1, { name: 'Isaac', last: 'Newton' })).toEqual({ name: 'Isaac' });
  });
  it('take:object:last', () => {
    expect(take(-1, { name: 'Isaac', last: 'Newton' })).toEqual({ last: 'Newton' });
  });
});

describe('takeUntil', () => {
  it('takeUntil:array', () => {
    expect(takeUntil(3, [1, 2, 3])).toEqual([1, 2]);
  });
  it('takeUntil:fn:array', () => {
    expect(takeUntil(item => item >= 3, [1, 2, 3])).toEqual([1, 2]);
  });
  it('takeUntil:fn:object', () => {
    expect(
      takeUntil(item => item >= 1000, {
        books: 194,
        users: 1458,
        collections: 500,
        kits: null,
      })
    ).toEqual({ books: 194 });
  });
});

describe('value', () => {
  it('value:array', () => {
    expect(value('type', [{ type: 'element' }, { type: 'text' }])).toEqual(['element', 'text']);
  });

  it('value:object:basic', () => {
    expect(value('name', { name: 'Cahit', last: 'Arf' })).toEqual('Cahit');
  });

  it('value:object:nested', () => {
    expect(
      value('roles.1.name', {
        name: 'Cahit',
        roles: [{ name: 'Editor' }, { name: 'Admin' }],
      })
    ).toEqual('Admin');
  });
});

describe('values', () => {
  const data = { name: 'Galileo', last: 'Galilei' };
  const promiseData = Promise.resolve(data);
  const result = ['Galileo', 'Galilei'];

  it('values:object', () => {
    expect(values(data)).toEqual(result);
    expect(data).toEqual({ name: 'Galileo', last: 'Galilei' });
  });

  it('values:promise:object', async () => {
    expect(await values(promiseData)).toEqual(result);
  });

  it('values:create:promise:object', async () => {
    const getValues = values();
    expect(await getValues(promiseData)).toEqual(result);
  });

  it('values:pipe', () => {
    expect(pipe(data, values)).toEqual(result);
  });
});
