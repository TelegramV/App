module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "exclude": [
          "babel-plugin-transform-exponentiation-operator"
        ],
        "useBuiltIns": "entry",
        "corejs": "3"
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    [
      "@babel/plugin-transform-react-jsx",
      {
        "pragma": "VRDOM.createElement",
        "pragmaFrag": "VRDOM.Fragment"
      }
    ]
  ],
  "env": {
    "test": {
      "plugins": ["@babel/plugin-transform-modules-commonjs"]
    }
  }
}
