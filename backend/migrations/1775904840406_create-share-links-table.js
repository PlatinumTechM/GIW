/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(
    `
    CREATE TABLE share_links (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        token VARCHAR(255) UNIQUE NOT NULL,
        user_id BIGINT NOT NULL,
        filters JSONB NOT NULL,
        expiry TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_revoked BOOLEAN DEFAULT FALSE
    )
    `
  );

  // Create index on token for fast lookup
  pgm.sql(`CREATE INDEX idx_share_links_token ON share_links(token)`);
  
  // Create index on user_id for filtering
  pgm.sql(`CREATE INDEX idx_share_links_user_id ON share_links(user_id)`);
  
  // Create index on expiry for cleanup
  pgm.sql(`CREATE INDEX idx_share_links_expiry ON share_links(expiry)`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DROP TABLE share_links`);
};
