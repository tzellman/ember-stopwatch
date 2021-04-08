import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, setupOnerror } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import fakeTimers from '@sinonjs/fake-timers';
import { SECOND_RESOLUTION } from 'ember-stopwatch/utils/clock';

// force starting on a second boundary
// 2020-04-02T09:13:14.000Z
const SYSTEM_START = 1585818794000;

module('Integration | Modifier | stopwatch-tick', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.nativeTimer = fakeTimers.install({ now: SYSTEM_START });
    });

    hooks.afterEach(function () {
        setupOnerror();
        this.nativeTimer.uninstall();
    });

    test('it asserts when not enough arguments are provided', async function (assert) {
        setupOnerror((err) =>
            assert.equal(err.message, `Assertion Failed: You must provide at least 2 arguments for {{stopwatch-tick}}`)
        );
        await render(hbs`<div {{stopwatch-tick}}></div>`);
    });

    test('it asserts when an invalid duration is provided', async function (assert) {
        assert.expect(2);
        setupOnerror((err) =>
            assert.equal(
                err.message,
                `Assertion Failed: You must provide a positive number as the first positional argument for {{stopwatch-tick}}`
            )
        );
        this.set('foo', () => {
            assert.notOk(true, 'Should not have made it here');
        });
        await render(hbs`<div {{stopwatch-tick "foo" foo}}></div>`);
        await render(hbs`<div {{stopwatch-tick 0 foo}}></div>`);
    });

    test('it renders with args and named args', async function (assert) {
        const reset = () => {
            this.set('status', 'running');
            this.set('duration', 0);
            this.set('ticks', 0);
            this.set('foo', (duration, ticks) => {
                this.set('status', 'done');
                this.set('duration', duration);
                this.set('ticks', ticks);
            });
        };
        reset();
        await render(hbs`<div {{stopwatch-tick 1000 foo}}>{{status}},{{duration}},{{ticks}}</div>`);
        assert.equal(this.element.textContent.trim(), 'running,0,0');
        this.nativeTimer.tick(SECOND_RESOLUTION);
        assert.equal(this.element.textContent.trim(), `done,${SECOND_RESOLUTION},1`);

        reset();
        await render(hbs`<div {{stopwatch-tick 1000 foo ticks=5}}>{{status}},{{duration}},{{ticks}}</div>`);
        assert.equal(this.element.textContent.trim(), 'running,0,0');
        this.nativeTimer.tick(SECOND_RESOLUTION * 10);
        assert.equal(this.element.textContent.trim(), `done,${SECOND_RESOLUTION * 5},5`);
    });
});
