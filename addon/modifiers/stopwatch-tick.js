import { assert } from '@ember/debug';
import { registerDestructor } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';
import Modifier from 'ember-modifier';
import Stopwatch from '../utils/stopwatch';

const modifierName = 'stopwatch-tick';

const cleanup = (instance) => {
    const { stopwatch } = instance;
    if (stopwatch) {
        try {
            stopwatch.off('tick', instance, instance._handler);
        } catch (error) {
            // ignore, in case the instance was not registered
        } finally {
            stopwatch.stop(true);
        }
    }
};

export default class StopwatchTickModifier extends Modifier {
    @tracked stopwatch;
    @tracked handler;
    @tracked durationMillis;
    @tracked numTicksHandled = 0;
    @tracked ticks;

    constructor(owner, args) {
        super(owner, args);
        registerDestructor(this, cleanup);
    }

    modify(element, positionalArgs, { ticks }) {
        assert(`You must provide at least 2 arguments for {{${modifierName}}}`, positionalArgs.length > 1);
        let durationMillis = positionalArgs[0];
        assert(
            `You must provide a positive number as the first positional argument for {{${modifierName}}}`,
            typeof durationMillis === 'number' && durationMillis > 0
        );
        this.durationMillis = durationMillis;
        this.ticks = ticks ?? 1;
        this.handler = positionalArgs[1];
        this.stopwatch = new Stopwatch(this.durationMillis);
        this.stopwatch.on('tick', this, this._handler);
        this.stopwatch.start(true);
    }

    _handler() {
        this.numTicksHandled++;
        if (this.numTicksHandled >= this.ticks) {
            this.stopwatch.stop(true);
            this.handler(this.stopwatch.elapsedMillis, this.stopwatch.numTicks);
        }
    }
}
