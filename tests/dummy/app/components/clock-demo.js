import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class ClockDemoComponent extends Component {
    @service clock;

    @computed('clock.minute')
    get timeByTheMinute() {
        return new Date().getTime();
    }

    @computed('clock.hour')
    get timeByTheHour() {
        return new Date().getTime();
    }

    @computed('clock.day')
    get timeByTheDay() {
        return new Date().getTime();
    }
}
