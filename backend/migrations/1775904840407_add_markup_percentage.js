exports.up = (pgm) => {
  pgm.addColumn("share_links", {
    markup_percentage: {
      type: "numeric",
      notNull: false,
      default: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("share_links", "markup_percentage");
};
