import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ClockDemoComponent extends Component {
    @service clock;
    @tracked timeByTheMinute;
    @tracked timeByTheHour;
    @tracked timeByTheDay;

    @action
    registerListeners() {
        this.clock.on('minute', this, this.updateMinuteTime);
        this.clock.on('hour', this, this.updateHourTime);
        this.clock.on('day', this, this.updateDayTime);
    }

    @action
    unregisterListeners() {
        this.clock.off('minute', this, this.updateMinuteTime);
        this.clock.off('hour', this, this.updateHourTime);
        this.clock.off('day', this, this.updateDayTime);
    }

    updateMinuteTime() {
        this.timeByTheMinute = this.clock.time;
    }
    updateHourTime() {
        this.timeByTheHour = this.clock.time;
    }
    updateDayTime() {
        this.timeByTheDay = this.clock.time;
    }
}
