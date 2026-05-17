module.exports = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          moveElemsAttrsToGroup: false,
          moveGroupAttrsToElems: false,
          inlineStyles: false,
        },
      },
    },
  ],
};
