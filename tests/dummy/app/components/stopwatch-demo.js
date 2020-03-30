import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Stopwatch from 'ember-stopwatch/utils/stopwatch';
import { tracked } from '@glimmer/tracking';

export default class StopwatchDemoComponent extends Component {
    @service stopwatch;
    @tracked secondWatch = new Stopwatch(1000);
    @tracked fiveSecondWatch = new Stopwatch(5000);
    @tracked force = false;

    @action
    start(stopwatch) {
        stopwatch.start();
    }

    @action
    stop(stopwatch) {
        stopwatch.stop(this.force);
    }

    @action
    reset(stopwatch) {
        stopwatch.reset(this.force);
    }
}
