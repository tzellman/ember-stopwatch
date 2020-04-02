import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import fakeTimers from '@sinonjs/fake-timers';
import { assertClockListeners } from '../shared';

module('Unit | Service | clock', function (hooks) {
    setupTest(hooks);

    hooks.beforeEach(function () {
        this.nativeTimer = fakeTimers.install({ now: 1585818794000 });
    });

    hooks.afterEach(function () {
        this.nativeTimer.uninstall();
    });

    test('it exists', function (assert) {
        const service = this.owner.lookup('service:clock');
        assert.ok(service);
    });

    test('service functionality', function (assert) {
        const service = this.owner.lookup('service:clock');
        assert.ok(service.time, `clock should be running`);
        assert.equal(service.date.getTime(), service.time, `time and date are equal`);
    });

    test('service listeners', function (assert) {
        const clock = this.owner.lookup('service:clock');
        assertClockListeners(assert, clock, this.nativeTimer);
    });
});
