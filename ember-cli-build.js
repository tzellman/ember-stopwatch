'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function (defaults) {
    const app = new EmberAddon(defaults, {
        autoImport: {
            webpack: {
                plugins: [new NodePolyfillPlugin({ includeAliases: ['util'] })]
            }
        },
        babel: {
            plugins: [...require('ember-cli-code-coverage').buildBabelPlugin()]
        },
        postcssOptions: {
            compile: {
                cacheInclude: [/.*\.(css|scss|hbs)$/, /.tailwind\.js$/],
                enabled: true,
                plugins: [require('tailwindcss')('./tests/dummy/config/tailwind.js'), require('autoprefixer')]
            }
        }
    });

    /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

    const { maybeEmbroider } = require('@embroider/test-setup');
    return maybeEmbroider(app, {
        skipBabel: [
            {
                package: 'qunit'
            }
        ]
    });
};
