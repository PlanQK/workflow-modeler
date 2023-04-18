module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "commonjs": true,
        "node": true,
        "mocha": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": [2, "always"],
        "react/prop-types": "off",
        "no-prototype-builtins": "off",
        "react/jsx-key": "off",
    }
};
