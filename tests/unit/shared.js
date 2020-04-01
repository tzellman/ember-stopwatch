export class StopwatchListener {
    tickCount = 0;
    startCount = 0;
    stopCount = 0;
    resetCount = 0;

    constructor(stopwatch, assert) {
        stopwatch.on('tick', this, this.onTick);
        stopwatch.on('start', this, this.onStart);
        // register w/o the optional this binding arg
        stopwatch.on('stop', this.onStop.bind(this));
        stopwatch.on('reset', this.onReset.bind(this));

        assert.ok(stopwatch.has('tick'), 'has listener');
        assert.ok(stopwatch.has('start'), 'has listener');
        assert.ok(stopwatch.has('stop'), 'has listener');
        assert.ok(stopwatch.has('reset'), 'has listener');
    }

    onTick() {
        this.tickCount++;
    }
    onStart() {
        this.startCount++;
    }
    onStop() {
        this.stopCount++;
    }
    onReset() {
        this.resetCount++;
    }
}

export function assertStopwatchListeners(assert, stopwatchOrService, nativeTimer) {
    let listener = new StopwatchListener(stopwatchOrService, assert);

    stopwatchOrService.start();
    nativeTimer.tick(300);
    assert.equal(listener.tickCount, 3, `should receive 3 events`);

    // remove listener
    stopwatchOrService.off('tick', listener, listener.onTick);
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
