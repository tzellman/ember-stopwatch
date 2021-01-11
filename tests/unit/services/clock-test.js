import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import fakeTimers from '@sinonjs/fake-timers';
import { assertClockListeners } from '../shared';

// force starting on a second boundary
// 2020-04-02T09:13:14.000Z
const SYSTEM_START = 1585818794000;

module('Unit | Service | clock', function (hooks) {
    setupTest(hooks);

    hooks.beforeEach(function () {
        this.nativeTimer = fakeTimers.install({ now: SYSTEM_START });
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

    test('clock tracked props are set on init', function (assert) {
        const clock = this.owner.lookup('service:clock');
        const systemStartDate = new Date(SYSTEM_START);

        assert.equal(
            clock.second,
            systemStartDate.getSeconds(),
            `second is set correctly: ${systemStartDate.getSeconds()}`
        );
        assert.equal(
            clock.minute,
            systemStartDate.getMinutes(),
            `minute is set correctly: ${systemStartDate.getMinutes()}`
        );
        assert.equal(clock.hour, systemStartDate.getHours(), `hour is set correctly: ${systemStartDate.getHours()}`);
        assert.equal(clock.day, systemStartDate.getDate(), `day is set correctly: ${systemStartDate.getDate()}`);

        assert.equal(clock.clock.second, clock.second, 'service second matches util second');
        assert.equal(clock.clock.minute, clock.minute, 'service minute matches util minute');
        assert.equal(clock.clock.hour, clock.hour, 'service hour matches util hour');
        assert.equal(clock.clock.day, clock.day, 'service day matches util day');
    });
});
