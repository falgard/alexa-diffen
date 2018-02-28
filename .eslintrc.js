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
        "airbnb-base"
      ],
    "rules": {
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
  