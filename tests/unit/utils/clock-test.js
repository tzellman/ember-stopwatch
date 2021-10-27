import Clock, { SECOND_RESOLUTION } from 'ember-stopwatch/utils/clock';
import fakeTimers from '@sinonjs/fake-timers';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { assertClockListeners, EventCounter } from '../shared';

// force starting on a second boundary
// 2020-04-02T09:13:14.000Z
const SYSTEM_START = 1585818794000;

module('Unit | Utility | clock', function (hooks) {
    setupTest(hooks);

    hooks.beforeEach(function () {
        this.nativeTimer = fakeTimers.install({ now: SYSTEM_START });
    });

    hooks.afterEach(function () {
        this.nativeTimer.uninstall();
    });

    test('can create with default resolution', function (assert) {
        assert.expect(2);
        let clock = new Clock();
        assert.ok(clock);
        assert.strictEqual(clock.tickMillis, SECOND_RESOLUTION);
    });

    test('time is initially set on start', function (assert) {
        assert.expect(2);
        let clock = new Clock();
        assert.strictEqual(clock.time, undefined, `time is undefined before start`);
        clock.start();
        assert.strictEqual(clock.time, SYSTEM_START, `clock should be initially set`);
    });

    test('multiple starts are ignored', function (assert) {
        assert.expect(2);
        let clock = new Clock();
        let listener = new EventCounter(clock, assert, 'start');
        clock.start();
        clock.start();
        this.nativeTimer.tick(SECOND_RESOLUTION);
        clock.start();
        this.nativeTimer.tick(SECOND_RESOLUTION);
        assert.strictEqual(listener.startCount, 1, `clock should ignore multiple starts`);
    });

    test('checks event triggers', function (assert) {
        assert.expect(16);
        let clock = new Clock();
        assertClockListeners(assert, clock, this.nativeTimer);
    });
});
