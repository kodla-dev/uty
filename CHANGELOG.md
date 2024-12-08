# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- New `cls` function for combining class names.

  ```js
  cls('btn', { active: true, disabled: false }, ['extra', 'class']);
  //=> "btn active extra class"
  ```

  - Supports strings, numbers, arrays, and objects.
  - Filters out falsy values.

### Changed

- Enhance `supplant` function with flexible placeholder delimiters

  ```js
  supplant('{name} is learning {subject}', { name: 'Alice', subject: 'JavaScript' });
  //=> "Alice is learning JavaScript"
  ```

  ```js
  supplant('<name> loves <food.name>', ['<', '>'], { name: 'Bob', food: { name: 'pizza' } });
  //=> "Bob loves pizza"
  ```

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

[unreleased]: https://github.com/kodla-dev/uty/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kodla-dev/uty/releases/tag/v0.1.0
