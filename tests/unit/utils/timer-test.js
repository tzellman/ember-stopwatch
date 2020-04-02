import Timer, { DEFAULT_RESOLUTION_MILLIS } from 'ember-stopwatch/utils/timer';
import fakeTimers from '@sinonjs/fake-timers';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utility | timer', function (hooks) {
    setupTest(hooks);

    hooks.beforeEach(function () {
        this.nativeTimer = fakeTimers.install({ now: 1585571174374 });
    });

    hooks.afterEach(function () {
        this.nativeTimer.uninstall();
    });

    test('can create with default resolution', function (assert) {
        let timer = new Timer(DEFAULT_RESOLUTION_MILLIS * 10);
        assert.ok(timer);
        assert.equal(timer.expirationMillis, DEFAULT_RESOLUTION_MILLIS * 10);
        assert.equal(timer.resolutionMillis, DEFAULT_RESOLUTION_MILLIS);
    });

    test('can create with expiration lower than default resolution', function (assert) {
        let timer = new Timer(DEFAULT_RESOLUTION_MILLIS - 1);
        assert.ok(timer);
        assert.equal(timer.expirationMillis, DEFAULT_RESOLUTION_MILLIS - 1);
        assert.equal(timer.resolutionMillis, DEFAULT_RESOLUTION_MILLIS - 1);
    });

    test('can attempt to create with higher resolution than expiration', function (assert) {
        let timer = new Timer(DEFAULT_RESOLUTION_MILLIS, DEFAULT_RESOLUTION_MILLIS * 2);
        assert.ok(timer);
        assert.equal(timer.expirationMillis, DEFAULT_RESOLUTION_MILLIS);
        assert.equal(timer.resolutionMillis, DEFAULT_RESOLUTION_MILLIS);
    });

    test('checks that remainingMillis updates', function (assert) {
        let timer = new Timer(1000);
        timer.start();
        assert.ok(timer.isRunning, `timer should be running`);

        for (let i = 1; i <= 5; ++i) {
            this.nativeTimer.tick(200);
            assert.equal(timer.remainingMillis, 1000 - i * 200, `timer expiration is accurate`);
            if (i < 5) {
                assert.ok(timer.isRunning, `timer should be running`);
            } else {
                assert.notOk(timer.isRunning, `timer should not be running`);
            }
        }

        this.nativeTimer.tick(200);
        assert.equal(timer.remainingMillis, 0, `timer remaining should still be 0`);
    });

    test('checks that multiple starts work', function (assert) {
        let timer = new Timer(1000);
        timer.start();

        this.nativeTimer.tick(1000);
        assert.equal(timer.remainingMillis, 0, `timer expiration is accurate`);
        assert.notOk(timer.isRunning, `timer should not be running`);
        assert.ok(timer.isExpired, `timer should be expired`);

        // now start it back up and make sure things are "reset" properly
        timer.start();
        assert.equal(timer.remainingMillis, 1000, `timer expiration is accurate`);
        this.nativeTimer.tick(800);
        assert.ok(timer.isRunning, `timer should not be running`);
        assert.equal(timer.remainingMillis, 200, `timer expiration is accurate`);
    });

    test('checks that stop works', function (assert) {
        let timer = new Timer(1000);
        timer.start();

        this.nativeTimer.tick(200);
        assert.equal(timer.remainingMillis, 800, `timer expiration is accurate`);

        // note that I force a stop so it doesn't do one more tick (since we landed directly on a tick)
        timer.stop(true);
        this.nativeTimer.tick(800);
        assert.equal(timer.remainingMillis, 800, `timer expiration did not change`);

        timer.start();
        this.nativeTimer.tick(200);
        assert.equal(timer.remainingMillis, 600, `timer expiration is accurate`);

        // if we do not force a stop, the next tick will complete first
        timer.stop();
        this.nativeTimer.tick(800);
        assert.equal(timer.remainingMillis, 500, `timer expiration is accurate`);
    });

    test('checks that pause works', function (assert) {
        let timer = new Timer(1000);
        timer.start();

        this.nativeTimer.tick(200);

        // force pause
        timer.pause(true);
        this.nativeTimer.tick(800);
        assert.equal(timer.remainingMillis, 800, `timer expiration did not change`);

        timer.start();
        this.nativeTimer.tick(200);
        assert.equal(timer.remainingMillis, 600, `timer expiration is accurate`);

        timer.pause();
        this.nativeTimer.tick(800);
        assert.equal(timer.remainingMillis, 500, `timer expiration is accurate`);
    });

    test('checks that restart works', function (assert) {
        let timer = new Timer(1000);
        timer.start();

        this.nativeTimer.tick(200);
        assert.equal(timer.remainingMillis, 800, `timer expiration is accurate`);
        timer.restart();
        assert.equal(timer.remainingMillis, 1000, `timer expiration is accurate`);
        this.nativeTimer.tick(200);
        assert.equal(timer.remainingMillis, 800, `timer expiration is accurate`);
    });

    test('checks that event listeners receive events', function (assert) {
        let timer = new Timer(1000);
        let expiredCount = 0;
        const onHandler = () => {
            expiredCount++;
        };
        const expiredHandler = onHandler.bind(this);

        timer.on('expired', expiredHandler);
        // make sure the handler was subscribed
        assert.ok(timer.has('expired'));

        timer.start();
        this.nativeTimer.tick(300);
        assert.equal(expiredCount, 0, `should not have expired yet`);

        this.nativeTimer.tick(700);
        assert.equal(expiredCount, 1, `should have expired`);

        this.nativeTimer.tick(10000);
        assert.equal(expiredCount, 1, `should have expired once still`);

        timer.restart();
        this.nativeTimer.tick(2000);
        assert.equal(expiredCount, 2, `second expiration`);
    });
});
