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

    get numTicks() {
        return this.stopwatch.numTicks;
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

    on(event, target, method) {
        return this.stopwatch.on(event, target, method);
    }

    off(event, target, method) {
        return this.stopwatch.off(event, target, method);
    }

    has(name) {
        return this.stopwatch.has(name);
    }

    get variance() {
        return this.stopwatch.variance;
    }

    willDestroy() {
        super.willDestroy(...arguments);
        this.stop(true);
    }
}
