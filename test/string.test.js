import { describe, expect, it } from 'vitest';
import { lower, sub, upper, validate, words } from '../src/string.js';

describe('lower', () => {
  it('lower:text', () => {
    expect(lower('LOREM')).toEqual('lorem');
  });
});

describe('sub', () => {
  it('sub:text', () => {
    expect(sub('Lorem')).toEqual('orem');
  });

  it('sub:start', () => {
    expect(sub(0, 'Lorem')).toEqual('Lorem');
  });

  it('sub:end', () => {
    expect(sub(0, 1, 'Lorem')).toEqual('L');
  });
});

describe('upper', () => {
  it('upper:text', () => {
    expect(upper('lorem')).toEqual('LOREM');
  });
});

describe('validate', () => {
  it('validate:1', () => {
    expect(
      validate('HelloWorld123!', {
        minimum: 8,
        maximum: 15,
        lowercase: 2,
        uppercase: 2,
        special: 1,
        number: 2,
        require: ['Hello'],
        disable: ['World'],
      })
    ).toEqual([
      'minimum',
      'maximum',
      'lowercase',
      'uppercase',
      'special',
      'number',
      'require',
      'disable',
    ]);
  });

  it('validate:2', () => {
    expect(
      validate('Password123!', { minimum: 8, lowercase: 2, uppercase: 2, special: 2, number: 2 })
    ).toEqual(['minimum', 'maximum', 'lowercase', 'number']);
  });
});

describe('words', () => {
  it('words:true', () => {
    const result = words(true, 'Lorem ipsum\ndolor sit amet, consectetur adipiscing\telit.');
    const expected = [
      'Lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit',
    ];
    expect(result).toEqual(expected);
  });

  it('words:false', () => {
    const result = words('Lorem ipsum\ndolor sit amet, consectetur adipiscing\telit.');
    const expected = [
      'Lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet,',
      'consectetur',
      'adipiscing',
      'elit.',
    ];
    expect(result).toEqual(expected);
  });
});
