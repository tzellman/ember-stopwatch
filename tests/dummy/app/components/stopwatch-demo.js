import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class StopwatchDemoComponent extends Component {
    @service stopwatch;

    @action
    start() {
        this.stopwatch.start();
    }

    @action
    stop() {
        this.stopwatch.stop();
    }

    @action
    reset() {
        this.stopwatch.reset();
    }
}
