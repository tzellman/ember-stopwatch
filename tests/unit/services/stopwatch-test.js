import { DEFAULT_TICK_MILLIS } from 'ember-stopwatch/utils/stopwatch';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import fakeTimers from '@sinonjs/fake-timers';
import { assertStopwatchListeners } from '../shared';

module('Unit | Service | stopwatch', function (hooks) {
    setupTest(hooks);

    hooks.beforeEach(function () {
        this.nativeTimer = fakeTimers.install({ now: 1585571174374 });
    });

    hooks.afterEach(function () {
        this.nativeTimer.uninstall();
    });

    test('it exists', function (assert) {
        const service = this.owner.lookup('service:stopwatch');
        assert.ok(service);
    });

    test('service functionality', function (assert) {
        const service = this.owner.lookup('service:stopwatch');
        service.start();
        assert.ok(service.isRunning, `stopwatch should be running`);
        assert.equal(service.elapsedMillis, 0, `stopwatch tick has not been triggered yet`);

        this.nativeTimer.tick(DEFAULT_TICK_MILLIS);
        assert.equal(service.elapsedMillis, DEFAULT_TICK_MILLIS, `stopwatch has ticked`);
        assert.equal(service.systemElapsedMillis, DEFAULT_TICK_MILLIS, `system should be the same`);
        assert.equal(service.variance, 0, `should have no variance`);
        assert.equal(service.numTicks, 1, `one tick`);

        service.reset(true);
        this.nativeTimer.tick(DEFAULT_TICK_MILLIS);
        assert.equal(service.numTicks, 0, `0 ticks`);

        service.start();
        this.nativeTimer.tick(DEFAULT_TICK_MILLIS * 2 - 1);
        assert.equal(service.numTicks, 1, `1 tick`);
        // async reset
        service.reset();
        assert.equal(service.numTicks, 1, `still 1 tick`);
        this.nativeTimer.tick(1);
        assert.equal(service.numTicks, 0, `back to 0 ticks`);

        service.start();
        this.nativeTimer.tick(DEFAULT_TICK_MILLIS - 1);
        // async stop
        service.stop();
        this.nativeTimer.tick(DEFAULT_TICK_MILLIS * 10 + 1);
        assert.equal(service.numTicks, 1, `still has 1 tick`);
    });

    test('service listeners', function (assert) {
        const service = this.owner.lookup('service:stopwatch');
        assertStopwatchListeners(assert, service, this.nativeTimer);
    });
});
