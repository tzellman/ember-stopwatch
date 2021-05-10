import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ClockDemoComponent extends Component {
    // each of these will get set to a snapshot (in millis) when the clock-tick triggers
    @tracked timeByTheSecond = new Date().getTime();
    @tracked timeByTheMinute = new Date().getTime();
    @tracked timeByTheHour = new Date().getTime();
    @tracked timeByTheDay = new Date().getTime();
}
