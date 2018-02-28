module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
      "ecmaVersion": 2017
    },
    "extends": [
        "airbnb-base",
        "plugin:import/errors",
        "prettier"
      ],
    "plugins": [
        "import",
        "prettier"
      ],
    "rules": {
        "prettier/prettier": "error",
        "import/no-extraneous-dependencies": ["error", {"packageDir": "."}],
        "import/prefer-default-export": 0,
        "no-underscore-dangle": 0,
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
  