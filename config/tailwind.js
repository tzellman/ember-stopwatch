module.exports = {
    content: ['./tests/**/*.{hbs,js}'],
    safelist: [
        {
            pattern: /bg-(green|red|orange)-500/
        },
        {
            pattern: /bg-(green|red|orange)-700/,
            variants: ['hover']
        }
    ]
};
