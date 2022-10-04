import { render, setupOnerror } from '@ember/test-helpers';
import fakeTimers from '@sinonjs/fake-timers';
import { hbs } from 'ember-cli-htmlbars';
import { SECOND_RESOLUTION } from 'ember-stopwatch/utils/clock';
import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';

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
        assert.expect(1);
        setupOnerror((err) =>
            assert.strictEqual(
                err.message,
                `Assertion Failed: You must provide at least 2 arguments for {{clock-tick}}`
            )
        );
        await render(hbs`<div {{clock-tick}}></div>`);
    });

    test('it asserts when a non-string tickType is provided', async function (assert) {
        assert.expect(1);
        setupOnerror((err) =>
            assert.strictEqual(
                err.message,
                `Assertion Failed: You must provide a string as the first positional argument for {{clock-tick}}`
            )
        );
        this.set('foo', () => {
            assert.notOk(true, 'Should not have made it here');
        });
        await render(hbs`<div {{clock-tick this.foo this.foo}}></div>`);
    });

    test('it asserts when an invalid tickType is provided', async function (assert) {
        assert.expect(1);
        setupOnerror((err) =>
            assert.strictEqual(err.message, `Assertion Failed: You provided an invalid duration argument {{foo}}`)
        );
        this.set('foo', () => {
            assert.notOk(true, 'Should not have made it here');
        });
        await render(hbs`<div {{clock-tick "foo" this.foo}}></div>`);
    });

    test('it renders', async function (assert) {
        assert.expect(2);
        this.set('foo', (time) => {
            this.set('time', time);
        });
        await render(hbs`<div {{clock-tick "second" this.foo}}>{{this.time}}</div>`);
        assert.strictEqual(this.element.textContent.trim(), '');
        this.nativeTimer.tick(SECOND_RESOLUTION);
        assert.strictEqual(this.element.textContent.trim(), `${1585818794000 + SECOND_RESOLUTION}`);
    });
});
