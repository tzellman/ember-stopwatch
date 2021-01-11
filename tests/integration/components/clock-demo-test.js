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

    test('should render new values for each clock type, but only when respective time divisions change', async function (assert) {
        await render(hbs`<ClockDemo/>`);

        const originalSecondClock = find('[data-test-second-clock]').textContent;
        const originalMinuteClock = find('[data-test-minute-clock]').textContent;
        const originalHourClock = find('[data-test-hour-clock]').textContent;
        const originalDayClock = find('[data-test-day-clock]').textContent;

        this.nativeTimer.tick(1000); // Move forward a second
        await this.nativeTimer.nextAsync();

        assert.notEqual(find('[data-test-second-clock]').textContent, originalSecondClock);
        assert.equal(find('[data-test-minute-clock]').textContent, originalMinuteClock);
        assert.equal(find('[data-test-hour-clock]').textContent, originalHourClock);
        assert.equal(find('[data-test-day-clock]').textContent, originalDayClock);

        this.nativeTimer.tick(1000 * 60); // Move forward a minute
        await this.nativeTimer.nextAsync();

        assert.notEqual(find('[data-test-second-clock]').textContent, originalSecondClock);
        assert.notEqual(find('[data-test-minute-clock]').textContent, originalMinuteClock);
        assert.equal(find('[data-test-hour-clock]').textContent, originalHourClock);
        assert.equal(find('[data-test-day-clock]').textContent, originalDayClock);

        this.nativeTimer.tick(1000 * 60 * 60); // Move forward an hour
        await this.nativeTimer.nextAsync();

        assert.notEqual(find('[data-test-second-clock]').textContent, originalSecondClock);
        assert.notEqual(find('[data-test-minute-clock]').textContent, originalMinuteClock);
        assert.notEqual(find('[data-test-hour-clock]').textContent, originalHourClock);
        assert.equal(find('[data-test-day-clock]').textContent, originalDayClock);

        this.nativeTimer.tick(1000 * 60 * 60 * 24); // Move forward a day
        await this.nativeTimer.nextAsync();
        assert.notEqual(find('[data-test-second-clock]').textContent, originalSecondClock);
        assert.notEqual(find('[data-test-minute-clock]').textContent, originalMinuteClock);
        assert.notEqual(find('[data-test-hour-clock]').textContent, originalHourClock);
        assert.notEqual(find('[data-test-day-clock]').textContent, originalDayClock);
    });
});
