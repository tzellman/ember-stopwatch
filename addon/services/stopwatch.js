import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Stopwatch from '../utils/stopwatch';

export default class StopwatchService extends Service {
    @tracked stopwatch = new Stopwatch();

    get isRunning() {
        return this.stopwatch.isRunning;
    }

    get elapsedMillis() {
        return this.stopwatch.elapsedMillis;
    }

    get systemElapsedMillis() {
        return this.stopwatch.systemElapsedMillis;
    }

    start() {
        this.stopwatch.start();
    }

    reset(force = false) {
        this.stopwatch.reset(force);
    }

    stop(force = false) {
        this.stopwatch.stop(force);
    }

    get variance() {
        return this.stopwatch.variance;
    }

    willDestroy() {
        super.willDestroy(...arguments);
        this.stop(true);
    }
}
