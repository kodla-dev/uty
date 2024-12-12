# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.2.1] - 2024-12-12

### Fixed

- Object handling in `cls` function

## [0.2.0] - 2024-12-09

### Added

- <details>
  <summary>New <code>validate</code> function lets you check texts for various things, like length, case, special characters, numbers, and words.</summary>

  ```js
  validate('HelloWorld123!', {
    minimum: 8,
    maximum: 15,
    lowercase: 2,
    uppercase: 2,
    special: 1,
    number: 2,
    require: ['Hello'],
    disable: ['World'],
  });
  //=> ['minimum', 'maximum', 'lowercase', 'uppercase', 'special', 'number', 'require', 'disable']
  ```

  ```js
  validate('Password123!', { minimum: 8, lowercase: 2, uppercase: 2, special: 2, number: 2 });
  //=> ['minimum', 'maximum', 'lowercase', 'number']
  ```

  </details>

- <details>
  <summary>New <code>isEmail</code> function to validate email addresses.</summary>

  ```js
  isEmail('example@domain.com'); //=> true
  ```

  - New email validation regex: `RGX_EMAIL`.

    ```js
    RGX_EMAIL.test('invalid-email'); //=> false
    ```

  </details>

- <details>
  <summary>New <code>cls</code> function for combining class names.</summary>

  ```js
  cls('btn', { active: true, disabled: false }, ['extra', 'class']);
  //=> "btn active extra class"
  ```

  - Supports strings, numbers, arrays, and objects.
  - Filters out falsy values.
  </details>

### Changed

- <details>
  <summary>Enhance <code>supplant</code> function with flexible placeholder delimiters</summary>

  ```js
  supplant('{name} is learning {subject}', { name: 'Alice', subject: 'JavaScript' });
  //=> "Alice is learning JavaScript"
  ```

  ```js
  supplant('<name> loves <food.name>', ['<', '>'], { name: 'Bob', food: { name: 'pizza' } });
  //=> "Bob loves pizza"
  ```

  </details>

### Fixed

- Check objects in `join` function argument
- Adjust `dot` function argument order and handling

## [0.1.0] - 2024-11-23

### Added

- Constants and regular expressions
- Type and value checking function
- Core mathematical utility functions
- Collection helpers for better array and object handling
- String manipulation utilities
- Helper functions (pipe, clone, and prom)
- Functions for converting collections to various data types
- Customizable event emitter with listener management functions

[unreleased]: https://github.com/kodla-dev/uty/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/kodla-dev/uty/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/kodla-dev/uty/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kodla-dev/uty/releases/tag/v0.1.0
