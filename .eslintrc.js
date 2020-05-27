module.exports = {
    "env": {
        "browser": true,
        "es6": true,
    },
    "extends": ["airbnb-base", "eslint:recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "rules": {
        indent: ["warn", 4],
        semi: "off",
        quotes: ["error", "double"],
        "no-param-reassign": "off",
    }
};