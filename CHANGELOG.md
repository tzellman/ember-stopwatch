# Changelog

### 1.1.0

This is a minor release composed primarily of dependency updates.

#### Changes

-   Updated to Ember 4.7.x
-   Updated most other dependencies to the latest

### 1.0.0

🎉 This is the first major release of ember-stopwatch! 🎉

#### Changes

-   Updated to Ember 4.x
-   Updated to use ember-auto-import 2.x
-   Updated most other dependencies to the latest

### 0.7.0

This is a minor release composed primarily of dependency updates, and a new modifier.

#### Changes

-   Added `call-after` modifier (alias of `stopwatch-tick`)
-   Updated to Ember CLI 3.28
-   Updated several dependencies to the latest versions
-   Dropped support for Node.js v10.0
-   linting fixes after eslint plugin updates, in tests

### 0.6.0

This is a minor release that adds no new functionality to the core addon. Primarily dependency updates and test lint/assertion updates.

#### Changes

-   Updated to Ember CLI 3.27
-   Updated several dependencies to the latest versions
-   Removed usage of `moment` and `ember-cli-moment-shim` dependencies due to build errors (added a test helper for formatting dates)

### 0.5.0

This is a minor release that adds two new render `modifier`s that can help reduce setup/teardown logic.

#### Changes

-   Added `clock-tick` and `stopwatch-tick` render modifiers
-   Updated to several dependencies (eslint\*, qunit)
-   Updated to Ember CLI 3.26

### 0.4.0

This is a minor release with no new features, mainly dependency updates.

#### Changes

-   Updated to Ember CLI 3.25.3
-   Bumped versions of most dependencies to latest

### 0.3.0

This is a minor release with some new backwards-compatible features.

#### Notable Changes

-   Added tracked properties for `second`, `minute`, `hour` and `day` to the `clock` service. Thanks @arthur5005!
-   Bumped most dependencies to latest, including Ember/CLI 3.24

#### Other Changes

-   Integrated with GitHub Actions for CI and demo publishing
-   Updated to use `pretty-quick` instead of `lint-staged`
-   Updated to use `ember-cli-terser` instead of `ember-cli-uglify`

### 0.2.1

-   Bumped most dependencies to latest, including Ember 3.17 -> 3.22
