import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Clock from '../utils/clock';

export default class ClockService extends Service {
    @tracked clock = new Clock();

    init() {
        super.init(...arguments);
        this.clock.start();
        this.clock.on('tick', this, this.updateTrackedDivisions);
        this.updateTrackedDivisions();
    }

    @tracked second;
    @tracked minute;
    @tracked hour;
    @tracked day;

    get time() {
        return this.clock.time;
    }

    get date() {
        return this.clock.date;
    }

    on(event, target, method) {
        return this.clock.on(event, target, method);
    }

    off(event, target, method) {
        return this.clock.off(event, target, method);
    }

    has(name) {
        return this.clock.has(name);
    }

    /**
     * The usage of `@tracked` and the guards in place are intentional
     * optomizations meant to prevent litening properties from recomputing.
     * I believe old version of Ember used to optimize for this and prevent
     * listeners from recomputing if the value was the same. This is useful
     * for guarding against excessive template helper calls as a clock is
     * always yielding new time values on every tick.
     */
    updateTrackedDivisions() {
        this.second = this.clock.second;

        if (this.minute !== this.clock.minute) {
            this.minute = this.clock.minute;
        }

        if (this.hour !== this.clock.hour) {
            this.hour = this.clock.hour;
        }

        if (this.day !== this.clock.day) {
            this.day = this.clock.day;
        }
    }

    willDestroy() {
        super.willDestroy(...arguments);
        this.clock.stop(true);
        this.clock.off('tick', this, this.updateTrackedDivisions);
    }
}
