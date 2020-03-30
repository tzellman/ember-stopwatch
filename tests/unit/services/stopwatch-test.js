import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | stopwatch', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        let service = this.owner.lookup('service:stopwatch');
        assert.ok(service);
    });
});
