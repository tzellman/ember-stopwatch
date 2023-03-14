import { assert } from '@ember/debug';
import { registerDestructor } from '@ember/destroyable';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Modifier from 'ember-modifier';

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

const cleanup = (instance) => {
    const { tickType, clock } = instance;
    if (tickType) {
        clock.off(tickType, instance, instance._handler);
    }
};

export default class ClockTickModifier extends Modifier {
    @service clock;
    @tracked tickType;
    @tracked handler;

    constructor(owner, args) {
        super(owner, args);
        registerDestructor(this, cleanup);
    }

    modify(element, positionalArgs) {
        assert(`You must provide at least 2 arguments for {{${modifierName}}}`, positionalArgs.length > 1);
        let tickType = positionalArgs[0];
        assert(
            `You must provide a string as the first positional argument for {{${modifierName}}}`,
            typeof tickType === 'string' && tickType.length > 0
        );
        this.tickType = parseTickType(tickType);
        assert(`You provided an invalid duration argument {{${tickType}}}`, !!this.tickType);
        this.handler = positionalArgs[1];
        this.clock.on(this.tickType, this, this._handler);
    }

    _handler() {
        this.handler(this.clock.time);
    }
}
