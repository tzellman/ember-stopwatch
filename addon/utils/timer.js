import Stopwatch, { DEFAULT_TICK_MILLIS } from './stopwatch';

// for now, aliasing the stopwatch default millis
export const DEFAULT_RESOLUTION_MILLIS = DEFAULT_TICK_MILLIS;

/**
 * In addition to the events emitted by Stopwatch, the Timer also emits: expired, restart
 */
export default class Timer extends Stopwatch {
    constructor(expirationMillis, tickMillis = DEFAULT_RESOLUTION_MILLIS) {
        super(Math.min(expirationMillis, tickMillis));
        this.expirationMillis = expirationMillis;
        this.on('tick', this, this._expirationHandler);
    }

    start() {
        if (this.isExpired) {
            this.reset(true);
        }
        super.start();
    }

    restart() {
        this.reset(true);
        this.start();
        this.trigger('restart', this);
    }

    get remainingMillis() {
        return this.expirationMillis - this.elapsedMillis;
    }

    get isExpired() {
        return this.remainingMillis <= 0;
    }

    _expirationHandler() {
        if (this.isExpired) {
            this.stop(true);
            this.trigger('expired', this);
        }
    }
}
