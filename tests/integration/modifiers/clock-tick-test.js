import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, setupOnerror } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import fakeTimers from '@sinonjs/fake-timers';
import { SECOND_RESOLUTION } from 'ember-stopwatch/utils/clock';

// force starting on a second boundary
// 2020-04-02T09:13:14.000Z
const SYSTEM_START = 1585818794000;

module('Integration | Modifier | clock-tick', function (hooks) {
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
            assert.equal(err.message, `Assertion Failed: You must provide at least 2 arguments for {{clock-tick}}`)
        );
        await render(hbs`<div {{clock-tick}}></div>`);
    });

    test('it asserts when a non-string tickType is provided', async function (assert) {
        assert.expect(1);
        setupOnerror((err) =>
            assert.equal(
                err.message,
                `Assertion Failed: You must provide a string as the first positional argument for {{clock-tick}}`
            )
        );
        this.set('foo', () => {
            assert.notOk(true, 'Should not have made it here');
        });
        await render(hbs`<div {{clock-tick foo foo}}></div>`);
    });

    test('it asserts when an invalid tickType is provided', async function (assert) {
        assert.expect(1);
        setupOnerror((err) =>
            assert.equal(err.message, `Assertion Failed: You provided an invalid duration argument {{foo}}`)
        );
        this.set('foo', () => {
            assert.notOk(true, 'Should not have made it here');
        });
        await render(hbs`<div {{clock-tick "foo" foo}}></div>`);
    });

    test('it renders', async function (assert) {
        this.set('foo', (time) => {
            this.set('time', time);
        });
        await render(hbs`<div {{clock-tick "second" foo}}>{{time}}</div>`);
        assert.equal(this.element.textContent.trim(), '');
        this.nativeTimer.tick(SECOND_RESOLUTION);
        assert.equal(this.element.textContent.trim(), `${1585818794000 + SECOND_RESOLUTION}`);
    });
});
