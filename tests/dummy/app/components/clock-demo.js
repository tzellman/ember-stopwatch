import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ClockDemoComponent extends Component {
    // each of these will get set to a snapshot (in millis) when the clock-tick triggers
    @tracked timeByTheSecond;
    @tracked timeByTheMinute;
    @tracked timeByTheHour;
    @tracked timeByTheDay;
}
