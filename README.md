# ember-stopwatch

[![NPM][npm-badge-img]][npm-badge-link]
[![Build Status][build-status-img]][build-status-link]
[![Ember Observer Score][ember-observer-badge]][ember-observer-url]
[![Ember Version][ember-version]][ember-version-url]
[![Download count][npm-downloads-img]][npm-badge-link]
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
-   [Clock](#clock)

### Stopwatch

A `Stopwatch` is a utility that allows you to be notified when `ticks` occur,
making it easy for you to asynchronously take action on time-based boundaries.

The `Stopwatch` uses `@tracked` properties so your application
can react to changes in time, based on the tick interval.

The `stop` and `reset` methods allow you to either stop on the next tick interval,
or forcefully (i.e. immediately).

#### As an element modifier

The easiest and quickest way to start adding time utilities to your app is by using the 
`stopwatch-tick` modifier.

Your action handler will be passed the elapsed time and number of durations (ticks).

Note that the stopwatch will start as soon as your element is inserted and the modifier is 
instrumented.

```handlebars
    <div {{stopwatch-tick 1000 (fn (mut this.finishedLoading) true)}}>
        {{#if this.finishedLoading}}
            Waited 1 second, loaded!
        {{/if}}
    </div>
```

You can also provide a number of ticks as an optional named parameter.

```handlebars
    <div {{stopwatch-tick 1000 (fn (mut this.finishedLoading) true) ticks=10}}>
        {{#if this.finishedLoading}}
            Waited 10 seconds, loaded!
        {{/if}}
    </div>
```

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

A `Timer` is a utility that extends the `Stopwatch` behavior described above,
except that the use-case is to handle "countdown" eventing. This enables your
application to react to a `timeout` event.

Additionally, the `Timer` can be paused and restarted and contains reactful state
properties (e.g. `remainingMillis` and `isExpired`).

```javascript
import Timer from "ember-stopwatch/utils/timer";

// ...
let timer = new Timer(60000);
timer.on("expired", this, expirationHandler);
timer.start();
// ...

expirationHandler(){
    console.log('Time is up!');
}
```

```handlebars
    {{this.timer.remainingMillis}}
    {{this.timer.isExpired}}
```

### Clock

#### As an element modifier

The `clock-tick` modifier can be used to react to various time tick types, which includes `second`, 
`minute`, `hour`, and `day`.

Your action handler will be passed the current time (from the clock service), when triggered.

Note that the ticks will be triggered on clock time thresholds, not elapsed time / durations (e.g. 
when the actual clock rolls over to a new second, minute, hour, etc.).

```javascript
export default class extends Component {
    @tracked time
}
```

```handlebars
    <div {{clock-tick "second" (fn (mut this.time))}}>
        {{moment-format this.time}}
    </div>
```

#### As a utility

A `Clock` is a utility that tracks time ticks for the current system time.

A `Clock` triggers events on time ticks, including `second`, `minute`, `hour`, and `day`.
A `Clock` also provides reactful `time`, `date`, `second`, `minute`, `hour`, and `day` properties.

```javascript
import Clock from "ember-stopwatch/utils/clock";

// ...
let clock = new Clock();
clock.on("second", myHandler.bind(this, "second"));
clock.on("minute", myHandler.bind(this, "minute"));
clock.start();
// ...

myHandler(type) {
    console.log(`${type} ticked`);
}
```

```handlebars
    {{this.clock.time}}
```

#### As a Service

A `clock` service automatically creates and starts a single instance of the `Clock` utility and is a proxy for properties and methods of a clock instance.
A `clock` service also has `@tracked` versions of the clock properties `second`, `minute`, `hour`, and `day` that can be used by the `@computed` macro to react to.

```javascript
export default class extends Component {
    @service clock;
}
```

```handlebars
    {{moment-format this.clock.time}}
```

```javascript
export default class extends Component {
    @service clock;

    @computed("clock.minute")
    get timeByTheMinute() {
        return new Date().getTime();
    }

    @computed("clock.hour")
    get timeByTheHour() {
        return new Date().getTime();
    }

    @computed("clock.day")
    get timeByTheDay() {
        return new Date().getTime();
    }
}
```

```handlebars
    Refreshes every second: {{moment-format this.clock.time}}
    Refreshes every minute: {{moment-format this.timeByTheMinute}}
    Refreshes every hour: {{moment-format this.timeByTheHour}}
    Refreshes every day: {{moment-format this.timeByTheDay}}
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
[build-status-img]: https://github.com/tzellman/ember-stopwatch/workflows/Build/badge.svg?branch=master&event=push
[build-status-link]: https://github.com/tzellman/ember-stopwatch/actions?query=workflow%3A%22Build%22
[npm-downloads-img]: https://img.shields.io/npm/dt/ember-stopwatch.svg
[ember-observer-badge]: http://emberobserver.com/badges/ember-stopwatch.svg
[ember-observer-url]: http://emberobserver.com/addons/ember-stopwatch
[ember-version]: https://img.shields.io/badge/Ember-3.12%2B-brightgreen.svg
[ember-version-url]: https://blog.emberjs.com/2019/08/16/ember-3-12-released.html
[coverage-badge]: https://codeclimate.com/github/tzellman/ember-stopwatch/badges/coverage.svg
[coverage-badge-url]: https://codeclimate.com/github/tzellman/ember-stopwatch/test_coverage
[climate-badge]: https://codeclimate.com/github/tzellman/ember-stopwatch/badges/gpa.svg
[climate-badge-url]: https://codeclimate.com/github/tzellman/ember-stopwatch
