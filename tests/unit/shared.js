import { SECOND_RESOLUTION } from 'ember-stopwatch/utils/clock';

export class EventCounter {
    counts = {};
    handlers = {};

    constructor(evented, assert, ...events) {
        for (const event of events) {
            this.counts[event] = 0;
            const handler = this.onEvent.bind(this, event);
            this.handlers[event] = handler;
            evented.on(event, handler);
            assert.ok(evented.has(event), 'has listener');

            Object.defineProperty(this, `${event}Count`, {
                get() {
                    return this.counts[event];
                }
            });
        }
    }

    onEvent(type) {
        this.counts[type]++;
    }
}

export function assertStopwatchListeners(assert, stopwatchOrService, nativeTimer) {
    let listener = new EventCounter(stopwatchOrService, assert, 'tick', 'start', 'stop', 'reset');

    stopwatchOrService.start();
    nativeTimer.tick(300);
    assert.equal(listener.tickCount, 3, `should receive 3 events`);

    // remove listener
    stopwatchOrService.off('tick', listener.handlers['tick']);
    nativeTimer.tick(1000);
    assert.equal(listener.tickCount, 3, `should still only have received 3 events`);

    assert.equal(listener.startCount, 1, `should still only started once`);
    assert.equal(listener.stopCount, 0, `should have no stops`);
    assert.equal(listener.resetCount, 0, `should have no resets`);

    stopwatchOrService.stop(true);
    assert.equal(listener.stopCount, 1, `should have 1 stop`);
    stopwatchOrService.start();
    assert.equal(listener.startCount, 2, `should have 2 starts`);

    stopwatchOrService.reset(true);
    assert.equal(listener.resetCount, 1, `should have 1 stop`);
    assert.equal(listener.stopCount, 2, `should have 2 stops, since reset also stops`);
}

export function assertClockListeners(assert, clockOrService, nativeTimer) {
    let listener = new EventCounter(clockOrService, assert, 'second', 'minute', 'hour', 'day');
    if (clockOrService.start) {
        clockOrService.start();
    }
    assert.equal(listener.secondCount, 0, `no events yet`);

    nativeTimer.tick(SECOND_RESOLUTION);
    assert.equal(listener.secondCount, 1, `should have received second event`);
    assert.equal(listener.minuteCount, 0, `should not have received minute event`);

    // force a minute rollover
    nativeTimer.tick(SECOND_RESOLUTION * 59);
    assert.equal(listener.secondCount, 60, `should have received 60 second events`);
    assert.equal(listener.minuteCount, 1, `should have received minute event`);
    assert.equal(listener.hourCount, 0, `should not have received hour event`);

    // force an hour rollover
    nativeTimer.tick(SECOND_RESOLUTION * 60 * 59);
    assert.equal(listener.minuteCount, 60, `should have received 60 minute events`);
    assert.equal(listener.hourCount, 1, `should have received 1 hour event`);
    assert.equal(listener.dayCount, 0, `should not have received day event`);

    // force a day rollover
    nativeTimer.tick(SECOND_RESOLUTION * 60 * 60 * 23);
    assert.equal(listener.hourCount, 24, `should have received 24 hour events`);
    assert.equal(listener.dayCount, 1, `should have received 1 day event`);

    clockOrService.off('day', listener.handlers['day']);
    nativeTimer.tick(SECOND_RESOLUTION * 60 * 60 * 24);
    assert.equal(listener.dayCount, 1, `should have received 1 day event`);
}
