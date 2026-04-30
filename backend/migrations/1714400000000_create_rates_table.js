/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable("rates", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    type: {
      type: "varchar(10)",
      notNull: true,
      check: "type IN ('usd', 'gold', 'silver')",
    },
    value: {
      type: "decimal(10, 4)",
      notNull: true,
    },
    change_value: {
      type: "decimal(10, 4)",
      nullable: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Create index for efficient lookups by type
  pgm.createIndex("rates", "type");
  pgm.createIndex("rates", "updated_at");
  pgm.createIndex("rates", ["type", "updated_at"]);
};

export const down = (pgm) => {
  pgm.dropTable("rates");
};
