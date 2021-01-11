import Stopwatch from './stopwatch';
import { tracked } from '@glimmer/tracking';

export const SECOND_RESOLUTION = 1000;

export default class Clock extends Stopwatch {
    @tracked date;

    constructor() {
        super(SECOND_RESOLUTION);
        this.on('tick', this, this._tickHandler);
        this.on('start', this, this._tickHandler);
    }

    get time() {
        return this.date ? this.date.getTime() : undefined;
    }

    get second() {
        return this.date ? this.date.getSeconds() : undefined;
    }

    get minute() {
        return this.date ? this.date.getMinutes() : undefined;
    }

    get hour() {
        return this.date ? this.date.getHours() : undefined;
    }

    get day() {
        return this.date ? this.date.getDate() : undefined;
    }

    start() {
        if (!this.date) {
            // start on a discrete tick
            this.date = new Date();

            setTimeout(() => {
                super.start();
            }, this.tickMillis - (Date.now() % this.tickMillis));
        }
    }

    _tickHandler() {
        const prevDate = this.date;
        this.date = new Date();

        this.trigger('second', this);
        if (prevDate.getMinutes() !== this.date.getMinutes()) {
            this.trigger('minute', this);
            if (prevDate.getHours() !== this.date.getHours()) {
                this.trigger('hour', this);
                if (prevDate.getDate() !== this.date.getDate()) {
                    this.trigger('day', this);
                }
            }
        }
    }
}
