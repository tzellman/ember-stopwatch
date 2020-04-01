import Stopwatch, { DEFAULT_TICK_MILLIS } from 'ember-stopwatch/utils/stopwatch';
import fakeTimers from '@sinonjs/fake-timers';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { assertStopwatchListeners } from '../shared';

module('Unit | Utility | stopwatch', function (hooks) {
    setupTest(hooks);

    hooks.beforeEach(function () {
        this.nativeTimer = fakeTimers.install({ now: 1585571174374 });
    });

    hooks.afterEach(function () {
        this.nativeTimer.uninstall();
    });

    test('can create with defaults', function (assert) {
        let stopwatch = new Stopwatch();
        assert.ok(stopwatch);
        assert.equal(stopwatch.tickMillis, DEFAULT_TICK_MILLIS);
    });

    test('can create with 0 and use default', function (assert) {
        let stopwatch = new Stopwatch(0);
        assert.ok(stopwatch);
        assert.equal(stopwatch.tickMillis, DEFAULT_TICK_MILLIS);
    });

    test('checks that elapsed time updates', function (assert) {
        let stopwatch = new Stopwatch(100);
        stopwatch.start();
        assert.ok(stopwatch.isRunning, `stopwatch should be running`);

        this.nativeTimer.tick(99);
        assert.equal(stopwatch.elapsedMillis, 0, `stopwatch tick has not been triggered yet`);
        assert.equal(stopwatch.numTicks, 0, `stopwatch tick has not been triggered yet`);

        this.nativeTimer.tick(1);
        assert.equal(stopwatch.elapsedMillis, 100, `stopwatch tick has been triggered once`);
        assert.equal(stopwatch.numTicks, 1, `stopwatch tick has been triggered once`);

        this.nativeTimer.tick(15);
        assert.equal(stopwatch.elapsedMillis, 100, `stopwatch tick still should only be triggered once`);
        assert.equal(stopwatch.numTicks, 1, `stopwatch tick has been triggered once`);

        this.nativeTimer.tick(85);
        assert.equal(stopwatch.elapsedMillis, 200, `stopwatch tick should only be triggered twice`);
        assert.equal(stopwatch.numTicks, 2, `stopwatch tick has been triggered twice`);
    });

    test('checks that scheduled stop works', function (assert) {
        let stopwatch = new Stopwatch(100);
        stopwatch.start();
        stopwatch.stop();
        assert.ok(stopwatch.isRunning, `stopwatch should still be running until next tick`);

        this.nativeTimer.tick(99);
        assert.ok(stopwatch.isRunning, `stopwatch should still be running`);

        this.nativeTimer.tick(1);
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);

        this.nativeTimer.tick(300);
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);

        assert.equal(stopwatch.elapsedMillis, 100, `stopwatch should still be at the first tick`);
    });

    test('checks that forced stop works', function (assert) {
        let stopwatch = new Stopwatch(100);
        stopwatch.start();
        stopwatch.stop(true);
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);

        this.nativeTimer.tick(300);
        assert.notOk(stopwatch.isRunning, `stopwatch should still not be running`);
        assert.equal(stopwatch.elapsedMillis, 0, `stopwatch should never have ticked`);
    });

    test('checks that scheduled reset works', function (assert) {
        let stopwatch = new Stopwatch(100);
        stopwatch.start();

        this.nativeTimer.tick(299);
        assert.equal(stopwatch.elapsedMillis, 200, `stopwatch should have ticked twice`);
        stopwatch.reset();
        assert.ok(stopwatch.isRunning, `stopwatch should still be running`);

        this.nativeTimer.tick(1);
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);
        assert.equal(stopwatch.elapsedMillis, 0, `stopwatch elapsed should be reset`);

        this.nativeTimer.tick(500);
        assert.notOk(stopwatch.isRunning, `stopwatch should still not be running`);
        assert.equal(stopwatch.elapsedMillis, 0, `stopwatch elapsed should still be 0`);
    });

    test('checks that forced reset works', function (assert) {
        let stopwatch = new Stopwatch(100);
        stopwatch.start();

        this.nativeTimer.tick(299);
        assert.equal(stopwatch.elapsedMillis, 200, `stopwatch should have ticked twice`);
        stopwatch.reset(true);
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);
        assert.equal(stopwatch.elapsedMillis, 0, `stopwatch elapsed should be reset`);

        this.nativeTimer.tick(500);
        assert.notOk(stopwatch.isRunning, `stopwatch should still not be running`);
        assert.equal(stopwatch.elapsedMillis, 0, `stopwatch elapsed should still be 0`);
    });

    test('checks multiple starts and stops', function (assert) {
        let stopwatch = new Stopwatch(100);
        stopwatch.start();
        stopwatch.stop();
        this.nativeTimer.tick(300);
        // first tick
        assert.equal(stopwatch.elapsedMillis, 100, `stopwatch should have only ticked once`);
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);

        stopwatch.stop();
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);
        this.nativeTimer.tick(300);
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);
        assert.equal(stopwatch.elapsedMillis, 100, `stopwatch should have only ticked once`);

        stopwatch.start();
        stopwatch.start();
        assert.ok(stopwatch.isRunning, `stopwatch should be running`);
        // tick 5 times
        this.nativeTimer.tick(499);
        stopwatch.stop();
        assert.ok(stopwatch.isRunning, `stopwatch should be running`);
        this.nativeTimer.tick(2000);
        assert.notOk(stopwatch.isRunning, `stopwatch should not be running`);
        assert.equal(stopwatch.elapsedMillis, 600, `stopwatch should have ticked 6 times`);
    });

    test('checks that event listeners receive events', function (assert) {
        let stopwatch = new Stopwatch(100);
        assertStopwatchListeners(assert, stopwatch, this.nativeTimer);
    });
});
