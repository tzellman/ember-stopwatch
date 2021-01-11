import Component from '@glimmer/component';
import { action } from '@ember/object';
import Timer from 'ember-stopwatch/utils/timer';
import { tracked } from 'tracked-built-ins';

export default class TimerDemoComponent extends Component {
    @tracked secondTimer = new Timer(1000);
    @tracked tenSecondTimer = new Timer(10000);
    @tracked minuteTimer = new Timer(60000);
    @tracked expirations = tracked([]);

    @action
    start(timer) {
        timer.start();
    }

    @action
    stop(timer) {
        timer.stop(true);
    }

    @action
    restart(timer) {
        timer.restart();
    }

    @action
    registerHandlers() {
        this.secondTimer.on('expired', this, this.expirationHandler);
        this.minuteTimer.on('expired', this, this.expirationHandler);
        this.tenSecondTimer.on('expired', this, this.expirationHandler);
    }

    expirationHandler() {
        this.expirations.push(new Date().toISOString());
    }
}
