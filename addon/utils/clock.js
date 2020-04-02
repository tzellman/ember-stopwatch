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
                if (prevDate.getDay() !== this.date.getDay()) {
                    this.trigger('day', this);
                }
            }
        }
    }
}
