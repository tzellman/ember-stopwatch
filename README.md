# ember-stopwatch

[![NPM][npm-badge-img]][npm-badge-link]
[![Build Status][build-status-img]][build-status-link]
[![Ember Observer Score][ember-observer-badge]][ember-observer-url]
![Ember Version][ember-version]
![Download count][npm-downloads-img]
[![Code Climate][climate-badge]][climate-badge-url]
[![Test Coverage][coverage-badge]][coverage-badge-url]

This addon provides some utilities and services that make it easier
to control timing in your Ember applications.

## Installation

```
ember install ember-stopwatch
```

## Demo

[Demo](https://tzellman.github.io/ember-stopwatch/)

## Usage

-   [Stopwatch](#stopwatch)
-   [Timer](#timer)

### Stopwatch

#### As a utility

This is the primary use-case, and allows you to create multiple stopwatches anywhere
in your application.

```javascript
import Stopwatch from "ember-stopwatch/utils/stopwatch";

// ...
let stopwatch = new Stopwatch();
stopwatch.start();
stopwatch.stop();
stopwatch.reset();
stopwatch.on("tick", someHandler);
// ...
```

```handlebars
    {{this.stopwatch.elapsedMillis}}
    {{this.stopwatch.numTicks}}
```

#### As a Service

A `stopwatch` service can be used that is shared globally in your application.

```javascript
export default class extends Component {
    @service stopwatch;
    @action
    start() {
        this.stopwatch.start();
    }
    @action
    stop() {
        this.stopwatch.stop();
    }
}
```

### Timer

#### As a utility

This is the primary use-case, and allows you to create multiple stopwatches anywhere
in your application.

```javascript
import Timer from "ember-stopwatch/utils/stopwatch";

// ...
let timer = new Timer(60000);
timer.on("expired", someExpirationHandler);
timer.start();
// ...
```

```handlebars
    {{this.timer.remainingMillis}}
    {{this.timer.isExpired}}
```

## Compatibility

-   Ember.js v3.12 or above
-   Ember CLI v2.13 or above
-   Node.js v10 or above

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).

[npm-badge-img]: https://badge.fury.io/js/ember-stopwatch.svg
[npm-badge-link]: http://badge.fury.io/js/ember-stopwatch
[build-status-img]: https://travis-ci.org/tzellman/ember-stopwatch.svg?branch=master
[build-status-link]: https://travis-ci.org/tzellman/ember-stopwatch
[npm-downloads-img]: https://img.shields.io/npm/dt/ember-stopwatch.svg
[ember-observer-badge]: http://emberobserver.com/badges/ember-stopwatch.svg
[ember-observer-url]: http://emberobserver.com/addons/ember-stopwatch
[ember-version]: https://img.shields.io/badge/Ember-3.12%2B-brightgreen.svg
[coverage-badge]: https://codeclimate.com/github/tzellman/ember-stopwatch/badges/coverage.svg
[coverage-badge-url]: https://codeclimate.com/github/tzellman/ember-stopwatch/test_coverage
[climate-badge]: https://codeclimate.com/github/tzellman/ember-stopwatch/badges/gpa.svg
[climate-badge-url]: https://codeclimate.com/github/tzellman/ember-stopwatch
