# ember-stopwatch

This addon provides some utilities and services that make it easier
to control timing in your Ember applications.

## Compatibility

-   Ember.js v3.12 or above
-   Ember CLI v2.13 or above
-   Node.js v10 or above

## Installation

```
ember install ember-stopwatch
```

## Usage

### As a utility

This is the primary use-case, and allows you to create multiple stopwatches anywhere
in your application.

```
import Stopwatch from 'ember-stopwatch/utils/stopwatch';

let stopwatch = new Stopwatch();
stopwatch.start();
stopwatch.stop();
stopwatch.reset();
```

### As a Service

A `stopwatch` service can be used that is shared globally in your application.

```
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
    @action
    reset() {
        this.stopwatch.reset();
    }
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
