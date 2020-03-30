const micromatch = require('micromatch');

module.exports = {
    '*.{ts,yml,js,json,md,scss,css}': (files) => {
        const match = micromatch.not(files, [
            'package.json',
            'package-lock.json',
            '**/package.json',
            '**/package-lock.json'
        ]);
        return [
            ...match.map((filename) => `prettier --config ./.prettierrc --write '${filename}'`),
            ...match.map((filename) => `git add '${filename}'`)
        ];
    },
    '.prettierrc': (files) => {
        return [
            ...files.map((filename) => `prettier --config ./.prettierrc --write '${filename}'`),
            ...files.map((filename) => `git add '${filename}'`)
        ];
    }
};
