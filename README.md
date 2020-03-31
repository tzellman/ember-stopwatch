# ember-stopwatch

This addon provides some utilities and services that make it easier
to control timing in your Ember applications.

## Installation

```
ember install ember-stopwatch
```

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
