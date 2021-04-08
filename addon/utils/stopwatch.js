import { tracked } from '@glimmer/tracking';
import Evented from './evented';

export const DEFAULT_TICK_MILLIS = 100;

/**
 * Supported subscription events are: tick, start, stop, reset
 */
export default class Stopwatch extends Evented {
    @tracked elapsedMillis = 0;
    @tracked systemElapsedMillis = 0;
    @tracked numTicks = 0;
    @tracked intervalId;

    constructor(tickMillis = DEFAULT_TICK_MILLIS) {
        super();
        this.tickMillis = Math.max(0, tickMillis || DEFAULT_TICK_MILLIS);
    }

    // use skipCheck in modifiers, to avoid "used previously in same computation" error
    start(skipCheck = false) {
        if (skipCheck || !this.isRunning) {
            this.startTime = Date.now();
            this.intervalId = setInterval(() => {
                this._tick();
            }, this.tickMillis);
            this.trigger('start', this);
        }
    }

    get isRunning() {
        return this.intervalId !== undefined;
    }

    get resolutionMillis() {
        return this.tickMillis;
    }

    reset(force = false) {
        if (this.isRunning && !force) {
            // mark we want to reset it on the next tick
            this.resetSentinel = true;
        } else {
            this._forceReset();
        }
    }

    stop(force = false) {
        if (this.isRunning && !force) {
            // stop on the next tick
            this.stopSentinel = true;
        } else {
            this._forceStop();
        }
    }

    get variance() {
        return this.systemElapsedMillis - this.elapsedMillis;
    }

    _tick() {
        this.elapsedMillis += this.tickMillis;
        this.systemElapsedMillis = Date.now() - this.startTime + (this.cachedSystemMillis || 0);
        this.numTicks += 1;
        this.trigger('tick', this);
        this._checkSentinels();
    }

    _checkSentinels() {
        if (this.stopSentinel || this.resetSentinel) {
            if (this.resetSentinel) {
                this._forceReset();
            } else {
                this._forceStop();
            }
        }
    }

    _forceStop() {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.cachedSystemMillis = this.systemElapsedMillis;
        this.stopSentinel = false;
        this.trigger('stop', this);
    }

    _forceReset() {
        this._forceStop();
        this.numTicks = 0;
        this.elapsedMillis = 0;
        this.systemElapsedMillis = 0;
        this.startTime = undefined;
        this.cachedSystemMillis = 0;
        this.resetSentinel = false;
        this.trigger('reset', this);
    }
}
