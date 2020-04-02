import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Clock from '../utils/clock';

export default class ClockService extends Service {
    @tracked clock = new Clock();

    init() {
        super.init(...arguments);
        this.clock.start();
    }

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

    willDestroy() {
        super.willDestroy(...arguments);
        this.clock.stop(true);
    }
}
