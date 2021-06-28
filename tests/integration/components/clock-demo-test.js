import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { find } from '@ember/test-helpers';

import fakeTimers from '@sinonjs/fake-timers';

module('Integration | Component | ClockDemo', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.nativeTimer = fakeTimers.install();
    });

    hooks.afterEach(function () {
        this.nativeTimer.uninstall();
    });

    const assertEqualTrim = (assert, s1, s2, msg) => assert.equal((s1 || '').trim(), (s2 || '').trim(), msg);
    // NOTE: On Ember 3.12 the notEqual helper adds a NOT in the result value... hence why I'm using notOk
    const assertNotEqualTrim = (assert, s1, s2, msg) => assert.notOk((s1 || '').trim() === (s2 || '').trim(), msg);

    test('should render new values for each clock type, but only when respective time divisions change', async function (assert) {
        assert.expect(16);
        await render(hbs`<ClockDemo/>`);

        const secondClockSelector = '[data-test-second-clock]';
        const minuteClockSelector = '[data-test-minute-clock]';
        const hourClockSelector = '[data-test-hour-clock]';
        const dayClockSelector = '[data-test-day-clock]';

        const originalSecondClock = find(secondClockSelector).textContent;
        const originalMinuteClock = find(minuteClockSelector).textContent;
        const originalHourClock = find(hourClockSelector).textContent;
        const originalDayClock = find(dayClockSelector).textContent;

        this.nativeTimer.tick(1000); // Move forward a second
        await this.nativeTimer.nextAsync();

        assertNotEqualTrim(assert, find(secondClockSelector).textContent, originalSecondClock, 'seconds should change');
        assertEqualTrim(assert, find(minuteClockSelector).textContent, originalMinuteClock, 'no change to minutes');
        assertEqualTrim(assert, find(hourClockSelector).textContent, originalHourClock, 'no change to hour');
        assertEqualTrim(assert, find(dayClockSelector).textContent, originalDayClock, 'no change to day');

        this.nativeTimer.tick(1000 * 60); // Move forward a minute
        await this.nativeTimer.nextAsync();

        assertNotEqualTrim(assert, find(secondClockSelector).textContent, originalSecondClock, 'seconds should change');
        assertNotEqualTrim(assert, find(minuteClockSelector).textContent, originalMinuteClock, 'minutes should change');
        assertEqualTrim(assert, find(hourClockSelector).textContent, originalHourClock, 'no change to hour');
        assertEqualTrim(assert, find(dayClockSelector).textContent, originalDayClock, 'no change to day');

        this.nativeTimer.tick(1000 * 60 * 60); // Move forward an hour
        await this.nativeTimer.nextAsync();

        assertNotEqualTrim(assert, find(secondClockSelector).textContent, originalSecondClock, 'seconds should change');
        assertNotEqualTrim(assert, find(minuteClockSelector).textContent, originalMinuteClock, 'minutes should change');
        assertNotEqualTrim(assert, find(hourClockSelector).textContent, originalHourClock, 'hour should change');
        assertEqualTrim(assert, find(dayClockSelector).textContent, originalDayClock, 'no change to day');

        this.nativeTimer.tick(1000 * 60 * 60 * 24); // Move forward a day
        await this.nativeTimer.nextAsync();
        assertNotEqualTrim(assert, find(secondClockSelector).textContent, originalSecondClock, 'seconds should change');
        assertNotEqualTrim(assert, find(minuteClockSelector).textContent, originalMinuteClock, 'minutes should change');
        assertNotEqualTrim(assert, find(hourClockSelector).textContent, originalHourClock, 'hour should change');
        assertNotEqualTrim(assert, find(dayClockSelector).textContent, originalDayClock, 'day should change');
    });
});
