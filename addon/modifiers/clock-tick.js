import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';

const modifierName = 'clock-tick';

const parseTickType = (tickType) => {
    let parsedType = undefined;
    if (/^((second|sec)s?|tick)$/i.test(tickType)) {
        parsedType = 'second';
    } else if (/^((minute|min)s?)$/i.test(tickType)) {
        parsedType = 'minute';
    } else if (/^((hour)s?)$/i.test(tickType)) {
        parsedType = 'hour';
    } else if (/^((day)s?)$/i.test(tickType)) {
        parsedType = 'day';
    }
    return parsedType;
};

export default class ClockTickModifier extends Modifier {
    @service clock;
    @tracked tickType;

    get handler() {
        return this.args.positional[1];
    }

    didReceiveArguments() {
        assert(`You must provide at least 2 arguments for {{${modifierName}}}`, this.args.positional.length > 1);
        let tickType = this.args.positional[0];
        assert(
            `You must provide a string as the first positional argument for {{${modifierName}}}`,
            typeof tickType === 'string' && tickType.length > 0
        );
        this.tickType = parseTickType(tickType);
        assert(`You provided an invalid duration argument {{${tickType}}}`, !!this.tickType);
        this.clock.on(this.tickType, this, this._handler);
    }

    willRemove() {
        if (this.tickType) {
            this.clock.off(this.tickType, this, this._handler);
        }
    }

    _handler() {
        this.handler(this.clock.time);
    }
}
