module.exports = {
  plugins: [
    require("postcss-prefix-selector")({
      prefix: ".bootstrap-scope",
      transform(prefix, selector, prefixedSelector) {
        if (selector.startsWith("html") || selector.startsWith(":root")) {
          return selector;
        }
        return prefixedSelector;
      },
    }),
  ],
};
