import Modifier from 'ember-modifier';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import Stopwatch from '../utils/stopwatch';

const modifierName = 'stopwatch-tick';

export default class StopwatchTickModifier extends Modifier {
    @tracked stopwatch;
    @tracked durationMillis;
    @tracked numTicksHandled = 0;

    get handler() {
        return this.args.positional[1];
    }

    get ticks() {
        return this.args.named.ticks ?? 1;
    }

    didReceiveArguments() {
        assert(`You must provide at least 2 arguments for {{${modifierName}}}`, this.args.positional.length > 1);
        let durationMillis = this.args.positional[0];
        assert(
            `You must provide a positive number as the first positional argument for {{${modifierName}}}`,
            typeof durationMillis === 'number' && durationMillis > 0
        );
        this.durationMillis = durationMillis;
        this.stopwatch = new Stopwatch(this.durationMillis);
        this.stopwatch.on('tick', this, this._handler);
        this.stopwatch.start(true);
    }

    willRemove() {
        if (this.stopwatch) {
            this.stopwatch.off('tick', this, this._handler);
            this.stopwatch.stop(true);
        }
    }

    _handler() {
        this.numTicksHandled++;
        if (this.numTicksHandled >= this.ticks) {
            this.stopwatch.stop(true);
            this.handler(this.stopwatch.elapsedMillis, this.stopwatch.numTicks);
        }
    }
}
